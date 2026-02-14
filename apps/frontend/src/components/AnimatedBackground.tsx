import { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
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
      'rgba(102, 126, 234, 0.15)', // Primary purple
      'rgba(0, 212, 255, 0.15)', // Accent cyan
      'rgba(16, 185, 129, 0.15)', // Success green
      'rgba(245, 158, 11, 0.15)', // Gold
    ];

    // Create orbs
    for (let i = 0; i < 5; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: colors[i % colors.length],
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        // Update position
        orb.x += orb.dx;
        orb.y += orb.dy;

        // Bounce off edges
        if (orb.x + orb.radius > canvas.width || orb.x - orb.radius < 0) {
          orb.dx = -orb.dx;
        }
        if (orb.y + orb.radius > canvas.height || orb.y - orb.radius < 0) {
          orb.dy = -orb.dy;
        }

        // Draw orb with blur
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" style={{ filter: 'blur(60px)' }} />
  );
};
