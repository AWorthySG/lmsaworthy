/**
 * ━━━ A Worthy — 3D Hero Scene ━━━
 * Cyberpunk neon exam hall with animated camera flythrough.
 * Built with Three.js. Renders inside a container element.
 *
 * Usage:
 *   import { initHeroScene, destroyHeroScene } from './scene.js';
 *   initHeroScene(document.getElementById('hero-container'));
 *
 * The scene depicts a student in an exam hall with an O-Level English paper.
 * Camera animates to zoom into the exam paper, with callout overlays
 * describing question types and the A Worthy approach.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/geometries/TextGeometry.js';

// ━━━ STATE ━━━
let scene, camera, renderer, controls, animationId;
let container, overlayEl;
let clock;
let phase = 0; // 0=wide shot, 1=zooming, 2=paper focus, 3=callouts
let phaseTime = 0;
const disposables = []; // track for cleanup

// ━━━ NEON PALETTE ━━━
const NEON = {
  cyan: 0x00ffc8,
  pink: 0xff2d7b,
  purple: 0x8b5cf6,
  blue: 0x3b82f6,
  orange: 0xff8c3a,
  dark: 0x0a0a12,
  floor: 0x0d0d1a,
  desk: 0x1a1a2e,
  paper: 0xf0ede6,
};

// ━━━ CALLOUT DATA ━━━
const CALLOUTS = [
  {
    id: 'q1-compre',
    delay: 0,
    position: { left: '8%', top: '25%' },
    tag: 'Section A · Comprehension',
    title: 'Visual Text & Comprehension',
    body: 'The A Worthy approach: Read the passage twice — first for gist, second for evidence. Use the RUAC method for inference questions.',
  },
  {
    id: 'q2-summary',
    delay: 0.8,
    position: { right: '8%', top: '35%' },
    tag: 'Section B · Summary Writing',
    title: 'Summary in 80 Words',
    body: 'A Worthy technique: Identify key points, eliminate redundancy, paraphrase with precision. Never lift phrases directly from the passage.',
  },
  {
    id: 'q3-sit',
    delay: 1.6,
    position: { left: '8%', top: '55%' },
    tag: 'Section C · Situational Writing',
    title: 'Formal Letter / Report',
    body: 'Format matters. A Worthy drills: salutation, sign-off, tone calibration. Content points must address ALL bullet points in the question.',
  },
  {
    id: 'q4-essay',
    delay: 2.4,
    position: { right: '8%', top: '65%' },
    tag: 'Section D · Continuous Writing',
    title: 'Narrative or Argumentative',
    body: 'A Worthy framework: Story Architect for narratives (exposition → climax → resolution), PEEL for argumentative paragraphs.',
  },
];

// ━━━ HELPERS ━━━

/** Create a neon-glowing line */
function createNeonLine(points, color, opacity = 0.6) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  disposables.push(geometry, material);
  return new THREE.Line(geometry, material);
}

/** Create a glowing box (desk, wall panel, etc.) */
function createBox(w, h, d, color, emissive = 0x000000, emissiveIntensity = 0) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshStandardMaterial({
    color, emissive, emissiveIntensity,
    roughness: 0.7, metalness: 0.1,
  });
  disposables.push(geometry, material);
  return new THREE.Mesh(geometry, material);
}

/** Create glowing text on a plane (for exam paper) */
function createTextPlane(text, w, h, fontSize, color, bgColor) {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio, 2);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Text
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textBaseline = 'top';

  const lines = text.split('\n');
  let y = 20;
  for (const line of lines) {
    ctx.fillText(line, 20, y);
    y += fontSize * 1.5;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const geometry = new THREE.PlaneGeometry(w / 100, h / 100);
  const material = new THREE.MeshStandardMaterial({
    map: texture, roughness: 0.9, metalness: 0,
  });
  disposables.push(geometry, material, texture);
  return new THREE.Mesh(geometry, material);
}

// ━━━ SCENE CONSTRUCTION ━━━

