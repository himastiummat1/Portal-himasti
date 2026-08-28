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
    canvas.width = 300;
    canvas.height = 180;

    let time = 0;
    let animationFrameId: number;

    const drawGrid = () => {
      ctx.strokeStyle = '#e2e8f0'; // slate-200
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    };

    const drawRobot = (t: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Bobbing effect
      const yOffset = Math.sin(t * 0.05) * 5;

      // Draw Main Head (Brutalist square)
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#0f172a'; // slate-900
      ctx.lineWidth = 3;
      
      const headWidth = 120;
      const headHeight = 90;
      const headX = centerX - headWidth / 2;
      const headY = centerY - headHeight / 2 + yOffset;

      ctx.fillRect(headX, headY, headWidth, headHeight);
      ctx.strokeRect(headX, headY, headWidth, headHeight);

      // Draw Ears / Antennas
      const earWidth = 15;
      const earHeight = 30;
      
      // Left Ear
      ctx.fillRect(headX - earWidth, headY + 30, earWidth, earHeight);
      ctx.strokeRect(headX - earWidth, headY + 30, earWidth, earHeight);
      
      // Right Ear
      ctx.fillRect(headX + headWidth, headY + 30, earWidth, earHeight);
      ctx.strokeRect(headX + headWidth, headY + 30, earWidth, earHeight);

      // Top Antenna
      ctx.beginPath();
      ctx.moveTo(centerX, headY);
      ctx.lineTo(centerX, headY - 20);
      ctx.stroke();
      
      // Antenna Node (Blinking)
      const blink = Math.sin(t * 0.2) > 0 ? '#0f172a' : 'white';
      ctx.fillStyle = blink;
      ctx.beginPath();
      ctx.arc(centerX, headY - 25, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes Visor (Black screen)
      ctx.fillStyle = '#0f172a';
      const visorWidth = 90;
      const visorHeight = 30;
      const visorX = centerX - visorWidth / 2;
      const visorY = headY + 20;
      ctx.fillRect(visorX, visorY, visorWidth, visorHeight);

      // Scanning Eyes
      const scanX = Math.sin(t * 0.08) * 20;
      ctx.fillStyle = 'white';
      
      // Left Eye
      ctx.fillRect(centerX - 25 + scanX, visorY + 8, 10, 14);
      // Right Eye
      ctx.fillRect(centerX + 15 + scanX, visorY + 8, 10, 14);

      // Mouth (Voice Waves)
      const mouthY = headY + 65;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        const waveHeight = Math.abs(Math.sin(t * 0.15 + i)) * 10 + 2;
        ctx.beginPath();
        ctx.moveTo(centerX + i * 10, mouthY - waveHeight/2);
        ctx.lineTo(centerX + i * 10, mouthY + waveHeight/2);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();
      drawRobot(time);
      
      time++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex justify-center mb-2">
      <canvas 
        ref={canvasRef} 
        style={{ width: '300px', height: '180px' }}
        className="pointer-events-none"
      />
    </div>
  );
}
