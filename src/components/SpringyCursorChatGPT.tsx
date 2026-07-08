'use client';

import React, { useEffect, useRef } from 'react';

interface SpringyCursorProps {
  wrapperElement?: HTMLElement;
  zIndex?: number;
}

const SpringyCursor = ({ wrapperElement, zIndex }: SpringyCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const imagePaths = [
    '/assets/exeggcute/egg1.png',
    '/assets/exeggcute/egg2.png',
    '/assets/exeggcute/egg3.png',
    '/assets/exeggcute/egg4.png',
    '/assets/exeggcute/egg5.png',
    '/assets/exeggcute/egg6.png',
  ];

  const nDots = 6;
  const DELTAT = 0.01;
  const SEGLEN = 10;
  const SPRINGK = 10;
  const MASS = 1;
  const GRAVITY = 50;
  const RESISTANCE = 10;
  const STOPVEL = 0.1;
  const STOPACC = 0.1;
  const DOTSIZE = 14;
  const BOUNCE = 0.7;

  class Particle {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    image: HTMLImageElement;

    constructor(image: HTMLImageElement) {
      this.position = {
        x: cursorRef.current.x,
        y: cursorRef.current.y,
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
      this.image = image;
    }

    draw(ctx: CanvasRenderingContext2D) {
      const size = 28;

      ctx.drawImage(
        this.image,
        this.position.x - size / 2,
        this.position.y + 30 - size / 2,
        size,
        size
      );
    }
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let canvas: HTMLCanvasElement | null = null;
    let context: CanvasRenderingContext2D | null = null;

    const init = async () => {
      if (prefersReducedMotion.matches) return;

      canvas = canvasRef.current;
      if (!canvas) return;

      context = canvas.getContext('2d');
      if (!context) return;

      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = zIndex ? zIndex.toString() : '';

      if (wrapperElement) {
        canvas.style.position = 'absolute';
        wrapperElement.appendChild(canvas);
        canvas.width = wrapperElement.clientWidth;
        canvas.height = wrapperElement.clientHeight;
      } else {
        canvas.style.position = 'fixed';
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const images = await Promise.all(
        imagePaths.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve(img);
              img.onerror = reject;
            })
        )
      );

      imagesRef.current = images;

      for (let i = 0; i < nDots; i++) {
        particlesRef.current[i] = new Particle(images[i % images.length]);
      }

      bindEvents();
      loop();
    };

    const bindEvents = () => {
      const element = wrapperElement || document.body;

      element.addEventListener('mousemove', onMouseMove);
      element.addEventListener('touchmove', onTouchMove, { passive: true });
      element.addEventListener('touchstart', onTouchMove, { passive: true });

      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      if (!canvasRef.current) return;

      if (wrapperElement) {
        canvasRef.current.width = wrapperElement.clientWidth;
        canvasRef.current.height = wrapperElement.clientHeight;
      } else {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;

      if (wrapperElement) {
        const rect = wrapperElement.getBoundingClientRect();
        cursorRef.current.x = e.touches[0].clientX - rect.left;
        cursorRef.current.y = e.touches[0].clientY - rect.top;
      } else {
        cursorRef.current.x = e.touches[0].clientX;
        cursorRef.current.y = e.touches[0].clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (wrapperElement) {
        const rect = wrapperElement.getBoundingClientRect();
        cursorRef.current.x = e.clientX - rect.left;
        cursorRef.current.y = e.clientY - rect.top;
      } else {
        cursorRef.current.x = e.clientX;
        cursorRef.current.y = e.clientY;
      }
    };

    function springForce(
      i: number,
      j: number,
      spring: { X: number; Y: number }
    ) {
      const dx =
        particlesRef.current[i].position.x -
        particlesRef.current[j].position.x;

      const dy =
        particlesRef.current[i].position.y -
        particlesRef.current[j].position.y;

      const len = Math.sqrt(dx * dx + dy * dy);

      if (len > SEGLEN) {
        const springF = SPRINGK * (len - SEGLEN);

        spring.X += (dx / len) * springF;
        spring.Y += (dy / len) * springF;
      }
    }

    const updateParticles = () => {
      if (!canvasRef.current || !context) return;

      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      particlesRef.current[0].position.x = cursorRef.current.x;
      particlesRef.current[0].position.y = cursorRef.current.y;

      particlesRef.current[0].draw(context);

      for (let i = 1; i < nDots; i++) {
        const spring = { X: 0, Y: 0 };

        if (i > 0) springForce(i - 1, i, spring);
        if (i < nDots - 1) springForce(i + 1, i, spring);

        const resist = {
          X: -particlesRef.current[i].velocity.x * RESISTANCE,
          Y: -particlesRef.current[i].velocity.y * RESISTANCE,
        };

        const accel = {
          X: (spring.X + resist.X) / MASS,
          Y: (spring.Y + resist.Y) / MASS + GRAVITY,
        };

        particlesRef.current[i].velocity.x += DELTAT * accel.X;
        particlesRef.current[i].velocity.y += DELTAT * accel.Y;

        if (
          Math.abs(particlesRef.current[i].velocity.x) < STOPVEL &&
          Math.abs(particlesRef.current[i].velocity.y) < STOPVEL &&
          Math.abs(accel.X) < STOPACC &&
          Math.abs(accel.Y) < STOPACC
        ) {
          particlesRef.current[i].velocity.x = 0;
          particlesRef.current[i].velocity.y = 0;
        }

        particlesRef.current[i].position.x +=
          particlesRef.current[i].velocity.x;

        particlesRef.current[i].position.y +=
          particlesRef.current[i].velocity.y;

        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        if (particlesRef.current[i].position.y >= height - DOTSIZE) {
          if (particlesRef.current[i].velocity.y > 0) {
            particlesRef.current[i].velocity.y *= -BOUNCE;
          }

          particlesRef.current[i].position.y = height - DOTSIZE;
        }

        if (particlesRef.current[i].position.x >= width - DOTSIZE) {
          if (particlesRef.current[i].velocity.x > 0) {
            particlesRef.current[i].velocity.x *= -BOUNCE;
          }

          particlesRef.current[i].position.x = width - DOTSIZE;
        }

        if (particlesRef.current[i].position.x <= 0) {
          if (particlesRef.current[i].velocity.x < 0) {
            particlesRef.current[i].velocity.x *= -BOUNCE;
          }

          particlesRef.current[i].position.x = 0;
        }

        particlesRef.current[i].draw(context);
      }
    };

    const loop = () => {
      updateParticles();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    init();

    return () => {
      if (canvas) {
        canvas.remove();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const element = wrapperElement || document.body;

      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchstart', onTouchMove);

      window.removeEventListener('resize', onWindowResize);
    };
  }, [wrapperElement, zIndex]);

  return <canvas ref={canvasRef} />;
};

export default SpringyCursor;