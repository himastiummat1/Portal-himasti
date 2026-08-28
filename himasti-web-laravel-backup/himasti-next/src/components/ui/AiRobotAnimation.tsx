"use client";

import React, { useEffect, useRef, useState } from 'react';

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
      clickTimer = 20; // Glitch / scan effect duration
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Random data strings for "High-Tech" background
    const randomStrings = Array(5).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      text: Math.random().toString(36).substring(2, 8).toUpperCase(),
      speed: Math.random() * 0.5 + 0.1
    }));

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

    const drawDataStrings = () => {
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '10px monospace';
      randomStrings.forEach(str => {
        ctx.fillText(str.text, str.x, str.y);
        str.y -= str.speed;
        if (str.y < 0) {
          str.y = canvas.height;
          str.text = Math.random().toString(36).substring(2, 10).toUpperCase();
        }
      });
    };

    const drawRobot = (t: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 10;

      // Bobbing effect
      const yOffset = Math.sin(t * 0.05) * 5;
      
      // Calculate Look Direction based on Mouse
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxEyeOffset = 15;
      const eyeOffsetX = (dx / (distance || 1)) * Math.min(distance * 0.1, maxEyeOffset);
      const eyeOffsetY = (dy / (distance || 1)) * Math.min(distance * 0.1, maxEyeOffset) * 0.5;

      // Head Glitch Effect on Click
      let glitchX = 0;
      if (clickTimer > 0) {
        glitchX = (Math.random() - 0.5) * 10;
        clickTimer--;
        if (clickTimer === 0) isClicked = false;
      }

      // Draw Crosshairs
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(centerX, centerY + yOffset, 90, 0, Math.PI * 2);
      ctx.stroke();
      
      const headWidth = 140;
      const headHeight = 100;
      const headX = centerX - headWidth / 2 + glitchX;
      const headY = centerY - headHeight / 2 + yOffset;

      // Neck
      ctx.fillStyle = '#334155'; // dark slate
      ctx.fillRect(centerX - 20 + glitchX, headY + headHeight, 40, 30);
      for(let i=0; i<3; i++) {
        ctx.strokeStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(centerX - 20 + glitchX, headY + headHeight + 10 + (i*8));
        ctx.lineTo(centerX + 20 + glitchX, headY + headHeight + 10 + (i*8));
        ctx.stroke();
      }

      // Main Head
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#0f172a'; // slate-900
      ctx.lineWidth = 3;
      ctx.fillRect(headX, headY, headWidth, headHeight);
      ctx.strokeRect(headX, headY, headWidth, headHeight);

      // Cybernetic panel lines
      ctx.beginPath();
      ctx.moveTo(headX, headY + 20);
      ctx.lineTo(headX + 20, headY);
      ctx.stroke();
      
      // Ears / Sensors
      const earWidth = 18;
      const earHeight = 45;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(headX - earWidth, headY + 25, earWidth, earHeight);
      ctx.strokeRect(headX - earWidth, headY + 25, earWidth, earHeight);
      ctx.fillRect(headX + headWidth, headY + 25, earWidth, earHeight);
      ctx.strokeRect(headX + headWidth, headY + 25, earWidth, earHeight);

      // Visor Screen
      ctx.fillStyle = isClicked ? '#b91c1c' : '#0f172a'; // Turns red on click
      const visorWidth = 110;
      const visorHeight = 40;
      const visorX = centerX - visorWidth / 2 + glitchX;
      const visorY = headY + 20;
      ctx.fillRect(visorX, visorY, visorWidth, visorHeight);
      
      // Scanning line inside visor
      if (!isClicked) {
         const scanY = Math.sin(t * 0.1) * (visorHeight/2 - 2);
         ctx.strokeStyle = 'rgba(255,255,255,0.2)';
         ctx.beginPath();
         ctx.moveTo(visorX, visorY + visorHeight/2 + scanY);
         ctx.lineTo(visorX + visorWidth, visorY + visorHeight/2 + scanY);
         ctx.stroke();
      }

      // Eyes (Follow Mouse)
      ctx.fillStyle = isClicked ? 'white' : '#38bdf8'; // Sky blue normally, white when alert
      
      // Left Eye
      ctx.fillRect(centerX - 30 + eyeOffsetX + glitchX, visorY + 12 + eyeOffsetY, 16, 16);
      // Right Eye
      ctx.fillRect(centerX + 14 + eyeOffsetX + glitchX, visorY + 12 + eyeOffsetY, 16, 16);

      // Core / Voice module
      const mouthY = headY + 75;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      const numWaves = isClicked ? 7 : 4;
      const waveSpread = isClicked ? 8 : 10;
      for (let i = -numWaves; i <= numWaves; i++) {
        const activeWave = isClicked ? t * 0.5 : t * 0.15;
        const waveHeight = Math.abs(Math.sin(activeWave + i)) * (isClicked ? 15 : 8) + 2;
        ctx.beginPath();
        ctx.moveTo(centerX + i * waveSpread + glitchX, mouthY - waveHeight/2);
        ctx.lineTo(centerX + i * waveSpread + glitchX, mouthY + waveHeight/2);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();
      drawDataStrings();
      drawRobot(time);
      
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
        className="active:scale-95 transition-transform duration-75"
      />
      <div className="text-[10px] font-mono text-slate-400 mt-2 tracking-widest uppercase">
        Click to initiate system scan
      </div>
    </div>
  );
}
