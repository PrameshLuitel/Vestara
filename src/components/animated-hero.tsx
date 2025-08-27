// Inspired by https://codepen.io/robin-dela/pen/KKPYoBq

"use client";
import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const AnimatedHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let mouse = { x: 0, y: 0 };

    const setCanvasExtents = () => {
      w = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      h = canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };
    setCanvasExtents();
    window.onresize = setCanvasExtents;

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    window.addEventListener('mousemove', handleMouseMove);

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
        this.color = theme === 'dark' ? 'hsla(0, 0%, 80%, 0.8)' : 'hsla(222.2, 84%, 4.9%, 0.5)';
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
      const gap = 20;
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

                const connectDistance = (w / 7) * (h / 7);
                if (distance < connectDistance) {
                    opacityValue = 1 - (distance/20000);
                    const strokeColor = theme === 'dark' 
                        ? 'hsla(210, 40%, 90%, ' + opacityValue + ')' 
                        : 'hsla(221.2, 83.2%, 53.3%, ' + opacityValue * 0.5 + ')';
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

    const animate = () => {
        if(!ctx) return;
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    }
    animate();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.onresize = null;
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent"></canvas>;
};

export default AnimatedHero;
