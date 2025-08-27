// Inspired by https://codepen.io/robin-dela/pen/KKPYoBq

"use client";
import React, { useEffect, useRef } from 'react';

const AnimatedHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<any[]>([]);
  const radiusRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    const setCanvasExtents = () => {
      w = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      h = canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };
    setCanvasExtents();
    window.onresize = setCanvasExtents;
    
    const STAR_COUNT = 800;
    const STAR_MIN_SCALE = 0.2;
    const STAR_MAX_SCALE = 1.5;
    const OVERFLOW_THRESHOLD = 50;

    const generate = () => {
      for (let i = 0; i < STAR_COUNT; i++) {
        starsRef.current[i] = {
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
        };
      }
    };
    generate();

    const recycleStar = (star: any) => {
        star.x = (Math.random() * w - w / 2) * radiusRef.current;
        star.y = (Math.random() * h - h / 2) * radiusRef.current;
        star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
        star.color = `rgba(173, 216, 230, ${0.5 + Math.random() * 0.5})`;
        star.opacity = 0;
    };


    const moveStars = (delta: number) => {
        starsRef.current.forEach((star) => {
            star.z -= delta * velocityRef.current;
            if (star.z <= 0) {
                recycleStar(star);
            }
        });
    };
    
    const setup = () => {
        radiusRef.current = Math.min(w, h) / 2.2;
        velocityRef.current = 0.05;
        starsRef.current.forEach(recycleStar);
    };
    setup();


    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, radiusRef.current);
      gradient.addColorStop(0, 'rgba(25, 25, 112, 0.1)'); 
      gradient.addColorStop(0.3, 'rgba(75, 0, 130, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      starsRef.current.forEach((star) => {
        const x = star.x / star.z + w / 2;
        const y = star.y / star.z + h / 2;

        if (x < 0 || x >= w || y < 0 || y >= h) {
          return;
        }

        const scale = star.z;
        const d = (1 - scale) * 3;
        ctx.beginPath();
        ctx.arc(x, y, d, 0, Math.PI * 2, true);
        ctx.fillStyle = star.color;
        ctx.closePath();
        ctx.fill();
      });
    };

    let animationFrameId: number;
    const step = (time: number) => {
        moveStars(time / 16);
        render();
        animationFrameId = requestAnimationFrame(step);
    };
    
    animationFrameId = requestAnimationFrame(step);

    return () => {
        window.onresize = null;
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-[#080210]"></canvas>;
};

export default AnimatedHero;
