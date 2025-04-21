import React, { useEffect, useRef } from "react";

// New Background Animation Component - Completely rewritten for reliability
export default function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get the canvas element
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the 2D context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    // Create particles
    const particles = [];
    const particleCount = Math.min(
      100,
      Math.floor((window.innerWidth * window.innerHeight) / 15000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color:
          i % 5 === 0
            ? "rgba(45, 212, 191, 0.7)" // Teal
            : i % 7 === 0
              ? "rgba(168, 85, 247, 0.7)" // Purple
              : "rgba(255, 255, 255, 0.4)", // White
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        connections: [],
      });
    }

    // Mouse position for interactivity
    const mouse = {
      x: null,
      y: null,
      radius: 100,
    };

    // Handle mouse movement
    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    // Handle mouse leave
    function handleMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", () => {
      setCanvasSize();
      // Redistribute particles on resize
      particles.forEach((particle) => {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
      });
    });

    // Animation loop
    let animationId;
    let lastTime = 0;
    const fps = 30; // Target FPS
    const interval = 1000 / fps;

    function animate(timestamp) {
      const deltaTime = timestamp - lastTime;

      if (deltaTime >= interval) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];

          // Move particle
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1;
            particle.x = particle.x < 0 ? 0 : canvas.width;
          }

          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1;
            particle.y = particle.y < 0 ? 0 : canvas.height;
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();

          // Find connections
          particle.connections = [];
          for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
              const dx = particle.x - particles[j].x;
              const dy = particle.y - particles[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 150) {
                particle.connections.push({
                  point: particles[j],
                  opacity: 1 - distance / 150,
                });
              }
            }
          }

          // Draw connections
          particle.connections.forEach((connection) => {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(connection.point.x, connection.point.y);

            // Create gradient for connection
            const gradient = ctx.createLinearGradient(
              particle.x,
              particle.y,
              connection.point.x,
              connection.point.y
            );

            gradient.addColorStop(
              0,
              particle.color.replace(
                /[\d.]+\)$/,
                `${connection.opacity * 0.5})`
              )
            );
            gradient.addColorStop(
              1,
              connection.point.color.replace(
                /[\d.]+\)$/,
                `${connection.opacity * 0.5})`
              )
            );

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          });

          // Mouse interaction
          if (mouse.x !== null && mouse.y !== null) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
              // Repel particles from mouse
              const angle = Math.atan2(dy, dx);
              const force = (mouse.radius - distance) / mouse.radius;
              particle.x += Math.cos(angle) * force * 2;
              particle.y += Math.sin(angle) * force * 2;

              // Highlight particles near mouse
              ctx.beginPath();
              ctx.arc(
                particle.x,
                particle.y,
                particle.radius * 1.5,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, "0.8)");
              ctx.fill();
            }
          }
        }

        lastTime = timestamp - (deltaTime % interval);
      }

      // Continue animation loop
      animationId = requestAnimationFrame(animate);
    }

    // Start animation
    animationId = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Fixed background elements */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-50"></div>
      <div className="bg-grid-pattern fixed inset-0 -z-20 opacity-5"></div>

      {/* Canvas for particle animation */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -10,
          pointerEvents: "none",
        }}
      />
    </>
  );
}