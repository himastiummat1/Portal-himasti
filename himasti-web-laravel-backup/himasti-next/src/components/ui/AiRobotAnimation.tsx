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

    let animationFrameId: number;
    let time = 0;
    
    // Mouse Interaction
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    
    let isClicked = false;
    let explosionRadius = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;
      
      // Map mouse position to rotation target
      targetRotY = x * 0.005;
      targetRotX = y * 0.005;
    };

    const handleClick = () => {
      isClicked = true;
      explosionRadius = 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Generate 3D Sphere Points (Fibonacci lattice)
    const points: {x: number, y: number, z: number}[] = [];
    const numPoints = 250;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      points.push({ x, y, z });
    }

    const drawCore = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80;

      // Smoothly interpolate current rotation to target rotation
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;

      // Continuous base rotation
      const rotY = time * 0.005 + currentRotY;
      const rotX = currentRotX;

      // Handle explosion effect
      let currentRadius = baseRadius;
      if (isClicked) {
        explosionRadius += (1.5 - explosionRadius) * 0.1;
        currentRadius *= explosionRadius;
        if (explosionRadius > 1.45) {
            isClicked = false;
        }
      } else {
        if (explosionRadius > 0) {
            explosionRadius += (0 - explosionRadius) * 0.1;
            currentRadius *= (1 + explosionRadius);
        }
      }

      // Precalculate rotation sines/cosines
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Project points to 2D
      const projectedPoints = points.map(p => {
        // Rotate around X axis
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;
        
        // Rotate around Y axis
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;
        
        // Scale and project
        const scale = 300 / (300 - z2 * currentRadius); // Perspective
        const px = centerX + x2 * currentRadius * scale;
        const py = centerY + y1 * currentRadius * scale;
        
        return { px, py, z: z2, scale };
      });

      // Sort points by Z depth for proper rendering order (back to front)
      projectedPoints.sort((a, b) => b.z - a.z);

      // Draw Connection Lines (Constellation Effect)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (p1.z > 0.5) continue; // Don't draw lines for nodes too far back to keep it clean

        // Find nearest neighbors to draw connections
        for (let j = i + 1; j < Math.min(i + 8, projectedPoints.length); j++) {
           const p2 = projectedPoints[j];
           const dx = p1.px - p2.px;
           const dy = p1.py - p2.py;
           const dist = dx*dx + dy*dy;
           
           if (dist < 1500) {
              const alpha = (1 - dist / 1500) * (p1.z < 0 ? 0.8 : 0.2);
              ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`; // slate-900
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
           }
        }
      }

      // Draw Nodes
      for (const p of projectedPoints) {
        // Calculate opacity based on Z-depth (closer is more opaque)
        const alpha = Math.max(0.1, 1 - (p.z + 1) / 2);
        const radius = Math.max(0.5, p.scale * 1.5);
        
        ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Central Processing Ring
      ctx.strokeStyle = `rgba(15, 23, 42, 0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Ellipse simulating a ring around the sphere
      ctx.ellipse(centerX, centerY, currentRadius * 1.4, currentRadius * 0.4 * Math.cos(currentRotX), currentRotX, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner Scanning Ring
      ctx.strokeStyle = `rgba(15, 23, 42, 0.6)`;
      ctx.beginPath();
      const ringAngle = time * 0.05;
      ctx.ellipse(centerX, centerY, currentRadius * 1.3, currentRadius * 0.35 * Math.cos(currentRotX), currentRotX, ringAngle, ringAngle + Math.PI / 2);
      ctx.stroke();

      time++;
      animationFrameId = requestAnimationFrame(drawCore);
    };

    drawCore();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-0 relative cursor-crosshair">
      <canvas 
        ref={canvasRef} 
        className="active:scale-[0.98] transition-transform duration-75"
      />
    </div>
  );
}
