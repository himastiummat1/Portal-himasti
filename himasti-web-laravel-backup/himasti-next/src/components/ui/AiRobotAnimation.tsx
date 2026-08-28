"use client";

import React, { useEffect, useRef } from 'react';

const divisions = [
  "Kemuhammadiyahan",
  "Kaderisasi",
  "Litbang",
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

    // Set canvas dimensions - make it a bit wider to fit orbiting text
    canvas.width = 600;
    canvas.height = 300;

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
    const spherePoints: {x: number, y: number, z: number, type: 'node'}[] = [];
    const numPoints = 200;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
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
      // Spread them around an orbit that is 1.8x the radius of the sphere
      const x = Math.cos(angle) * 1.8;
      const z = Math.sin(angle) * 1.8;
      // Add slight varied Y tilt so they aren't completely flat
      const y = Math.sin(angle * 2) * 0.2; 
      divisionPoints.push({ x, y, z, text: divisions[i], type: 'text' });
    }

    const drawCore = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80;

      // Smoothly interpolate current rotation to target rotation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

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

      // Combine sphere and division points for projection
      const allPoints = [...spherePoints, ...divisionPoints];

      // Project points to 2D
      const projectedPoints = allPoints.map(p => {
        // Rotate around X axis
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;
        
        // Rotate around Y axis
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;
        
        // Scale and project
        const scale = 300 / (300 - z2 * currentRadius); 
        const px = centerX + x2 * currentRadius * scale;
        const py = centerY + y1 * currentRadius * scale;
        
        return { ...p, px, py, z: z2, scale };
      });

      // We inject the center "HIMASTI" text at Z=0
      projectedPoints.push({
         type: 'center_text',
         text: 'HIMASTI',
         x: 0, y: 0, z: 0,
         px: centerX,
         py: centerY,
         scale: 300 / 300 // Z is 0
      });

      // Sort points by Z depth for proper rendering order (back to front)
      projectedPoints.sort((a, b) => b.z - a.z);

      // Draw Connections for Nodes ONLY
      ctx.lineWidth = 0.5;
      const nodesOnly = projectedPoints.filter(p => p.type === 'node');
      for (let i = 0; i < nodesOnly.length; i++) {
        const p1 = nodesOnly[i];
        if (p1.z > 0.5) continue; // Skip lines in the far back

        for (let j = i + 1; j < Math.min(i + 7, nodesOnly.length); j++) {
           const p2 = nodesOnly[j];
           const dx = p1.px - p2.px;
           const dy = p1.py - p2.py;
           const dist = dx*dx + dy*dy;
           
           if (dist < 1200) {
              const alpha = (1 - dist / 1200) * (p1.z < 0 ? 0.8 : 0.2);
              ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
           }
        }
      }

      // Draw Entities (Nodes, Orbit Text, Center Text)
      for (const p of projectedPoints) {
        if (p.type === 'node') {
            const alpha = Math.max(0.1, 1 - (p.z + 1) / 2);
            const radius = Math.max(0.5, p.scale * 1.5);
            ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (p.type === 'text') {
            // Division Names Orbiting
            const alpha = Math.max(0.1, 1 - (p.z + 1) / 2);
            const fontSize = Math.max(6, 11 * p.scale);
            
            ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
            ctx.font = `600 ${fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Slight letter spacing simulation by just using standard fillText
            ctx.fillText(p.text || '', p.px, p.py);
        }
        else if (p.type === 'center_text') {
            // Central HIMASTI Text (3D illusion inside the core)
            // It scales based on click explosion slightly
            const fontSize = 24 * (1 + (explosionRadius * 0.2));
            ctx.fillStyle = '#0f172a';
            ctx.font = `900 ${fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw a glowing/white shadow behind it so it's readable through the front nodes
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;
            ctx.fillText(p.text || '', p.px, p.py);
            ctx.shadowBlur = 0; // reset
        }
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
    <div className="flex flex-col items-center justify-center mb-0 relative cursor-crosshair">
      <canvas 
        ref={canvasRef} 
        className="active:scale-[0.98] transition-transform duration-75 max-w-full"
      />
    </div>
  );
}
