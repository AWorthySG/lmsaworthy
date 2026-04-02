import React, { useRef, useEffect } from 'react';

export default function ConfettiCanvas({ active, duration = 2500, particleCount = 60 }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);
  const startTime = useRef(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startTime.current = Date.now();

    const colors = ["#D4A254", "#2D3A8C", "#22C55E", "#FB424E", "#7C3AED", "#0D9488", "#F59E0B", "#fff"];
    const shapes = ["rect", "circle", "star"];
    particles.current = Array.from({ length: particleCount }, () => ({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 16 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35 + Math.random() * 0.15,
      opacity: 1,
    }));

    function draw() {
      const elapsed = Date.now() - startTime.current;
      if (elapsed > duration) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fadeStart = duration * 0.7;
      particles.current.forEach(p => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.opacity = elapsed > fadeStart ? Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart)) : 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        if (p.shape === "rect") { ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); }
        else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        else { // star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) { const a = (i * 72 - 90) * Math.PI / 180; ctx.lineTo(Math.cos(a) * p.size / 2, Math.sin(a) * p.size / 2); const b = ((i * 72 + 36) - 90) * Math.PI / 180; ctx.lineTo(Math.cos(b) * p.size / 4, Math.sin(b) * p.size / 4); }
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      });
      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active, duration, particleCount]);

  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 10001, pointerEvents: "none" }} />;
}
