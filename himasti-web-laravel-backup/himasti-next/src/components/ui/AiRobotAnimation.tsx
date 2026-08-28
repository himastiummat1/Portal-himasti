"use client";

import React, { useEffect, useRef } from 'react';

export default function AiRobotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // High resolution canvas for sharp text
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = 800;
    const logicalHeight = 350;
    
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    
    // Mouse Interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle class
    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      density: number;

      constructor(x: number, y: number) {
        this.x = x + (Math.random() - 0.5) * 50; // spawn slightly scrambled
        this.y = y + (Math.random() - 0.5) * 50;
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.5 + 1;
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        // Mouse repel physics
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        
        // Repel distance
        const maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Spring back to base position
          if (this.x !== this.baseX) {
            let dxBase = this.x - this.baseX;
            this.x -= dxBase / 10;
          }
          if (this.y !== this.baseY) {
            let dyBase = this.y - this.baseY;
            this.y -= dyBase / 10;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      
      // Draw text on canvas temporarily to scan pixels
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      ctx.fillStyle = 'white';
      ctx.font = '900 110px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '8px';
      ctx.fillText('HIMASTI', logicalWidth / 2, logicalHeight / 2 - 20);

      // Scan canvas pixels
      const textCoordinates = ctx.getImageData(0, 0, logicalWidth * dpr, logicalHeight * dpr);
      
      // We step by 6 pixels to not have millions of particles, keeping it a "network"
      const step = 6 * dpr; 
      
      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3];
          
          if (alpha > 128) {
            // Found a pixel that belongs to the text
            // Divide by dpr to convert back to logical coordinates
            particles.push(new Particle(x / dpr, y / dpr));
          }
        }
      }
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    };

    initParticles();

    // Background floating nodes for depth
    const bgNodes = Array.from({length: 40}, () => ({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
    }));

    const drawBgNetwork = () => {
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)'; // faint slate-500
        ctx.lineWidth = 1;

        bgNodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if(node.x < 0 || node.x > logicalWidth) node.vx *= -1;
            if(node.y < 0 || node.y > logicalHeight) node.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
            ctx.fill();
        });

        for(let i=0; i<bgNodes.length; i++){
            for(let j=i+1; j<bgNodes.length; j++){
                let dx = bgNodes[i].x - bgNodes[j].x;
                let dy = bgNodes[i].y - bgNodes[j].y;
                let dist = dx*dx + dy*dy;
                if(dist < 10000) {
                    ctx.beginPath();
                    ctx.moveTo(bgNodes[i].x, bgNodes[i].y);
                    ctx.lineTo(bgNodes[j].x, bgNodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    const drawNetworkConnections = () => {
      // Connect nearby particles in the text to form a web
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)'; // slate-900 line
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        // Only check next few particles to save performance, since they are generated somewhat sequentially
        for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = dx * dx + dy * dy;

          if (distance < 120) { // Connect if very close
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawDivisions = () => {
        const divs = ["Kemuhammadiyahan", "Kaderisasi", "Riset & Pengembangan", "Medkom", "Humas", "Kewirausahaan", "Minat Bakat", "Aksi Advokasi"];
        ctx.fillStyle = '#64748b'; // slate-500
        ctx.font = '500 12px sans-serif';
        ctx.textAlign = 'center';
        
        const spacing = logicalWidth / divs.length;
        divs.forEach((div, index) => {
            const x = (spacing * index) + (spacing / 2);
            const y = logicalHeight - 30;
            ctx.fillText(div, x, y);
        });
    }

    const animate = () => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      
      drawBgNetwork();

      drawNetworkConnections();
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      drawDivisions();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-0 relative w-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="cursor-crosshair max-w-full"
      />
    </div>
  );
}
