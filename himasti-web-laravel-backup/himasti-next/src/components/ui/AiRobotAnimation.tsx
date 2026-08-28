"use client";

import React, { useEffect, useRef } from 'react';

export default function AiRobotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let logicalWidth = 800;
    let logicalHeight = 350;
    let isMobile = false;
    let particles: Particle[] = [];
    let bgNodes: {x: number, y: number, vx: number, vy: number}[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let tickerOffset = 0;

    const dpr = window.devicePixelRatio || 1;

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
        this.x = x + (Math.random() - 0.5) * 50;
        this.y = y + (Math.random() - 0.5) * 50;
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.5 + (isMobile ? 0.5 : 1); // smaller on mobile
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        
        // Repel distance smaller on mobile
        const maxDistance = isMobile ? 60 : 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
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
        ctx.fillStyle = '#1e293b'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initScene = () => {
      // Determine size based on container
      logicalWidth = container.clientWidth || window.innerWidth;
      isMobile = logicalWidth < 640;
      logicalHeight = isMobile ? 200 : 350;

      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      
      // Reset transform before scaling again to avoid compounding scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Re-init background nodes
      const numBgNodes = isMobile ? 20 : 40;
      bgNodes = Array.from({length: numBgNodes}, () => ({
          x: Math.random() * logicalWidth,
          y: Math.random() * logicalHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
      }));

      // Re-init text particles
      particles = [];
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      ctx.fillStyle = 'white';
      
      // Dynamic font size
      let fontSize = isMobile ? Math.min(logicalWidth * 0.18, 50) : 110; 
      let letterSpacing = isMobile ? '2px' : '8px';
      
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = letterSpacing;
      
      // Draw text to center
      ctx.fillText('HIMASTI', logicalWidth / 2, logicalHeight / 2 - (isMobile ? 10 : 20));

      const textCoordinates = ctx.getImageData(0, 0, logicalWidth * dpr, logicalHeight * dpr);
      const step = (isMobile ? 3 : 6) * dpr; // denser scanning for smaller text
      
      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3];
          if (alpha > 128) {
            particles.push(new Particle(x / dpr, y / dpr));
          }
        }
      }
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if (e instanceof TouchEvent) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
      } else {
          clientX = e.clientX;
          clientY = e.clientY;
      }

      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    // Attach both Mouse and Touch events for Android optimization
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);

    // Debounced Resize Observer
    let resizeTimer: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initScene();
        }, 150);
    });
    observer.observe(container);

    // Initial load
    initScene();

    const drawBgNetwork = () => {
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
        ctx.lineWidth = 1;

        bgNodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if(node.x < 0 || node.x > logicalWidth) node.vx *= -1;
            if(node.y < 0 || node.y > logicalHeight) node.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.5, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
            ctx.fill();
        });

        // Connection distance based on screen size
        const connDist = isMobile ? 4000 : 10000;
        for(let i=0; i<bgNodes.length; i++){
            for(let j=i+1; j<bgNodes.length; j++){
                let dx = bgNodes[i].x - bgNodes[j].x;
                let dy = bgNodes[i].y - bgNodes[j].y;
                let dist = dx*dx + dy*dy;
                if(dist < connDist) {
                    ctx.beginPath();
                    ctx.moveTo(bgNodes[i].x, bgNodes[i].y);
                    ctx.lineTo(bgNodes[j].x, bgNodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    const drawNetworkConnections = () => {
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.lineWidth = 0.5;
      
      const connectDist = isMobile ? 45 : 120; // shorter connections on mobile
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < Math.min(i + (isMobile ? 10 : 15), particles.length); j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = dx * dx + dy * dy;

          if (distance < connectDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const divs = [
      "KEMUHAMMADIYAHAN", 
      "KADERISASI", 
      "RISET & PENGEMBANGAN", 
      "MEDKOM", 
      "HUMAS", 
      "KEWIRAUSAHAAN", 
      "MINAT BAKAT", 
      "AKSI ADVOKASI"
    ];
    const tickerSpeed = isMobile ? 0.25 : 0.4;
    let tickerItems: {text: string, width: number}[] = [];
    let totalTickerWidth = 0;

    const drawDivisionsMarquee = () => {
        if (tickerItems.length === 0) {
           ctx.font = `500 ${isMobile ? 10 : 12}px monospace`;
           const padding = isMobile ? 25 : 40;
           tickerItems = divs.map(text => ({
               text,
               width: ctx.measureText(text).width + padding
           }));
           totalTickerWidth = tickerItems.reduce((acc, curr) => acc + curr.width, 0);
        }

        ctx.fillStyle = '#64748b'; 
        ctx.font = `500 ${isMobile ? 10 : 12}px monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        tickerOffset -= tickerSpeed;
        if (tickerOffset <= -totalTickerWidth) {
            tickerOffset = 0; 
        }

        const startY = logicalHeight - (isMobile ? 10 : 20);

        for (let loop = 0; loop < 3; loop++) {
            let currentX = tickerOffset + (loop * totalTickerWidth);
            
            for (const item of tickerItems) {
                if (currentX + item.width > 0 && currentX < logicalWidth) {
                    ctx.fillText(item.text, currentX, startY);
                    ctx.beginPath();
                    ctx.arc(currentX + item.width - (isMobile ? 12 : 20), startY, 1.5, 0, Math.PI*2);
                    ctx.fill();
                }
                currentX += item.width;
            }
        }
    }

    const animate = () => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      
      drawBgNetwork();
      drawNetworkConnections();
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      drawDivisionsMarquee();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center mb-0 relative w-full overflow-hidden min-h-[200px]">
      <canvas 
        ref={canvasRef} 
        className="cursor-crosshair max-w-full touch-none"
      />
    </div>
  );
}
