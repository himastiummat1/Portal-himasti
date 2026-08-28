"use client";

import React, { useEffect, useRef } from 'react';

const divisions = [
  "Kemuhammadiyahan",
  "Kaderisasi",
  "Riset & Pengembangan",
  "Medkom",
  "Humas",
  "Kewirausahaan",
  "Minat Bakat",
  "Aksi Advokasi"
];

export default function AiRobotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions - large enough to dominate the hero section
    canvas.width = 800;
    canvas.height = 450;

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
      
      // Increased sensitivity for better parallax feel
      targetRotY = x * 0.003;
      targetRotX = y * 0.003;
    };

    const handleClick = () => {
      isClicked = true;
      explosionRadius = 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Generate 3D Sphere Points (Fibonacci lattice)
    const spherePoints: {x: number, y: number, z: number, type: 'node'}[] = [];
    const numPoints = 250;
    const phi = Math.PI * (3 - Math.sqrt(5));
    
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y); 
      const theta = phi * i; 
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      spherePoints.push({ x, y, z, type: 'node' });
    }

    // Generate Division Orbit Points (Equatorial Ring)
    const divisionPoints: {x: number, y: number, z: number, text: string, type: 'text'}[] = [];
    const numDivs = divisions.length;
    for (let i = 0; i < numDivs; i++) {
      const angle = (Math.PI * 2 / numDivs) * i;
      // Orbit radius is 1.6x the sphere radius
      const x = Math.cos(angle) * 1.6;
      const z = Math.sin(angle) * 1.6;
      // Slanted orbit
      const y = Math.sin(angle * 2) * 0.15; 
      divisionPoints.push({ x, y, z, text: divisions[i], type: 'text' });
    }

    const drawCore = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 150; // Much larger sphere

      // Smoothly interpolate current rotation to target rotation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      const rotY = time * 0.003 + currentRotY;
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

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const allPoints = [...spherePoints, ...divisionPoints];

      const projectedPoints = allPoints.map(p => {
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;
        
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;
        
        const scale = 400 / (400 - z2 * currentRadius); 
        const px = centerX + x2 * currentRadius * scale;
        const py = centerY + y1 * currentRadius * scale;
        
        return { ...p, px, py, z: z2, scale, origZ: p.z }; // keep original Z for logic
      });

      // Split into back and front arrays to push the text deeper inside
      // By changing the cutoff from 0 to -0.3, more nodes will be drawn in front of the text
      const backNodes = projectedPoints.filter(p => p.type === 'node' && p.z > -0.3).sort((a,b) => b.z - a.z);
      const frontNodes = projectedPoints.filter(p => p.type === 'node' && p.z <= -0.3).sort((a,b) => b.z - a.z);
      const allTexts = projectedPoints.filter(p => p.type === 'text');

      // Helper to draw node connections
      const drawLines = (nodes: any[]) => {
          ctx.lineWidth = 0.5;
          for (let i = 0; i < nodes.length; i++) {
            const p1 = nodes[i];
            
            // Draw lines between nodes
            for (let j = i + 1; j < Math.min(i + 7, nodes.length); j++) {
               const p2 = nodes[j];
               const dx = p1.px - p2.px;
               const dy = p1.py - p2.py;
               const dist = dx*dx + dy*dy;
               if (dist < 3000) {
                  const alpha = (1 - dist / 3000) * (p1.z < 0 ? 0.6 : 0.15);
                  ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
                  ctx.beginPath();
                  ctx.moveTo(p1.px, p1.py);
                  ctx.lineTo(p2.px, p2.py);
                  ctx.stroke();
               }
            }
            
            // Draw tether lines from the core to some nodes to make it look "suspended"
            if (i % 8 === 0) {
               ctx.strokeStyle = `rgba(15, 23, 42, ${p1.z < 0 ? 0.3 : 0.05})`;
               ctx.beginPath();
               ctx.moveTo(p1.px, p1.py);
               ctx.lineTo(centerX, centerY);
               ctx.stroke();
            }
          }
      };

      const drawNodeDots = (nodes: any[]) => {
          for (const p of nodes) {
            const alpha = Math.max(0.05, 1 - (p.z + 1) / 2);
            const pulse = Math.sin(time * 0.1 + p.origZ * 10) > 0.95 ? 1.5 : 0;
            const radius = Math.max(0.5, p.scale * (1.5 + pulse));
            ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
      };

      // 1. Draw BACK nodes and lines
      drawLines(backNodes);
      drawNodeDots(backNodes);

      // 2. Draw Orbiting Texts that are in the BACK
      for (const p of allTexts.filter(p => p.z > 0)) {
          const alpha = Math.max(0.1, 1 - (p.z + 1) / 2) * 0.5;
          const fontSize = Math.max(8, 12 * p.scale);
          ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
          ctx.font = `500 ${fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, p.px, p.py);
      }

      // 3. Draw the Central HIMASTI text (Clean, Elegant, and Deep inside)
      ctx.save();
      ctx.translate(centerX, centerY);
      
      const fontSize = 56 * (1 + (explosionRadius * 0.2));
      
      ctx.fillStyle = '#64748b'; // slate-500 for a solid, clear look
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = "6px";
      ctx.fillText("HIMASTI", 0, 2);
      ctx.restore(); 

      // 4. Draw FRONT nodes and lines (Will perfectly overlap the text!)
      drawLines(frontNodes);
      drawNodeDots(frontNodes);

      // 5. Draw Orbiting Texts that are in the FRONT
      for (const p of allTexts.filter(p => p.z <= 0)) {
          const alpha = Math.min(1, Math.max(0.3, 1 - (p.z + 1) / 2));
          const fontSize = Math.max(12, 14 * p.scale);
          ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
          ctx.font = `600 ${fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // White shadow for better readability of front text
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(p.text, p.px, p.py);
          ctx.shadowBlur = 0;
      }

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
    <div className="flex flex-col items-center justify-center mb-0 relative cursor-crosshair w-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="active:scale-[0.98] transition-transform duration-75 max-w-full"
      />
    </div>
  );
}
