import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import mammoth from 'mammoth';
import { T } from '../theme/theme.js';
import { Broadcast, Pencil, Cursor, HighlighterCircle, Eraser, Circle, Square, Minus, ArrowUUpLeft, ArrowUUpRight, PaintBucket, Upload, DownloadSimple, Trash, X, Plus, VideoOn, VideoCameraSlash, Microphone, MicrophoneSlash, Screencast, Phone, PhoneDisconnect, Users, Monitor } from '../icons/icons.jsx';
import { Card, Btn, Input, PageHeader, Badge } from '../components/ui';
import { StudentAvatar } from '../components/gamification';
import { firebaseDb, ref, push, onChildAdded, set, onValue } from '../config/firebase.js';
import useWindowWidth from '../hooks/useWindowWidth.js';

function Whiteboard({ sessionId, studentNames }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null); // for remote cursors
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#1B1B1B");
  const [size, setSize] = useState(4);
  const [fill, setFill] = useState(false);
  const drawing = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const channelRef = useRef(null);
  const remoteCursors = useRef({});
  const [, forceUpdate] = useState(0);

  // Draw cream moleskin paper background with dot grid
  function drawMoleskinBg(ctx, w, h) {
    // Warm cream base
    ctx.fillStyle = "#FDF8F0";
    ctx.fillRect(0, 0, w, h);
    // Dot grid
    const spacing = 24;
    const dotR = 0.8;
    ctx.fillStyle = "#D4C9B8";
    for (let x = spacing; x < w; x += spacing) {
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Unique client ID to ignore own Firebase echoes
  const clientId = useRef(Math.random().toString(36).slice(2, 10));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawMoleskinBg(ctx, canvas.width, canvas.height);
    undoStack.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];

    // ── Firebase Realtime sync — replaces BroadcastChannel ──
    // Strokes are written to /sessions/{sessionId}/strokes
    // All connected clients receive them via onChildAdded
    const strokesRef = ref(firebaseDb, `sessions/${sessionId}/strokes`);
    const cursorsRef = ref(firebaseDb, `sessions/${sessionId}/cursors`);

    // Also keep BroadcastChannel as local fallback (for same-device tabs)
    let ch;
    try { ch = new BroadcastChannel(`wb-${sessionId}`); } catch(e) { ch = null; }
    channelRef.current = {
      postMessage: (data) => {
        // Send to Firebase (cross-device)
        if (data.type === "stroke" || data.type === "clear") {
          push(strokesRef, { ...data, _from: clientId.current, _t: Date.now() });
        }
        if (data.type === "cursor") {
          set(ref(firebaseDb, `sessions/${sessionId}/cursors/${clientId.current}`), { ...data, _t: Date.now() });
        }
        // Also send to local BroadcastChannel (same-device tabs)
        if (ch) try { ch.postMessage(data); } catch(e) {}
      }
    };

    // Listen for remote strokes from Firebase
    const unsubStrokes = onChildAdded(strokesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || data._from === clientId.current) return; // ignore own strokes
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      if (data.type === "stroke") applyRemoteStroke(ctx, data);
      if (data.type === "clear") {
        drawMoleskinBg(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    });

    // Listen for remote cursors from Firebase
    const unsubCursors = onValue(cursorsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      Object.entries(data).forEach(([cid, cur]) => {
        if (cid === clientId.current) return;
        if (cur.name) remoteCursors.current[cur.name] = { x: cur.x, y: cur.y, color: cur.color };
      });
      forceUpdate(n => n + 1);
    });

    // Also listen on local BroadcastChannel
    if (ch) {
      ch.onmessage = ({ data }) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        if (data.type === "stroke") applyRemoteStroke(ctx, data);
        if (data.type === "clear") drawMoleskinBg(ctx, canvasRef.current.width, canvasRef.current.height);
        if (data.type === "cursor") {
          remoteCursors.current[data.name] = { x: data.x, y: data.y, color: data.color };
          forceUpdate(n => n + 1);
        }
      };
    }

    const ro = new ResizeObserver(() => {
      const img = new Image();
      img.src = canvas.toDataURL();
      img.onload = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawMoleskinBg(ctx, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    });
    ro.observe(canvas);

    return () => {
      unsubStrokes();
      unsubCursors();
      if (ch) ch.close();
      ro.disconnect();
    };
  }, [sessionId]);

  function applyRemoteStroke(ctx, d) {
    ctx.save();
    ctx.strokeStyle = d.color; ctx.fillStyle = d.color;
    ctx.lineWidth = d.size; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.globalCompositeOperation = d.tool === "eraser" ? "destination-out" : "source-over";
    // Firebase converts arrays to objects — convert back if needed
    const pts = d.pts ? (Array.isArray(d.pts) ? d.pts : Object.values(d.pts)) : [];
    if (d.tool === "pen" || d.tool === "highlighter") {
      if (pts.length === 0) { ctx.restore(); return; }
      if (d.tool === "highlighter") { ctx.globalAlpha = 0.35; ctx.lineWidth = d.size * 3; }
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (d.tool === "eraser") {
      if (pts.length === 0) { ctx.restore(); return; }
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (d.tool === "line") {
      ctx.beginPath(); ctx.moveTo(d.x1, d.y1); ctx.lineTo(d.x2, d.y2); ctx.stroke();
    } else if (d.tool === "rect") {
      if (d.fill) ctx.fillRect(d.x1, d.y1, d.x2 - d.x1, d.y2 - d.y1);
      else ctx.strokeRect(d.x1, d.y1, d.x2 - d.x1, d.y2 - d.y1);
    } else if (d.tool === "circle") {
      const rx = Math.abs(d.x2 - d.x1) / 2, ry = Math.abs(d.y2 - d.y1) / 2;
      ctx.beginPath(); ctx.ellipse(d.x1 + (d.x2 - d.x1) / 2, d.y1 + (d.y2 - d.y1) / 2, rx, ry, 0, 0, 2 * Math.PI);
      if (d.fill) ctx.fill(); else ctx.stroke();
    }
    ctx.restore();
  }

  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // ━━━ STYLUS RESPONSIVENESS — pressure curve, tilt, smoothing ━━━
  // Pressure curve: makes light touches lighter and firm presses firmer (non-linear)
  function getPressure(e) {
    if (e.pointerType !== "pen" || e.pressure <= 0) return 0.5;
    // Apply a curve: p^0.7 gives better dynamic range — light strokes feel thinner, heavy strokes feel thicker
    const raw = Math.max(0.01, Math.min(1, e.pressure));
    return Math.pow(raw, 0.7);
  }

  // Tilt factor: Apple Pencil Pro tilt affects stroke width (tilted = wider, like a real pen)
  function getTiltFactor(e) {
    if (e.pointerType !== "pen") return 1;
    const tiltX = e.tiltX || 0, tiltY = e.tiltY || 0;
    const tiltMag = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
    // Map 0-90 degree tilt to 0.8-1.5 width multiplier
    return 0.8 + (Math.min(tiltMag, 60) / 60) * 0.7;
  }

  // Point buffer for smoothing — stores last few points for quadratic curve interpolation
  const pointBuffer = useRef([]);
  // Full stroke buffer — collects ALL points for Firebase broadcast on pen-up
  const fullStrokeBuffer = useRef([]);

  function saveUndo() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.current.length > 40) undoStack.current.shift();
    redoStack.current = [];
  }

  // ━━━ PALM REJECTION — works across Safari, Chrome, iPad, Android tablets ━━━
  // Once a pen/stylus is detected in this session, ALL touch events on the canvas are permanently blocked.
  // This prevents palm marks, accidental scrolls, and selection gestures while using Apple Pencil or any stylus.
  const penEverDetected = useRef(false);  // permanent: once true, touch is always rejected on canvas
  const penCurrentlyDown = useRef(false); // transient: true while pen tip is touching screen
  const penLiftTimer = useRef(null);      // delay before allowing pen-up to prevent palm-after-lift

  // Detect pen at hover stage (before touch) — Safari + Chrome fire pointerover for hovering Apple Pencil
  function onPointerEnterCanvas(e) {
    if (e.pointerType === "pen") {
      penEverDetected.current = true;
      if (penLiftTimer.current) { clearTimeout(penLiftTimer.current); penLiftTimer.current = null; }
    }
  }

  function onDown(e) {
    // ALWAYS prevent default on canvas — stops browser selection, scroll, gestures in ALL browsers
    e.preventDefault();
    e.stopPropagation();

    // If a pen/stylus has EVER been used in this session, block ALL touch on the canvas
    if (e.pointerType === "touch" && penEverDetected.current) return;
    // Also block touch if pen is currently down (redundant safety)
    if (e.pointerType === "touch" && penCurrentlyDown.current) return;
    // Block touch if already drawing
    if (e.pointerType === "touch" && drawing.current) return;

    // Track pen state
    if (e.pointerType === "pen") {
      penEverDetected.current = true;
      penCurrentlyDown.current = true;
      if (penLiftTimer.current) { clearTimeout(penLiftTimer.current); penLiftTimer.current = null; }
    }

    if (tool === "pointer") return;
    canvasRef.current.setPointerCapture(e.pointerId);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    drawing.current = true;
    startPt.current = pos;
    pointBuffer.current = [pos]; // reset point buffer for smooth curves
    fullStrokeBuffer.current = [pos]; // reset full stroke buffer for Firebase
    saveUndo();
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
  }

  function onMove(e) {
    e.preventDefault();
    e.stopPropagation();
    // Block ALL touch when pen has been detected
    if (e.pointerType === "touch" && penEverDetected.current) return;
    if (e.pointerType === "touch" && (penCurrentlyDown.current || drawing.current)) return;
    // Track pen during hover/move
    if (e.pointerType === "pen") penEverDetected.current = true;
    const pos = getPos(e);
    // Broadcast cursor position to other tabs
    channelRef.current?.postMessage({ type: "cursor", name: "Jeremy", x: pos.x, y: pos.y, color: T.accent });
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ━━━ Use coalesced events for maximum point density (critical for stylus smoothness) ━━━
    // getCoalescedEvents() returns ALL intermediate points the OS captured between animation frames
    const coalescedEvents = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    const events = coalescedEvents.length > 0 ? coalescedEvents : [e];

    // Pressure + tilt for dynamic stroke width
    const pressure = getPressure(e);
    const tilt = getTiltFactor(e);
    const dynamicSize = tool === "highlighter" ? size * 3 : size * (0.4 + pressure * 0.8) * tilt;

    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = dynamicSize;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.globalAlpha = tool === "highlighter" ? 0.35 : 1;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";

    if (tool === "pen" || tool === "highlighter" || tool === "eraser") {
      // ━━━ Quadratic curve smoothing — produces smooth strokes instead of jagged line segments ━━━
      for (const ce of events) {
        const pt = getPos(ce);
        pointBuffer.current.push(pt);
        fullStrokeBuffer.current.push(pt); // collect for Firebase
        const buf = pointBuffer.current;
        if (buf.length >= 3) {
          // Use the midpoint approach: draw quadratic curves through midpoints for silky smooth lines
          const p0 = buf[buf.length - 3];
          const p1 = buf[buf.length - 2];
          const p2 = buf[buf.length - 1];
          const mid1x = (p0.x + p1.x) / 2, mid1y = (p0.y + p1.y) / 2;
          const mid2x = (p1.x + p2.x) / 2, mid2y = (p1.y + p2.y) / 2;
          ctx.beginPath();
          ctx.moveTo(mid1x, mid1y);
          ctx.quadraticCurveTo(p1.x, p1.y, mid2x, mid2y);
          ctx.stroke();
        } else if (buf.length === 2) {
          // First segment — just a line
          ctx.beginPath();
          ctx.moveTo(buf[0].x, buf[0].y);
          ctx.lineTo(buf[1].x, buf[1].y);
          ctx.stroke();
        }
      }
      // Keep only last 3 points in buffer to avoid memory growth
      if (pointBuffer.current.length > 4) pointBuffer.current = pointBuffer.current.slice(-3);
    } else {
      // For shapes: restore snapshot and redraw shape preview
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color; ctx.fillStyle = color;
      ctx.lineWidth = size; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "source-over";
      const { x: x1, y: y1 } = startPt.current;
      if (tool === "line") {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(pos.x, pos.y); ctx.stroke();
      } else if (tool === "rect") {
        if (fill) ctx.fillRect(x1, y1, pos.x - x1, pos.y - y1);
        else ctx.strokeRect(x1, y1, pos.x - x1, pos.y - y1);
      } else if (tool === "circle") {
        const rx = Math.abs(pos.x - x1) / 2, ry = Math.abs(pos.y - y1) / 2;
        ctx.beginPath(); ctx.ellipse(x1 + (pos.x - x1) / 2, y1 + (pos.y - y1) / 2, rx, ry, 0, 0, 2 * Math.PI);
        if (fill) ctx.fill(); else ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function onUp(e) {
    e.preventDefault();
    e.stopPropagation();
    // When pen lifts, keep penCurrentlyDown true for 500ms to catch palm-after-lift
    // penEverDetected stays true permanently — touch is always blocked once a pen is seen
    if (e.pointerType === "pen") {
      if (penLiftTimer.current) clearTimeout(penLiftTimer.current);
      penLiftTimer.current = setTimeout(() => { penCurrentlyDown.current = false; }, 500);
    }
    if (!drawing.current) return;
    drawing.current = false;
    const pos = getPos(e);
    const { x: x1, y: y1 } = startPt.current;
    const msg = { type: "stroke", tool, color, size, fill };
    if (tool === "line" || tool === "rect" || tool === "circle") {
      Object.assign(msg, { x1, y1, x2: pos.x, y2: pos.y });
    } else {
      // For freehand tools (pen, highlighter, eraser), send all collected points
      msg.pts = fullStrokeBuffer.current.slice();
    }
    channelRef.current?.postMessage(msg);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }

  function undo() {
    if (undoStack.current.length < 2) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    redoStack.current.push(undoStack.current.pop());
    ctx.putImageData(undoStack.current[undoStack.current.length - 1], 0, 0);
  }

  function redo() {
    if (!redoStack.current.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = redoStack.current.pop();
    undoStack.current.push(state);
    ctx.putImageData(state, 0, 0);
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    saveUndo();
    drawMoleskinBg(ctx, canvas.width, canvas.height);
    channelRef.current?.postMessage({ type: "clear" });
  }

  function exportPNG() {
    const a = document.createElement("a");
    a.download = `whiteboard-${Date.now()}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  }

  const fileInputRef = useRef(null);

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Ensure canvas has dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = canvas.offsetWidth || 800;
      canvas.height = canvas.offsetHeight || 600;
    }
    const cw = canvas.width, ch = canvas.height;

    // Helper: draw rounded rect (Safari-safe — no ctx.roundRect)
    function roundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    if (file.type.startsWith("image/") || /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          saveUndo();
          const maxW = cw * 0.85, maxH = ch * 0.85;
          let w = img.width, h = img.height;
          if (w > maxW) { h *= maxW / w; w = maxW; }
          if (h > maxH) { w *= maxH / h; h = maxH; }
          const x = (cw - w) / 2, y = (ch - h) / 2;
          // White background with shadow
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.12)";
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 6;
          ctx.fillStyle = "#fff";
          ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
          ctx.restore();
          // Draw the image
          ctx.drawImage(img, x, y, w, h);
          // Thin border
          ctx.strokeStyle = "rgba(0,0,0,0.08)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);
        };
        img.onerror = () => {
          // Fallback if image fails to decode
          saveUndo();
          ctx.fillStyle = T.text;
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Could not load: " + file.name, cw / 2, ch / 2);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      // Render actual PDF page onto whiteboard canvas using PDF.js
      // Strategy: render to a TEMPORARY off-screen canvas, then drawImage onto the whiteboard
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfData = new Uint8Array(reader.result);
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);

          // Calculate scale to fit the whiteboard
          const vp = page.getViewport({ scale: 1 });
          const targetW = cw * 0.9, targetH = ch * 0.9;
          const scale = Math.min(targetW / vp.width, targetH / vp.height);
          const scaledVp = page.getViewport({ scale });

          // Create a temporary canvas for PDF.js to render into
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = Math.floor(scaledVp.width);
          tmpCanvas.height = Math.floor(scaledVp.height);
          const tmpCtx = tmpCanvas.getContext("2d");
          tmpCtx.fillStyle = "#FFFFFF";
          tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

          // Render PDF page into the temp canvas
          await page.render({ canvasContext: tmpCtx, viewport: scaledVp }).promise;

          // Now draw the rendered PDF onto the whiteboard canvas
          saveUndo();
          const ox = Math.floor((cw - tmpCanvas.width) / 2);
          const oy = Math.floor((ch - tmpCanvas.height) / 2);

          // White background with shadow
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.12)";
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 5;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(ox - 5, oy - 5, tmpCanvas.width + 10, tmpCanvas.height + 10);
          ctx.restore();

          // Draw the actual PDF content
          ctx.drawImage(tmpCanvas, ox, oy);

          // Thin border
          ctx.strokeStyle = "rgba(0,0,0,0.06)";
          ctx.lineWidth = 1;
          ctx.strokeRect(ox, oy, tmpCanvas.width, tmpCanvas.height);

          // Clean up
          pdf.destroy();
        } catch (err) {
          console.error("PDF render failed:", err);
          // Fallback — show filename
          saveUndo();
          ctx.fillStyle = T.text;
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("PDF: " + file.name, cw / 2, ch / 2 - 10);
          ctx.fillStyle = T.textTer;
          ctx.font = "12px sans-serif";
          ctx.fillText("Could not render — try a different PDF", cw / 2, ch / 2 + 12);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (/\.(docx|doc)$/i.test(file.name) || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // Render DOCX using mammoth.js → HTML → hidden div → html2canvas-style capture
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const html = result.value;
          // Create a hidden container, render the HTML, then capture it to the canvas
          const container = document.createElement("div");
          container.style.cssText = `position:fixed;left:-9999px;top:0;width:${cw - 60}px;padding:30px;background:#fff;font-family:Inter,sans-serif;font-size:13px;line-height:1.7;color:#1A1D2B;`;
          // Style the HTML content
          container.innerHTML = `<style>
            h1{font-size:20px;font-weight:700;margin:0 0 10px;color:#0F172A;font-family:Poppins,sans-serif}
            h2{font-size:17px;font-weight:700;margin:16px 0 8px;color:#1E2A4A;font-family:Poppins,sans-serif}
            h3{font-size:14px;font-weight:700;margin:12px 0 6px;color:#2D3A8C}
            p{margin:0 0 8px}
            ul,ol{margin:0 0 8px;padding-left:20px}
            li{margin:0 0 4px}
            table{border-collapse:collapse;width:100%;margin:8px 0}
            td,th{border:1px solid #E8E6E1;padding:6px 8px;font-size:12px}
            th{background:#F3F2EF;font-weight:600}
            strong{font-weight:700}
            em{font-style:italic}
          </style>${html}`;
          document.body.appendChild(container);

          // Wait for rendering, then capture using a foreign object SVG approach
          await new Promise(r => setTimeout(r, 100));
          const containerH = container.scrollHeight;
          const containerW = container.scrollWidth;

          // Create SVG with foreignObject containing the HTML
          const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${containerW}" height="${containerH}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif;font-size:13px;line-height:1.7;color:#1A1D2B;padding:30px;background:#fff">
                ${html.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
              </div>
            </foreignObject>
          </svg>`;

          // SVG foreignObject approach has CORS issues — use simpler line-by-line text rendering instead
          document.body.removeChild(container);

          saveUndo();
          // White page background
          const pad = 30;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.1)";
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(pad - 4, pad - 4, cw - (pad - 4) * 2, ch - (pad - 4) * 2);
          ctx.restore();
          ctx.strokeStyle = "#E8E6E1";
          ctx.lineWidth = 1;
          ctx.strokeRect(pad, pad, cw - pad * 2, ch - pad * 2);

          // Parse the HTML and render text line by line on canvas
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          const textContent = tempDiv.innerText || tempDiv.textContent || "";
          const lines = textContent.split("\n").filter(l => l.trim());

          let y = pad + 20;
          const maxY = ch - pad - 10;
          const lineH = 18;
          const x = pad + 16;
          const maxWidth = cw - pad * 2 - 32;

          // Title — first line bold and larger
          if (lines.length > 0) {
            ctx.fillStyle = "#0F172A";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            const title = lines[0].substring(0, 80);
            ctx.fillText(title, x, y);
            y += 26;
          }

          // Body text
          ctx.font = "13px sans-serif";
          ctx.fillStyle = "#1A1D2B";
          for (let i = 1; i < lines.length && y < maxY; i++) {
            const line = lines[i].trim();
            if (!line) { y += 8; continue; }
            // Check if it looks like a heading (short, all caps, or starts with a number)
            const isHeading = line.length < 60 && (line === line.toUpperCase() || /^\d+[\.\)]/.test(line) || /^[A-Z][A-Z\s]+$/.test(line));
            if (isHeading) {
              ctx.font = "bold 14px sans-serif";
              ctx.fillStyle = "#1E2A4A";
              y += 6;
            } else {
              ctx.font = "13px sans-serif";
              ctx.fillStyle = "#1A1D2B";
            }
            // Word-wrap long lines
            const words = line.split(" ");
            let currentLine = "";
            for (const word of words) {
              const testLine = currentLine ? currentLine + " " + word : word;
              if (ctx.measureText(testLine).width > maxWidth && currentLine) {
                ctx.fillText(currentLine, x, y);
                y += lineH;
                currentLine = word;
                if (y >= maxY) break;
              } else {
                currentLine = testLine;
              }
            }
            if (y < maxY && currentLine) {
              ctx.fillText(currentLine, x, y);
              y += lineH;
            }
          }
          // "More content below" indicator if truncated
          if (y >= maxY && lines.length > 10) {
            ctx.fillStyle = T.textTer;
            ctx.font = "italic 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`— Page 1 of document · ${lines.length} lines total · Annotate above —`, cw / 2, ch - pad + 10);
          }
        } catch (err) {
          saveUndo();
          ctx.fillStyle = T.text;
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("DOCX: " + file.name, cw / 2, ch / 2 - 10);
          ctx.fillStyle = T.textTer;
          ctx.font = "12px sans-serif";
          ctx.fillText("Could not render — annotate over this area", cw / 2, ch / 2 + 12);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Other files — show filename
      saveUndo();
      ctx.fillStyle = T.text;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("📄 " + file.name, cw / 2, ch / 2);
    }
    e.target.value = "";
  }

  const tools = [
    { id: "pointer", icon: Cursor, label: "Pointer" },
    { id: "pen", icon: Pencil, label: "Pen" },
    { id: "highlighter", icon: HighlighterCircle, label: "Highlighter" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: "#FDF8F0", overflow: "hidden" }}>
      {/* Toolbar — responsive: wraps on mobile, compact on tablet */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px", background: "#fff", borderBottom: `1px solid ${T.border}`, flexShrink: 0, flexWrap: "wrap", minHeight: 44 }}>
        {/* Upload — standalone prominent button */}
        <button onClick={() => fileInputRef.current?.click()} title="Upload image or PDF"
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: T.r1, background: T.gradPrimary, border: "none", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 11, flexShrink: 0, boxShadow: "0 2px 8px rgba(239,131,84,0.3)" }}>
          <Upload size={15} weight="bold" /> Upload
        </button>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,.pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.webp" onChange={handleFileUpload} style={{ display: "none" }} />

        <div style={{ width: 1, height: 24, background: T.border, flexShrink: 0 }} />

        {/* Drawing tools — touch-friendly 40px targets on mobile */}
        <div style={{ display: "flex", gap: 2, background: T.bgMuted, padding: 2, borderRadius: T.r1 }}>
          {tools.map(t => (
            <button key={t.id} title={t.label} onClick={() => setTool(t.id)}
              style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: T.r1, background: tool === t.id ? T.navy : "transparent", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
              <t.icon size={18} weight={tool === t.id ? "fill" : "regular"} color={tool === t.id ? "#fff" : T.textSec} />
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: T.border, flexShrink: 0 }} />

        {/* Colors — scrollable on small screens */}
        <div style={{ display: "flex", gap: 3, alignItems: "center", overflowX: "auto", flexShrink: 1, minWidth: 0, WebkitOverflowScrolling: "touch" }}>
          {DRAW_COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} title={c}
              style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: color === c ? `3px solid ${T.accent}` : `2px solid ${c === "#FFFFFF" ? T.border : "transparent"}`, cursor: "pointer", flexShrink: 0, transition: "transform 0.1s", transform: color === c ? "scale(1.2)" : "scale(1)" }} />
          ))}
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            style={{ width: 24, height: 24, padding: 0, border: "none", borderRadius: "50%", cursor: "pointer", background: "none", flexShrink: 0 }} title="Custom color" />
        </div>

        <div style={{ width: 1, height: 24, background: T.border, flexShrink: 0 }} />

        {/* Size slider */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <Dot size={8} color={T.textTer} />
          <input type="range" min={1} max={20} value={size} onChange={e => setSize(+e.target.value)}
            style={{ width: 60, accentColor: T.accent }} />
          <Dot size={16} color={T.textTer} />
        </div>

        {/* Fill toggle */}
        {(tool === "rect" || tool === "circle") && (
          <button onClick={() => setFill(f => !f)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: T.r1, background: fill ? T.accentLight : T.bgMuted, border: `1px solid ${fill ? T.accentMid : T.border}`, cursor: "pointer", fontSize: 11, fontWeight: 600, color: fill ? T.accentText : T.textSec, flexShrink: 0 }}>
            <PaintBucket size={13} weight={fill ? "fill" : "regular"} /> Fill
          </button>
        )}

        {/* Right actions — undo/redo/clear/export */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 3, flexShrink: 0 }}>
          <button onClick={undo} title="Undo" style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: T.bgMuted, border: "none", borderRadius: T.r1, cursor: "pointer" }}>
            <ArrowUUpLeft size={16} color={T.textSec} />
          </button>
          <button onClick={redo} title="Redo" style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: T.bgMuted, border: "none", borderRadius: T.r1, cursor: "pointer" }}>
            <ArrowUUpRight size={16} color={T.textSec} />
          </button>
          <button onClick={clearBoard} title="Clear board" style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: T.bgMuted, border: "none", borderRadius: T.r1, cursor: "pointer" }}>
            <Eraser size={16} color={T.danger} />
          </button>
          <button onClick={exportPNG} title="Export as PNG" style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: T.bgMuted, border: "none", borderRadius: T.r1, cursor: "pointer" }}>
            <DownloadSimple size={16} color={T.textSec} />
          </button>
        </div>
      </div>

      {/* Canvas area — position:absolute ensures Safari fills the space correctly */}
      <div style={{ flex: "1 1 0%", position: "relative", overflow: "hidden", cursor: tool === "pointer" ? "default" : tool === "eraser" ? "cell" : "crosshair", touchAction: "none", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "block", touchAction: "none", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", msTouchAction: "none" }}
          onPointerEnter={onPointerEnterCanvas}
          onPointerOver={onPointerEnterCanvas}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          onPointerCancel={onUp} onPointerLeave={onUp}
          onTouchStart={e => { e.preventDefault(); e.stopPropagation(); }}
          onTouchMove={e => { e.preventDefault(); e.stopPropagation(); }}
          onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); }}
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
          onGotPointerCapture={e => { /* keep capture */ }}
        />
        {/* Remote cursors overlay */}
        {Object.entries(remoteCursors.current).map(([name, cur]) => (
          <div key={name} style={{ position: "absolute", left: cur.x, top: cur.y, pointerEvents: "none", transform: "translate(-2px,-2px)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: cur.color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
            <div style={{ background: cur.color, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 8, marginTop: 2, whiteSpace: "nowrap" }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoiceCallPanel({ students, onEnd }) {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch(() => {}); // permission denied — graceful fallback
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const toggleMute = () => {
    setMuted(m => {
      streamRef.current?.getAudioTracks().forEach(t => t.enabled = !(!m));
      return !m;
    });
  };

  const toggleVideo = () => {
    setVideoOn(v => {
      streamRef.current?.getVideoTracks().forEach(t => t.enabled = !(!v));
      return !v;
    });
  };

  const fmt = s => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const participantColors = [T.accent, "#6660B9", "#17a2b8", "#E07800", "#FB424E"];

  return (
    <div style={{ background: "#0F1B3D", borderRadius: T.r3, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", boxShadow: T.shadow3 }}>
      {/* Live indicator + timer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.3)", animation: "pulse 1.5s infinite" }} />
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Live</span>
        <span style={{ color: "#8899BB", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600 }}>{fmt(elapsed)}</span>
      </div>

      {/* Local video thumbnail */}
      <div style={{ width: 72, height: 54, borderRadius: T.r1, overflow: "hidden", background: "#1A2952", flexShrink: 0, position: "relative", border: "2px solid #2A3F6B" }}>
        {videoOn
          ? <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <VideoCameraSlash size={20} color="#4A6088" />
            </div>}
        <div style={{ position: "absolute", bottom: 3, left: 4, fontSize: 9, color: "#fff", fontWeight: 700, background: "rgba(0,0,0,0.5)", padding: "1px 5px", borderRadius: 4 }}>You</div>
      </div>

      {/* Student participants */}
      <div style={{ display: "flex", gap: 8, flex: 1, overflowX: "auto" }}>
        {students.map((st, i) => (
          <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1A2952", borderRadius: T.r1, padding: "6px 10px", flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${participantColors[i % 5]}, ${participantColors[(i + 1) % 5]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {st.name.charAt(0)}
            </div>
            <div>
              <div style={{ color: "#E8EFFE", fontSize: 11, fontWeight: 600 }}>{st.name.split(" ")[0]}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 1 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ color: "#5F7AA8", fontSize: 10 }}>connected</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
        <button onClick={toggleMute} title={muted ? "Unmute" : "Mute"}
          style={{ width: 40, height: 40, borderRadius: "50%", background: muted ? "#FB424E22" : "#1A2952", border: `1px solid ${muted ? "#FB424E55" : "#2A3F6B"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          {muted ? <MicrophoneSlash size={18} color="#FB424E" weight="fill" /> : <Microphone size={18} color="#8899BB" weight="fill" />}
        </button>
        <button onClick={toggleVideo} title={videoOn ? "Stop video" : "Start video"}
          style={{ width: 40, height: 40, borderRadius: "50%", background: videoOn ? "#1A2952" : "#E0780022", border: `1px solid ${videoOn ? "#2A3F6B" : "#E0780055"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          {videoOn ? <VideoOn size={18} color="#8899BB" weight="fill" /> : <VideoCameraSlash size={18} color="#E07800" weight="fill" />}
        </button>
        <button title="Share screen"
          style={{ width: 40, height: 40, borderRadius: "50%", background: "#1A2952", border: "1px solid #2A3F6B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Screencast size={18} color="#8899BB" />
        </button>
        <button onClick={onEnd} title="End call"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "#FB424E", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(251,66,78,0.45)", transition: "all 0.15s" }}>
          <PhoneDisconnect size={20} color="#fff" weight="fill" />
        </button>
      </div>
    </div>
  );
}


function Classroom({ state, dispatch, userProfile }) {
  const [callActive, setCallActive] = useState(false);
  const [sessionCode, setSessionCode] = useState(() => {
    // Check URL for a session code (e.g. ?session=ABC123)
    const params = new URLSearchParams(window.location.search);
    return params.get("session") || "";
  });
  const [sessionId, setSessionId] = useState("");
  const [joinMode, setJoinMode] = useState(false); // true = student joining, false = tutor creating
  const [videoSidebar, setVideoSidebar] = useState(true);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false); // Host camera OFF by default

  function createSession() {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const roomId = `room-${code}`;
    setSessionCode(code);
    setSessionId(roomId);
    setCallActive(true);
    setTimeout(() => {
      try {
        set(ref(firebaseDb, `sessions/${roomId}/meta`), {
          host: userProfile?.name || "Tutor",
          created: Date.now(),
          active: true,
        }).catch(() => {});
      } catch (e) {}
    }, 100);
  }

  function joinSession() {
    if (!sessionCode.trim() || sessionCode.trim().length < 4) return;
    const code = sessionCode.trim().toUpperCase();
    const roomId = `room-${code}`;
    setSessionCode(code);
    setSessionId(roomId);
    setCallActive(true);
  }
  const [elapsed, setElapsed] = useState(0);
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const students = state.students;
  const winW = useWindowWidth();
  const isMobile = winW < 640;
  const isTablet = winW >= 640 && winW < 1024;

  // Start/stop media and timer when call becomes active/inactive
  useEffect(() => {
    if (!callActive) {
      // Stop everything when call ends
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      return;
    }
    // Call just started
    setElapsed(0);
    setMuted(false);
    setVideoOn(false); // Host camera off by default — students' cameras are on
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    // Request media after a short delay so the UI renders first
    const mediaTimer = setTimeout(() => {
      try {
        navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
          .then(stream => {
            streamRef.current = stream;
            stream.getVideoTracks().forEach(t => t.enabled = false);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          })
          .catch(() => {});
      } catch (e) {
        // getUserMedia not available
      }
    }, 500);
    return () => { clearInterval(timerRef.current); clearTimeout(mediaTimer); streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [callActive]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const participantColors = ["#EF8354", "#6AABBB", "#6660B9", "#2BAA6E", "#E94B5A"];

  function endCall() {
    setCallActive(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  if (!callActive || !sessionId) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20, alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ background: T.bgCard, borderRadius: T.r3, padding: "36px 32px", textAlign: "center", border: `1px solid ${T.border}` }}>
            <Broadcast size={28} />
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", marginTop: 12, marginBottom: 6, color: T.text }}>Live Classroom</div>
            <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, marginBottom: 20 }}>
              Real-time whiteboard collaboration. Create a session or join an existing one with a code.
            </div>

            {/* Create session — primary action */}
            <button onClick={createSession}
              style={{ width: "100%", padding: "14px 28px", borderRadius: T.r2, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              <Broadcast size={18} /> Create Session
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 11, color: T.textTer, fontWeight: 600 }}>OR JOIN EXISTING</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            {/* Join session */}
            <div>
              <div style={{ fontSize: 12, color: T.textTer, marginBottom: 8 }}>
                Enter the 6-character code your tutor shared with you.
              </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={sessionCode} onChange={e => setSessionCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC123" maxLength={6}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", letterSpacing: 3, textTransform: "uppercase", boxSizing: "border-box" }}
                    onKeyDown={e => { if (e.key === "Enter") joinSession(); }} />
                  <button onClick={joinSession} disabled={sessionCode.trim().length < 4}
                    style={{ padding: "10px 20px", borderRadius: T.r1, background: sessionCode.trim().length >= 4 ? T.accent : T.bgMuted, color: sessionCode.trim().length >= 4 ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: sessionCode.trim().length >= 4 ? "pointer" : "not-allowed" }}>
                    Join
                  </button>
                </div>
              </div>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: "flex", gap: 10, maxWidth: 480, width: "100%" }}>
          {[
            { icon: "✏️", label: "Whiteboard", desc: "Draw, annotate, upload" },
            { icon: "🎥", label: "Video & Audio", desc: "Live voice and camera" },
            { icon: "🌐", label: "Cross-Device", desc: "Sync across all devices" },
          ].map((f, i) => (
            <div key={i} className="card-enter" style={{ "--i": i, flex: 1, background: T.bgCard, borderRadius: T.r2, padding: "12px 10px", border: `1px solid ${T.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.text, marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: T.textTer }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "calc(100dvh - 20px)" : "calc(100dvh - 40px)", minHeight: 0, margin: isMobile ? "-6px -8px" : "-12px -16px", background: "#F2F3F8", position: "relative", overflow: "hidden" }}>
      {/* ═══ TOP BAR — compact on mobile ═══ */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#fff", borderBottom: `1px solid ${T.border}`, height: isMobile ? 40 : 48, flexShrink: 0, padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 8px", borderRight: `1px solid ${T.border}`, height: "100%", flexShrink: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 2px rgba(34,197,94,0.2)", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: T.navy, textTransform: "uppercase", letterSpacing: 0.5 }}>Live</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.textTer, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(elapsed)}</span>
        </div>
        {!isMobile && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textSec }}>
              <Chalkboard size={15} color={T.navy} />
              <span style={{ fontWeight: 700, color: T.navy }}>Whiteboard</span>
              <span style={{ color: T.textTer }}>·</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, background: T.accentLight, padding: "2px 8px", borderRadius: T.r1 }}>{sessionCode}</span>
              <button onClick={() => { navigator.clipboard?.writeText(sessionCode); }} title="Copy session code" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, fontSize: 12 }}>📋</button>
            </div>
          </div>
        )}
        {isMobile && <div style={{ flex: 1 }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 4px" }}>
          {!isMobile && (
            <button onClick={() => setVideoSidebar(v => !v)} title={videoSidebar ? "Hide participants" : "Show participants"}
              style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: T.r1, background: videoSidebar ? T.accentLight : T.bgMuted, border: "none", cursor: "pointer" }}>
              <Users size={16} color={videoSidebar ? T.accent : T.textTer} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ MIDDLE: Canvas + Video Sidebar — responsive, Safari-safe ═══ */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: 0, overflow: "hidden" }}>
        {/* Main whiteboard canvas — flex-basis:0 forces Safari to shrink properly */}
        <div style={{ flex: "1 1 0%", minWidth: 0, minHeight: 0, position: "relative", overflow: "hidden" }}>
          <WhiteboardErrorBoundary><Whiteboard sessionId={sessionId} studentNames={students.map(s => s.name)} /></WhiteboardErrorBoundary>
        </div>

        {/* Video Sidebar — right on desktop/tablet, bottom strip on mobile */}
        {videoSidebar && !isMobile && (
          <div style={{ width: isTablet ? 160 : 200, background: "#1A1F36", borderLeft: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
            <div style={{ padding: 6 }}>
              <div style={{ borderRadius: T.r2, overflow: "hidden", background: "#0D1226", aspectRatio: "4/3", position: "relative" }}>
                {videoOn
                  ? <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: "block" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <VideoCameraSlash size={24} color="#3A4568" />
                    </div>}
                <div style={{ position: "absolute", bottom: 4, left: 4, fontSize: 9, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "1px 6px", borderRadius: 5, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>You (Host)</div>
                {muted && <div style={{ position: "absolute", top: 4, right: 4 }}><MicrophoneSlash size={12} color="#E94B5A" weight="fill" /></div>}
                {!videoOn && <div style={{ position: "absolute", top: 4, left: 4, fontSize: 7, fontWeight: 700, color: "#D4A254", background: "rgba(0,0,0,0.5)", padding: "1px 4px", borderRadius: 3 }}>CAM OFF</div>}
              </div>
            </div>
            {students.map((st, i) => (
              <div key={st.id} style={{ padding: "0 6px 6px" }}>
                <div style={{ borderRadius: T.r2, overflow: "hidden", background: "#0D1226", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: isTablet ? 36 : 44, height: isTablet ? 36 : 44, borderRadius: "50%", background: `linear-gradient(135deg, ${participantColors[i % 5]}, ${participantColors[(i + 1) % 5]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isTablet ? 15 : 18, fontWeight: 700, color: "#fff" }}>
                    {st.name.charAt(0)}
                  </div>
                  <div style={{ position: "absolute", bottom: 4, left: 4, fontSize: 9, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "1px 6px", borderRadius: 5, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>{st.name.split(" ")[0]}</div>
                  <div style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile: horizontal participant strip at bottom of canvas */}
        {isMobile && (
          <div style={{ height: 56, background: "#1A1F36", display: "flex", gap: 6, padding: "6px 8px", overflowX: "auto", flexShrink: 0, WebkitOverflowScrolling: "touch" }}>
            {/* Host */}
            <div style={{ width: 44, height: 44, borderRadius: T.r1, overflow: "hidden", background: "#0D1226", flexShrink: 0, position: "relative" }}>
              {videoOn
                ? <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><VideoCameraSlash size={16} color="#3A4568" /></div>}
              {!videoOn && <div style={{ position: "absolute", bottom: 1, left: 1, fontSize: 6, fontWeight: 700, color: "#D4A254", background: "rgba(0,0,0,0.5)", padding: "0 3px", borderRadius: 2 }}>OFF</div>}
            </div>
            {students.map((st, i) => (
              <div key={st.id} style={{ width: 44, height: 44, borderRadius: T.r1, background: "#0D1226", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${participantColors[i % 5]}, ${participantColors[(i + 1) % 5]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{st.name.charAt(0)}</div>
                <div style={{ position: "absolute", top: 2, right: 2, width: 4, height: 4, borderRadius: "50%", background: "#22C55E" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ BOTTOM: Meeting Controls — centered on mobile, right-aligned on desktop ═══ */}
      <div style={{ position: "absolute", bottom: isMobile ? 64 : 16, right: isMobile ? "50%" : (videoSidebar && !isMobile ? (isTablet ? 176 : 216) : 16), transform: isMobile ? "translateX(50%)" : "none", display: "flex", gap: isMobile ? 8 : 6, background: "#1A1F36", borderRadius: T.r4, padding: isMobile ? "8px 14px" : "6px 10px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", zIndex: 10, alignItems: "center" }}>
        <button onClick={() => setMuted(m => { streamRef.current?.getAudioTracks().forEach(t => t.enabled = m); return !m; })} title={muted ? "Unmute" : "Mute"}
          style={{ width: isMobile ? 44 : 38, height: isMobile ? 44 : 38, borderRadius: "50%", background: muted ? "rgba(233,75,90,0.15)" : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {muted ? <MicrophoneSlash size={isMobile ? 20 : 18} color="#E94B5A" weight="fill" /> : <Microphone size={isMobile ? 20 : 18} color="#fff" weight="fill" />}
        </button>
        <button onClick={() => setVideoOn(v => { streamRef.current?.getVideoTracks().forEach(t => t.enabled = !v); return !v; })} title={videoOn ? "Stop video" : "Start video"}
          style={{ width: isMobile ? 44 : 38, height: isMobile ? 44 : 38, borderRadius: "50%", background: !videoOn ? "rgba(239,131,84,0.15)" : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {videoOn ? <VideoOn size={isMobile ? 20 : 18} color="#fff" weight="fill" /> : <VideoCameraSlash size={isMobile ? 20 : 18} color="#EF8354" weight="fill" />}
        </button>
        {!isMobile && (
          <button title="Share screen"
            style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Screencast size={18} color="#fff" />
          </button>
        )}
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />
        <button onClick={endCall} title="End call"
          style={{ width: isMobile ? 44 : 38, height: isMobile ? 44 : 38, borderRadius: "50%", background: "#E94B5A", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(233,75,90,0.4)" }}>
          <PhoneDisconnect size={isMobile ? 20 : 18} color="#fff" weight="fill" />
        </button>
      </div>
    </div>
  );
}

/* ━━━ FEATURE: PRACTICE QUESTION GENERATOR ━━━ */

const PRACTICE_QUESTIONS = [
  { id: 1, q: "'Technology does more harm than good.' Do you agree?", type: "q01", structure: "REFUTATION", framework: "TAS", triggerType: "direct", difficulty: 1 },
  { id: 2, q: "How far do you agree that globalisation benefits all countries equally?", type: "q02", structure: "LIMITATION", framework: "CAF", triggerType: "extent", difficulty: 1 },
  { id: 3, q: "Is education more important than legislation in addressing environmental problems?", type: "q03", structure: "LIMITATION + COMPARATIVE", framework: "CCF", triggerType: "comparative", difficulty: 2 },
  { id: 4, q: "What are the main causes of rising inequality in modern societies?", type: "q04", structure: "THEMATIC-CATEGORICAL", framework: "FAF", triggerType: "cause", difficulty: 1 },
  { id: 5, q: "Discuss the view that freedom of speech should have no limits.", type: "q05", structure: "EITHER (depends on stand)", framework: "EEP", triggerType: "discussion", difficulty: 2 },
  { id: 6, q: "How effective have international efforts been in combating climate change?", type: "q06", structure: "LIMITATION + CRITERIA", framework: "CEV", triggerType: "evaluative", difficulty: 2 },
  { id: 7, q: "'The arts are a luxury that most countries cannot afford.' Discuss.", type: "q01", structure: "REFUTATION", framework: "TAS", triggerType: "direct", difficulty: 1 },
  { id: 8, q: "To what extent has social media changed the nature of political participation?", type: "q02", structure: "LIMITATION", framework: "CAF", triggerType: "extent", difficulty: 2 },
  { id: 9, q: "'Science offers more to society than the humanities.' Do you agree?", type: "q03", structure: "LIMITATION + COMPARATIVE", framework: "CCF", triggerType: "comparative", difficulty: 2 },
  { id: 10, q: "Why has fake news become such a serious problem, and how can it be addressed?", type: "q04", structure: "THEMATIC-CATEGORICAL", framework: "FAF", triggerType: "cause", difficulty: 2 },
  { id: 11, q: "Consider the role of government in regulating the internet. What is your view?", type: "q05", structure: "EITHER (depends on stand)", framework: "EEP", triggerType: "discussion", difficulty: 2 },
  { id: 12, q: "Assess the impact of artificial intelligence on employment.", type: "q06", structure: "LIMITATION + CRITERIA", framework: "CEV", triggerType: "evaluative", difficulty: 2 },
  { id: 13, q: "'It is never possible to achieve true equality.' Discuss.", type: "q01", structure: "REFUTATION", framework: "TAS", triggerType: "direct", difficulty: 3 },
  { id: 14, q: "How far is it true that economic growth always comes at the expense of the environment?", type: "q02", structure: "LIMITATION", framework: "CAF", triggerType: "extent", difficulty: 3 },
  { id: 15, q: "'Diplomacy is more effective than military action in resolving international conflicts.' Do you agree?", type: "q03", structure: "LIMITATION + COMPARATIVE", framework: "CCF", triggerType: "comparative", difficulty: 3 },
  { id: 16, q: "How can societies effectively address the problem of an ageing population?", type: "q04", structure: "THEMATIC-CATEGORICAL", framework: "FAF", triggerType: "cause", difficulty: 2 },
  { id: 17, q: "'In the modern world, privacy is no longer possible.' Discuss.", type: "q01", structure: "REFUTATION", framework: "TAS", triggerType: "direct", difficulty: 2 },
  { id: 18, q: "To what extent should governments be responsible for the health of their citizens?", type: "q02", structure: "LIMITATION", framework: "CAF", triggerType: "extent", difficulty: 2 },
  { id: 19, q: "How successful has your country been in managing its cultural diversity?", type: "q06", structure: "LIMITATION + CRITERIA", framework: "CEV", triggerType: "evaluative", difficulty: 2 },
  { id: 20, q: "Discuss the view that sport today is more about money than competition.", type: "q05", structure: "EITHER (depends on stand)", framework: "EEP", triggerType: "discussion", difficulty: 1 },
  { id: 21, q: "'Only science can offer us the truth.' Do you agree?", type: "q01", structure: "REFUTATION", framework: "TAS", triggerType: "direct", difficulty: 3 },
  { id: 22, q: "Is the media more of a force for good than harm in today's world?", type: "q03", structure: "LIMITATION + COMPARATIVE", framework: "CCF", triggerType: "comparative", difficulty: 2 },
  { id: 23, q: "Why do many young people today feel disengaged from politics?", type: "q04", structure: "THEMATIC-CATEGORICAL", framework: "FAF", triggerType: "cause", difficulty: 1 },
  { id: 24, q: "How far do you agree that tourism does more harm than good to local communities?", type: "q02", structure: "LIMITATION", framework: "CAF", triggerType: "extent", difficulty: 2 },
  { id: 25, q: "Evaluate the effectiveness of foreign aid in reducing global poverty.", type: "q06", structure: "LIMITATION + CRITERIA", framework: "CEV", triggerType: "evaluative", difficulty: 3 },
];

const TRIGGER_TYPE_LABELS = {
  direct: { label: "Direct Assertion", desc: "States a position, asks you to agree/disagree" },
  extent: { label: "Extent / How Far", desc: "Asks you to measure degree — qualified stand needed" },
  comparative: { label: "Comparison", desc: "Asks you to compare and evaluate which is greater" },
  cause: { label: "Cause / Solution", desc: "Asks why something occurs or how to address it" },
  discussion: { label: "Open Discussion", desc: "Presents a view and asks you to discuss" },
  evaluative: { label: "Evaluative Judgement", desc: "Asks how successful/effective something has been" },
};

/* ━━━ SUBJECT-SPECIFIC PRACTICE DRILLS ━━━ */

const ENG_DRILLS = [
  { id: 1, q: "Identify the figure of speech: 'The wind whispered through the trees.'", options: ["Metaphor", "Personification", "Simile", "Hyperbole"], correct: 1, topic: "Comprehension", explain: "Personification gives human qualities (whispering) to a non-human thing (wind)." },
  { id: 2, q: "What is the tone of: 'Despite the government's assurances, the people remained sceptical.'?", options: ["Optimistic", "Doubtful", "Angry", "Neutral"], correct: 1, topic: "Comprehension", explain: "'Sceptical' directly signals doubt despite reassurance." },
  { id: 3, q: "Choose the best summary of: 'While renewable energy offers hope, its implementation faces significant financial and logistical barriers.'", options: ["Renewable energy is hopeless.", "Renewable energy is promising but faces practical challenges.", "Financial barriers make energy transition impossible.", "Logistics are the only problem with renewables."], correct: 1, topic: "Summary Writing", explain: "Captures both the positive ('offers hope') and the qualifier ('significant barriers') without distortion." },
  { id: 4, q: "Which is the strongest opening for a narrative about loss?", options: ["I was sad when my grandmother died.", "The chair at the head of the table remained empty that Christmas.", "This story is about how I dealt with loss.", "Loss is something everyone experiences."], correct: 1, topic: "Narrative Writing", explain: "Shows (empty chair) rather than tells (I was sad), creating a vivid image that implies loss without stating it." },
  { id: 5, q: "Identify the error: 'The team have been performing good this season.'", options: ["have → has", "good → well", "Both A and B", "No error"], correct: 2, topic: "Situational Writing", explain: "'have' is acceptable for collective nouns in British English, but 'good' should be 'well' (adverb modifying 'performing')." },
  { id: 6, q: "What does 'The policy was a double-edged sword' mean?", options: ["The policy was dangerous", "The policy had both advantages and disadvantages", "The policy was sharp and effective", "The policy was medieval"], correct: 1, topic: "Comprehension", explain: "A double-edged sword is an idiom meaning something that has both positive and negative consequences." },
  { id: 7, q: "Which transition best shows contrast?", options: ["Furthermore", "Nevertheless", "Similarly", "Consequently"], correct: 1, topic: "Argumentative Writing", explain: "'Nevertheless' signals a contrast or concession — the next point opposes or qualifies the previous one." },
  { id: 8, q: "In situational writing, which format element is required for a formal letter?", options: ["Salutation and sign-off", "Bullet points", "Informal abbreviations", "First-person narrative"], correct: 0, topic: "Situational Writing", explain: "Formal letters require proper salutation (Dear Sir/Madam) and sign-off (Yours faithfully/sincerely)." },
  { id: 9, q: "'The statistics paint a bleak picture.' What technique is used?", options: ["Alliteration", "Metaphor", "Irony", "Oxymoron"], correct: 1, topic: "Comprehension", explain: "Statistics cannot literally paint — this is a metaphor comparing data presentation to visual art." },
  { id: 10, q: "What is the purpose of a topic sentence in argumentative writing?", options: ["To summarise the conclusion", "To state the paragraph's main argument", "To provide an example", "To introduce the opposing view"], correct: 1, topic: "Argumentative Writing", explain: "A topic sentence states the paragraph's central claim, giving the reader a clear preview of the argument to follow." },
];

const IPENG_DRILLS = [
  { id: 1, q: "In unseen poetry, what does 'enjambment' achieve?", options: ["Creates a pause", "Carries meaning across line breaks, building momentum", "Rhymes words together", "Shortens the poem"], correct: 1, topic: "Unseen Poetry", explain: "Enjambment runs a sentence past the line break without punctuation, creating flow and urgency." },
  { id: 2, q: "Identify the literary device: 'It was the best of times, it was the worst of times.'", options: ["Paradox", "Antithesis", "Irony", "Hyperbole"], correct: 1, topic: "Literary Analysis", explain: "Antithesis places contrasting ideas ('best' vs 'worst') in parallel structure for rhetorical effect." },
  { id: 3, q: "In a discursive essay, what distinguishes it from a persuasive essay?", options: ["It uses more examples", "It explores multiple perspectives before reaching a conclusion", "It is always longer", "It avoids personal opinion"], correct: 1, topic: "Discursive Writing", explain: "Discursive writing weighs multiple viewpoints objectively before arriving at a balanced conclusion, unlike persuasion which argues one side." },
  { id: 4, q: "What is the effect of a caesura in poetry?", options: ["It speeds up the rhythm", "It creates a deliberate pause or break within a line", "It links two stanzas", "It removes rhyme"], correct: 1, topic: "Unseen Poetry", explain: "A caesura (pause within a line, often marked by punctuation) creates emphasis, reflects hesitation, or mimics natural speech." },
  { id: 5, q: "In analysing a novel, what does 'narrative perspective' refer to?", options: ["The plot structure", "The point of view from which the story is told", "The setting", "The theme"], correct: 1, topic: "Prose & Drama", explain: "Narrative perspective (1st person, 3rd limited, omniscient) shapes how the reader receives information and feels about characters." },
  { id: 6, q: "What does 'pathetic fallacy' mean?", options: ["A logical error in reasoning", "Using weather/nature to reflect human emotions", "An appeal to pity", "A type of dramatic irony"], correct: 1, topic: "Literary Analysis", explain: "Pathetic fallacy attributes human emotions to nature — e.g., 'the angry storm' reflecting a character's turmoil." },
  { id: 7, q: "In visual text analysis, what does 'salience' refer to?", options: ["The text's font size", "The most prominent/eye-catching element in the composition", "The colour palette", "The target audience"], correct: 1, topic: "Visual Text & Multimodal Literacy", explain: "Salience is the element that first draws the viewer's attention — through size, colour, contrast, or placement." },
  { id: 8, q: "Which best describes a 'stream of consciousness' narrative?", options: ["Chronological storytelling", "Continuous flow of a character's thoughts and feelings", "Third-person omniscient narration", "Dialogue-heavy scenes"], correct: 1, topic: "Prose & Drama", explain: "Stream of consciousness mimics the natural flow of thought — fragmented, associative, and often without conventional structure." },
];

const H1ECON_DRILLS = [
  { id: 1, q: "What causes a movement along the demand curve (as opposed to a shift)?", options: ["Change in income", "Change in the price of the good itself", "Change in tastes", "Change in population"], correct: 1, topic: "Market Mechanism", explain: "Only a change in the good's own price causes movement along the curve. All other factors shift the entire curve." },
  { id: 2, q: "Which is an example of a negative externality in consumption?", options: ["Factory pollution", "Passive smoking from cigarettes", "Traffic congestion from driving", "Overfishing"], correct: 1, topic: "Market Failure", explain: "Passive smoking imposes health costs on non-smokers — a negative externality arising from the act of consumption (smoking)." },
  { id: 3, q: "If the government imposes a binding price ceiling below equilibrium, what results?", options: ["Surplus", "Shortage", "No change", "Equilibrium shifts right"], correct: 1, topic: "Market Mechanism", explain: "A price ceiling below equilibrium makes the good artificially cheap: Qd > Qs, creating a shortage." },
  { id: 4, q: "What is the primary aim of contractionary fiscal policy?", options: ["Reduce unemployment", "Reduce demand-pull inflation", "Increase economic growth", "Improve BOP"], correct: 1, topic: "Fiscal & Monetary Policy", explain: "Contractionary fiscal policy (↓G or ↑T) reduces aggregate demand, targeting demand-pull inflation." },
  { id: 5, q: "Which best describes a merit good?", options: ["A good with no externalities", "A good under-consumed because individuals underestimate its private benefits", "A free good provided by government", "A luxury good"], correct: 1, topic: "Market Failure", explain: "Merit goods (e.g., education, healthcare) are under-consumed because people undervalue their benefits due to imperfect information." },
  { id: 6, q: "What happens to the multiplier if the marginal propensity to save increases?", options: ["Multiplier increases", "Multiplier decreases", "No change", "Multiplier becomes negative"], correct: 1, topic: "Macroeconomic Aims", explain: "k = 1/(1-MPC) = 1/MPS. If MPS rises, the denominator increases and the multiplier shrinks — each round of spending leaks more into savings." },
  { id: 7, q: "Demand-pull inflation is caused by:", options: ["Rising costs of production", "Excessive growth in aggregate demand", "Supply chain disruptions", "Currency depreciation"], correct: 1, topic: "Macroeconomic Aims", explain: "Demand-pull inflation occurs when AD grows faster than AS — too much money chasing too few goods." },
  { id: 8, q: "A public good is characterised by:", options: ["Excludability and rivalry", "Non-excludability and non-rivalry", "High price and low demand", "Government ownership"], correct: 1, topic: "Market Failure", explain: "Public goods (e.g., national defence) are non-excludable (can't prevent access) and non-rivalrous (one person's use doesn't reduce another's)." },
];

const H2ECON_DRILLS = [
  { id: 1, q: "In a monopolistically competitive market, firms earn supernormal profits in the short run. What happens in the long run?", options: ["Profits increase further", "New firms enter, demand curve shifts left until normal profits", "Government intervenes", "Nothing changes"], correct: 1, topic: "Market Structures", explain: "Low barriers to entry → new firms enter → each firm's demand curve shifts left → supernormal profits eroded to normal profits." },
  { id: 2, q: "What is the condition for allocative efficiency?", options: ["MC = AC", "P = MC", "MR = MC", "AR = AC"], correct: 1, topic: "Market Structures", explain: "P = MC means the price consumers pay equals the marginal cost of production — the socially optimal output level." },
  { id: 3, q: "A depreciation of the Singapore dollar would:", options: ["Make exports cheaper and imports more expensive", "Make exports more expensive and imports cheaper", "Have no effect on trade", "Only affect the capital account"], correct: 0, topic: "International Trade", explain: "Weaker SGD → exports cost less in foreign currency (more competitive) and imports cost more in SGD." },
  { id: 4, q: "Which is NOT a source of economies of scale?", options: ["Bulk buying discounts", "Specialisation of labour", "Diminishing marginal returns", "Spreading fixed costs over more output"], correct: 2, topic: "Market Structures", explain: "Diminishing marginal returns is a short-run production concept (adding variable factors to fixed factors), not a source of EOS." },
  { id: 5, q: "The J-curve effect suggests that after a currency depreciation:", options: ["The trade balance improves immediately", "The trade balance worsens before improving", "Exports fall permanently", "Imports increase permanently"], correct: 1, topic: "Balance of Payments", explain: "Initially, contracts are fixed so import spending rises (more expensive in local currency). Over time, export volumes rise and import volumes fall → BOP improves." },
  { id: 6, q: "What distinguishes a monopoly from an oligopoly?", options: ["Number of firms", "Type of product", "Level of advertising", "Government regulation"], correct: 0, topic: "Market Structures", explain: "Monopoly = one dominant firm; oligopoly = few large firms with interdependent decision-making. The number of firms is the defining distinction." },
  { id: 7, q: "Supply-side policies aim to:", options: ["Increase AD", "Shift the AS curve rightward", "Reduce government spending", "Control money supply"], correct: 1, topic: "Economic Growth", explain: "Supply-side policies (education, infrastructure, deregulation) increase the economy's productive capacity by shifting AS right." },
  { id: 8, q: "If Singapore's current account shows a surplus, it means:", options: ["Exports of goods & services exceed imports", "More capital is flowing in than out", "Government budget is in surplus", "Inflation is low"], correct: 0, topic: "Balance of Payments", explain: "Current account surplus = export earnings > import spending (for goods, services, income, and transfers)." },
];

const ALL_SUBJECT_DRILLS = {
  gp: { questions: PRACTICE_QUESTIONS, title: "GP Question Analysis", desc: "Identify question types, structures & frameworks", mode: "gp" },
  eng: { questions: ENG_DRILLS, title: "English Language Skills", desc: "Comprehension, writing techniques & grammar", mode: "mcq" },
  h1econ: { questions: H1ECON_DRILLS, title: "H1 Economics Concepts", desc: "Market mechanism, market failure & macro policy", mode: "mcq" },
  h2econ: { questions: H2ECON_DRILLS, title: "H2 Economics Concepts", desc: "Market structures, trade, BOP & growth", mode: "mcq" },
};


export default Classroom;
