import { useEffect, useRef } from 'react';

// Chess piece Unicode symbols for floating animation
const CHESS_PIECES = ['♟', '♞', '♝', '♜', '♛', '♚', '♙', '♘', '♗', '♖', '♕', '♔'];

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating orbs
    const orbs: Array<{
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(102, 126, 234, 0.18)',
      'rgba(118, 75, 162, 0.12)',
      'rgba(0, 212, 255, 0.12)',
      'rgba(16, 185, 129, 0.10)',
      'rgba(245, 158, 11, 0.10)',
      'rgba(239, 68, 68, 0.08)',
    ];

    for (let i = 0; i < 7; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 250 + 120,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        color: colors[i % colors.length],
      });
    }

    // Floating chess pieces
    const pieces: Array<{
      x: number;
      y: number;
      symbol: string;
      size: number;
      dx: number;
      dy: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    for (let i = 0; i < 12; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        symbol: CHESS_PIECES[i % CHESS_PIECES.length],
        size: Math.random() * 24 + 14,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25 - 0.1,
        opacity: Math.random() * 0.08 + 0.03,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw orbs
      orbs.forEach((orb) => {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x + orb.radius > canvas.width || orb.x - orb.radius < 0) orb.dx = -orb.dx;
        if (orb.y + orb.radius > canvas.height || orb.y - orb.radius < 0) orb.dy = -orb.dy;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw floating chess pieces
      pieces.forEach((piece) => {
        piece.x += piece.dx;
        piece.y += piece.dy;
        piece.rotation += piece.rotationSpeed;

        // Wrap around edges
        if (piece.x > canvas.width + 30) piece.x = -30;
        if (piece.x < -30) piece.x = canvas.width + 30;
        if (piece.y > canvas.height + 30) piece.y = -30;
        if (piece.y < -30) piece.y = canvas.height + 30;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.globalAlpha = piece.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.font = `${piece.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(piece.symbol, 0, 0);
        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" style={{ filter: 'blur(40px)' }} />
  );
};