function buildScene() {
  // ── Floor ──
  const floorGeo = new THREE.PlaneGeometry(40, 40);
  const floorMat = new THREE.MeshStandardMaterial({
    color: NEON.floor, roughness: 0.85, metalness: 0.05,
  });
  disposables.push(floorGeo, floorMat);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  scene.add(floor);

  // ── Floor grid lines (cyberpunk) ──
  for (let i = -20; i <= 20; i += 2) {
    const pts = [new THREE.Vector3(i, 0.01, -20), new THREE.Vector3(i, 0.01, 20)];
    scene.add(createNeonLine(pts, NEON.cyan, 0.06));
    const pts2 = [new THREE.Vector3(-20, 0.01, i), new THREE.Vector3(20, 0.01, i)];
    scene.add(createNeonLine(pts2, NEON.cyan, 0.06));
  }

  // ── Exam desks (rows of desks) ──
  const deskRows = 4;
  const desksPerRow = 5;
  for (let row = 0; row < deskRows; row++) {
    for (let col = 0; col < desksPerRow; col++) {
      const x = (col - (desksPerRow - 1) / 2) * 3;
      const z = row * 3 - 2;

      // Desk
      const desk = createBox(1.8, 0.06, 1.0, NEON.desk, NEON.cyan, 0.02);
      desk.position.set(x, 0.75, z);
      scene.add(desk);

      // Desk legs
      for (const lx of [-0.8, 0.8]) {
        for (const lz of [-0.4, 0.4]) {
          const leg = createBox(0.04, 0.75, 0.04, 0x15152a);
          leg.position.set(x + lx, 0.375, z + lz);
          scene.add(leg);
        }
      }

      // Chair
      const chairSeat = createBox(0.6, 0.04, 0.5, 0x1e1e38, NEON.purple, 0.01);
      chairSeat.position.set(x, 0.45, z + 0.8);
      scene.add(chairSeat);

      const chairBack = createBox(0.6, 0.5, 0.04, 0x1e1e38, NEON.purple, 0.01);
      chairBack.position.set(x, 0.7, z + 1.05);
      scene.add(chairBack);

      // Student (simplified figure — capsule body)
      if (row < 3 || col !== 2) { // leave centre front empty for "our" student
        const bodyGeo = new THREE.CapsuleGeometry(0.15, 0.5, 4, 8);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0x2a2a4a, emissive: NEON.blue, emissiveIntensity: 0.03,
          roughness: 0.8,
        });
        disposables.push(bodyGeo, bodyMat);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(x, 0.95, z + 0.8);
        scene.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({
          color: 0xd4a574, roughness: 0.7,
        });
        disposables.push(headGeo, headMat);
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(x, 1.35, z + 0.75);
        scene.add(head);
      }
    }
  }

  // ── Main student (front centre, more detailed) ──
  const mainX = 0, mainZ = -2 + 3 * 3 + 0.8; // front row centre
  // This student is leaning forward slightly
  const mainBody = createBox(0.35, 0.6, 0.25, 0x1a1a3e, NEON.cyan, 0.05);
  mainBody.position.set(mainX, 1.0, mainZ - 0.1);
  mainBody.rotation.x = 0.15; // leaning forward
  scene.add(mainBody);

  const mainHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.6 })
  );
  disposables.push(mainHead.geometry, mainHead.material);
  mainHead.position.set(mainX, 1.4, mainZ - 0.2);
  scene.add(mainHead);

  // ── Exam paper on main student's desk ──
  const paperText = `
  1184/01
  GCE O LEVEL
  ENGLISH LANGUAGE
  Paper 1
  ─────────────────────────

  SECTION A: Visual Text
  SECTION B: Summary (80 words)
  SECTION C: Situational Writing
  SECTION D: Continuous Writing

  Time allowed: 1 hour 50 minutes
  ─────────────────────────
  DO NOT OPEN THIS PAPER UNTIL
  YOU ARE TOLD TO DO SO
  `.trim();

  const paper = createTextPlane(paperText, 400, 550, 14, '#1a1a2e', '#f0ede6');
  paper.position.set(mainX, 0.79, mainZ - 0.9);
  paper.rotation.x = -Math.PI / 2;
  paper.scale.set(0.4, 0.4, 0.4);
  scene.add(paper);

  // ── Neon edge glow on paper ──
  const paperEdge = new THREE.Mesh(
    new THREE.PlaneGeometry(1.75, 2.4),
    new THREE.MeshBasicMaterial({ color: NEON.cyan, transparent: true, opacity: 0.04 })
  );
  disposables.push(paperEdge.geometry, paperEdge.material);
  paperEdge.position.set(mainX, 0.78, mainZ - 0.9);
  paperEdge.rotation.x = -Math.PI / 2;
  paperEdge.scale.set(0.4, 0.4, 0.4);
  scene.add(paperEdge);

  // ── Walls (back wall with neon strips) ──
  const backWall = createBox(40, 6, 0.1, 0x0d0d1a);
  backWall.position.set(0, 3, -5);
  scene.add(backWall);

  // Neon strips on wall
  for (let i = 0; i < 5; i++) {
    const strip = createBox(8, 0.08, 0.05, 0x000000, NEON.cyan, 1.5);
    strip.position.set(-16 + i * 8, 4.5, -4.9);
    scene.add(strip);
  }

  // Side neon pillars
  for (const side of [-1, 1]) {
    const pillar = createBox(0.15, 5, 0.15, 0x0d0d1a, NEON.pink, 0.3);
    pillar.position.set(side * 10, 2.5, -4);
    scene.add(pillar);

    const pillar2 = createBox(0.15, 5, 0.15, 0x0d0d1a, NEON.purple, 0.3);
    pillar2.position.set(side * 10, 2.5, 5);
    scene.add(pillar2);
  }

  // ── Clock on wall ──
  const clockFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 24),
    new THREE.MeshStandardMaterial({ color: 0x111122, emissive: NEON.cyan, emissiveIntensity: 0.15 })
  );
  disposables.push(clockFace.geometry, clockFace.material);
  clockFace.position.set(0, 4.2, -4.88);
  scene.add(clockFace);

  // Clock border ring
  const clockRing = new THREE.Mesh(
    new THREE.RingGeometry(0.38, 0.42, 32),
    new THREE.MeshBasicMaterial({ color: NEON.cyan, transparent: true, opacity: 0.5 })
  );
  disposables.push(clockRing.geometry, clockRing.material);
  clockRing.position.set(0, 4.2, -4.87);
  scene.add(clockRing);

  // ── Floating holographic exam code ──
  const holoCanvas = document.createElement('canvas');
  holoCanvas.width = 512;
  holoCanvas.height = 128;
  const hctx = holoCanvas.getContext('2d');
  hctx.fillStyle = 'transparent';
  hctx.fillRect(0, 0, 512, 128);
  hctx.font = 'bold 48px "Courier New"';
  hctx.fillStyle = '#00ffc8';
  hctx.textAlign = 'center';
  hctx.fillText('1184 / ENGLISH', 256, 70);
  const holoTex = new THREE.CanvasTexture(holoCanvas);
  const holoMat = new THREE.MeshBasicMaterial({
    map: holoTex, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
  });
  const holoGeo = new THREE.PlaneGeometry(4, 1);
  disposables.push(holoGeo, holoMat, holoTex);
  const holo = new THREE.Mesh(holoGeo, holoMat);
  holo.position.set(0, 5, -3);
  scene.add(holo);

  // ── Ambient particles (floating dust/data points) ──
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: NEON.cyan, size: 0.03, transparent: true, opacity: 0.4,
  });
  disposables.push(particleGeo, particleMat);
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  return { particles, holo, paper };
}

