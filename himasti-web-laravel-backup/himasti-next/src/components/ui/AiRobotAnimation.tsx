"use client";

import React, { useEffect, useRef } from 'react';

export default function AiRobotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 250;

    let time = 0;
    let animationFrameId: number;
    
    // Mouse Interaction State
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let isClicked = false;
    let clickTimer = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleClick = () => {
      isClicked = true;
      clickTimer = 15;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const drawGrid = () => {
      ctx.strokeStyle = '#f1f5f9'; // Very faint grid
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 25) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    };

    const drawHumanoid = (t: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 10;
      
      // Bobbing effect
      const yOffset = Math.sin(t * 0.05) * 3;
      
      // Calculate Look Direction based on Mouse
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // We limit how far the inner face plates move to create a 3D parallax effect
      const maxParallax = 8;
      const pX = (dx / (distance || 1)) * Math.min(distance * 0.05, maxParallax);
      const pY = (dy / (distance || 1)) * Math.min(distance * 0.05, maxParallax);

      // Glitch Effect on Click
      let gX = 0;
      let gY = 0;
      if (clickTimer > 0) {
        gX = (Math.random() - 0.5) * 8;
        gY = (Math.random() - 0.5) * 8;
        clickTimer--;
        if (clickTimer === 0) isClicked = false;
      }

      ctx.save();
      ctx.translate(centerX + gX, centerY + yOffset + gY);

      // Style for the wireframe/plating
      ctx.strokeStyle = '#0f172a'; // Slate-900 (Brutalist Dark)
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.fillStyle = 'white';

      // --- OUTER HEAD SILHOUETTE ---
      ctx.beginPath();
      ctx.moveTo(0, 75); // Chin
      ctx.lineTo(25, 60); // Jaw Right
      ctx.lineTo(40, 25); // Cheek Right
      ctx.lineTo(38, -15); // Temple Right
      ctx.lineTo(25, -60); // Forehead Right
      ctx.lineTo(0, -75); // Crown
      ctx.lineTo(-25, -60); // Forehead Left
      ctx.lineTo(-38, -15); // Temple Left
      ctx.lineTo(-40, 25); // Cheek Left
      ctx.lineTo(-25, 60); // Jaw Left
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // --- INNER CYBERNETIC PLATING (Affected by parallax) ---
      // We shift the context slightly to simulate looking around
      ctx.translate(pX, pY);

      // Forehead Plate
      ctx.beginPath();
      ctx.moveTo(-20, -55);
      ctx.lineTo(20, -55);
      ctx.lineTo(15, -30);
      ctx.lineTo(-15, -30);
      ctx.closePath();
      ctx.stroke();

      // Nose Bridge
      ctx.beginPath();
      ctx.moveTo(-10, -30);
      ctx.lineTo(10, -30);
      ctx.lineTo(12, 10);
      ctx.lineTo(0, 18);
      ctx.lineTo(-12, 10);
      ctx.closePath();
      ctx.stroke();
      
      // Nose Detail
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 18);
      ctx.stroke();

      // Cheek Bones Left
      ctx.beginPath();
      ctx.moveTo(-15, 10);
      ctx.lineTo(-30, 25);
      ctx.lineTo(-20, 45);
      ctx.lineTo(-10, 35);
      ctx.closePath();
      ctx.stroke();

      // Cheek Bones Right
      ctx.beginPath();
      ctx.moveTo(15, 10);
      ctx.lineTo(30, 25);
      ctx.lineTo(20, 45);
      ctx.lineTo(10, 35);
      ctx.closePath();
      ctx.stroke();

      // Jaw / Mouth Plate
      ctx.beginPath();
      ctx.moveTo(-10, 40);
      ctx.lineTo(10, 40);
      ctx.lineTo(15, 55);
      ctx.lineTo(0, 65);
      ctx.lineTo(-15, 55);
      ctx.closePath();
      ctx.stroke();

      // Mouth horizontal lines (synthetic vocal cords)
      for(let i=0; i<3; i++) {
         ctx.beginPath();
         ctx.moveTo(-8 + i, 45 + i*5);
         ctx.lineTo(8 - i, 45 + i*5);
         ctx.stroke();
      }

      // --- EYES (Tracking further) ---
      // We add even more parallax to the glowing pupils for realism
      const eyePx = pX * 1.5;
      const eyePy = pY * 1.5;

      // Eye Sockets
      ctx.fillStyle = '#0f172a'; // Black sockets
      ctx.beginPath();
      ctx.moveTo(-28, -25);
      ctx.lineTo(-12, -25);
      ctx.lineTo(-8, -10);
      ctx.lineTo(-24, -10);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(28, -25);
      ctx.lineTo(12, -25);
      ctx.lineTo(8, -10);
      ctx.lineTo(24, -10);
      ctx.closePath();
      ctx.fill();

      // Synthetic Pupils (Glow blue or red if clicked)
      ctx.fillStyle = isClicked ? '#ef4444' : '#38bdf8'; // Red alert vs Sky blue
      
      // Left Pupil
      ctx.beginPath();
      ctx.arc(-18 + eyePx, -17 + eyePy, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Right Pupil
      ctx.beginPath();
      ctx.arc(18 + eyePx, -17 + eyePy, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();
      drawHumanoid(time);
      
      time++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-0 relative group cursor-crosshair">
      <div className="absolute inset-0 bg-slate-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000 -z-10"></div>
      <canvas 
        ref={canvasRef} 
        className="active:scale-[0.98] transition-transform duration-75"
      />
    </div>
  );
}
