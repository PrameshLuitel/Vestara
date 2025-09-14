
// Inspired by https://codepen.io/robin-dela/pen/KKPYoBq

"use client";
import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const AnimatedHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let mouse = { x: 0, y: 0 };

    const setCanvasExtents = () => {
      if (containerRef.current) {
        w = canvas.width = containerRef.current.clientWidth;
        h = canvas.height = containerRef.current.clientHeight;
      }
    };
    setCanvasExtents();
    window.addEventListener('resize', setCanvasExtents);

    const handleMouseMove = (e: MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }
    }
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseleave', () => {
        mouse.x = w / 2;
        mouse.y = h / 2;
    });

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x + (Math.random() - 0.5) * 50;
        this.y = y + (Math.random() - 0.5) * 50;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.color = theme === 'dark' ? 'hsla(0, 0%, 80%, 0.8)' : 'hsla(0, 0%, 50%, 0.5)';
      }

      draw() {
        if(!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = (forceDirectionX * force * this.density);
        let directionY = (forceDirectionY * force * this.density);

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    let particles: Particle[] = [];
    const init = () => {
      particles = [];
      const gap = 25; // Increased gap for fewer particles
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          particles.push(new Particle(x, y));
        }
      }
    };
    init();

    const connect = () => {
        if(!ctx) return;
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                const connectDistance = (w / 8) * (h / 8); // Adjusted connection distance
                if (distance < connectDistance) {
                    opacityValue = 1 - (distance/connectDistance);
                    const strokeColor = theme === 'dark' 
                        ? 'hsla(0, 0%, 90%, ' + opacityValue * 0.5 + ')' 
                        : 'hsla(0, 0%, 50%, ' + opacityValue * 0.3 + ')';
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    let animationFrameId: number;
    const animate = () => {
        if(!ctx) return;
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connect();
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    const currentContainerRef = containerRef.current;
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', setCanvasExtents);
        if (currentContainerRef) {
          currentContainerRef.removeEventListener('mousemove', handleMouseMove);
          currentContainerRef.removeEventListener('mouseleave', () => {
            mouse.x = w / 2;
            mouse.y = h / 2;
          });
        }
    };
  }, [theme]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full bg-transparent"></canvas>
    </div>
  );
};

export default AnimatedHero;