// ━━━ CAMERA ANIMATION ━━━

const CAMERA_KEYFRAMES = [
  // Phase 0: Wide establishing shot (orbiting)
  { pos: new THREE.Vector3(8, 5, 14), look: new THREE.Vector3(0, 1, 2), duration: 4 },
  // Phase 1: Push in toward the main student
  { pos: new THREE.Vector3(2, 2.5, 10), look: new THREE.Vector3(0, 0.8, 7), duration: 3 },
  // Phase 2: Close on the exam paper
  { pos: new THREE.Vector3(0.3, 1.8, 8.5), look: new THREE.Vector3(0, 0.78, 7.9), duration: 3 },
  // Phase 3: Locked — callouts appear
  { pos: new THREE.Vector3(0.3, 1.8, 8.5), look: new THREE.Vector3(0, 0.78, 7.9), duration: 10 },
];

function lerpVec3(a, b, t) {
  return new THREE.Vector3().lerpVectors(a, b, t);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ━━━ INIT ━━━

export function initHeroScene(containerEl) {
  container = containerEl;
  clock = new THREE.Clock();

  // Create overlay for callouts
  overlayEl = document.createElement('div');
  overlayEl.className = 'hero3d-overlay';
  container.appendChild(overlayEl);

  // Scanline effect
  const scanline = document.createElement('div');
  scanline.className = 'hero3d-scanline';
  container.appendChild(scanline);

  // Bottom fade
  const fade = document.createElement('div');
  fade.className = 'hero3d-fade';
  container.appendChild(fade);

  // Title overlay
  const titleEl = document.createElement('div');
  titleEl.className = 'hero3d-title';
  titleEl.innerHTML = `
    <h1>Master Every Question Type</h1>
    <p>The A Worthy approach to O-Level English — structured, strategic, proven.</p>
  `;
  container.appendChild(titleEl);

  // Create callout elements
  CALLOUTS.forEach(c => {
    const el = document.createElement('div');
    el.className = 'hero3d-callout';
    el.id = `callout-${c.id}`;
    Object.assign(el.style, c.position);
    el.innerHTML = `
      <div class="hero3d-callout-tag">${c.tag}</div>
      <div class="hero3d-callout-title">${c.title}</div>
      <div class="hero3d-callout-body">${c.body}</div>
    `;
    overlayEl.appendChild(el);
  });

  // ── Renderer ──
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.insertBefore(renderer.domElement, container.firstChild);

  // ── Scene ──
  scene = new THREE.Scene();
  scene.background = new THREE.Color(NEON.dark);
  scene.fog = new THREE.FogExp2(NEON.dark, 0.04);

  // ── Camera ──
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
  camera.position.copy(CAMERA_KEYFRAMES[0].pos);
  camera.lookAt(CAMERA_KEYFRAMES[0].look);

  // ── Controls (optional drag) ──
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.target.copy(CAMERA_KEYFRAMES[0].look);
  // Disable controls during auto-animation
  controls.enabled = false;

  // ── Lighting ──
  // Ambient — very dim
  const ambient = new THREE.AmbientLight(0x1a1a3e, 0.4);
  scene.add(ambient);

  // Main directional — cool blue from above
  const dirLight = new THREE.DirectionalLight(0x4466aa, 0.8);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  // Cyan point light (front)
  const cyanLight = new THREE.PointLight(NEON.cyan, 2, 20, 1.5);
  cyanLight.position.set(0, 3, 12);
  scene.add(cyanLight);

  // Pink point light (back)
  const pinkLight = new THREE.PointLight(NEON.pink, 1.5, 15, 1.5);
  pinkLight.position.set(-5, 4, -3);
  scene.add(pinkLight);

  // Purple accent from side
  const purpleLight = new THREE.PointLight(NEON.purple, 1, 12, 1.5);
  purpleLight.position.set(8, 2, 5);
  scene.add(purpleLight);

  // ── Build the scene ──
  const sceneObjects = buildScene();

  // ── Resize handler ──
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // ── Animation loop ──
  phase = 0;
  phaseTime = 0;
  let totalTime = 0;
  let calloutsShown = false;

  function animate() {
    animationId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    totalTime += delta;
    phaseTime += delta;

    // Camera animation through keyframes
    const kf = CAMERA_KEYFRAMES[phase];
    const t = Math.min(phaseTime / kf.duration, 1);
    const eased = easeInOutCubic(t);

    if (phase < CAMERA_KEYFRAMES.length - 1) {
      const next = CAMERA_KEYFRAMES[phase + 1];
      camera.position.copy(lerpVec3(kf.pos, next.pos, eased));
      const lookTarget = lerpVec3(kf.look, next.look, eased);
      camera.lookAt(lookTarget);
      controls.target.copy(lookTarget);

      if (t >= 1) {
        phase++;
        phaseTime = 0;
      }
    } else {
      // Final phase — enable orbit controls
      if (!controls.enabled) {
        controls.enabled = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
      }
      controls.update();
    }

    // Show callouts in final phase
    if (phase >= 2 && !calloutsShown) {
      calloutsShown = true;
      CALLOUTS.forEach(c => {
        setTimeout(() => {
          const el = document.getElementById(`callout-${c.id}`);
          if (el) el.classList.add('visible');
        }, c.delay * 1000);
      });
    }

    // Animate particles
    if (sceneObjects.particles) {
      const positions = sceneObjects.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(totalTime + positions[i]) * 0.001;
      }
      sceneObjects.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Animate holographic text
    if (sceneObjects.holo) {
      sceneObjects.holo.position.y = 5 + Math.sin(totalTime * 0.8) * 0.1;
      sceneObjects.holo.material.opacity = 0.25 + Math.sin(totalTime * 1.5) * 0.1;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Store resize handler for cleanup
  container._heroResizeHandler = onResize;
}

// ━━━ CLEANUP ━━━

export function destroyHeroScene() {
  if (animationId) cancelAnimationFrame(animationId);

  // Remove resize listener
  if (container?._heroResizeHandler) {
    window.removeEventListener('resize', container._heroResizeHandler);
  }

  // Dispose Three.js resources
  disposables.forEach(obj => {
    if (obj.dispose) obj.dispose();
  });
  disposables.length = 0;

  if (renderer) {
    renderer.dispose();
    renderer.domElement?.remove();
  }

  // Remove overlay elements
  if (overlayEl) overlayEl.remove();
  container?.querySelectorAll('.hero3d-scanline, .hero3d-fade, .hero3d-title, .hero3d-loading').forEach(el => el.remove());

  scene = camera = renderer = controls = null;
}
