import { useEffect, useRef } from 'react';

const AnimatedGradient = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const drawGradient = () => {
      time += 0.005;

      // Create animated gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const color1 = `hsl(${210 + Math.sin(time) * 20}, 60%, ${20 + Math.sin(time) * 5}%)`;
      const color2 = `hsl(${0 + Math.cos(time * 0.7) * 15}, 70%, ${15 + Math.cos(time * 0.7) * 5}%)`;
      const color3 = `hsl(${210 + Math.sin(time * 1.3) * 25}, 50%, ${10 + Math.sin(time * 1.3) * 5}%)`;

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, color3);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(drawGradient);
    };

    drawGradient();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8 }}
    />
  );
};

export default AnimatedGradient;
