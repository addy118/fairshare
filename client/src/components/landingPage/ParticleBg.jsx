import React, { useEffect, useRef } from "react";

// Particle Background Component
export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles = []
    let animationFrameId
    const mousePosition = { x: null, y: null }
    let isActive = true // Flag to track if component is active

    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Recreate particles when canvas is resized to ensure proper distribution
      createParticles()
    }

    const createParticles = () => {
      if (!canvas) return
      particles = []
      // Adjust particle count for better performance while maintaining visual appeal
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          color:
            i % 5 === 0
              ? "rgba(45, 212, 191, 0.7)" // Teal particles (brighter)
              : i % 7 === 0
                ? "rgba(168, 85, 247, 0.7)" // Purple particles (brighter)
                : "rgba(255, 255, 255, 0.3)", // White particles (brighter)
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          connections: [],
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          originalRadius: Math.random() * 2 + 0.5,
        })
      }
    }

    const drawParticles = () => {
      if (!ctx || !canvas || !isActive) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Move particle
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Pulse effect
        particle.radius += particle.pulseDirection * particle.pulseSpeed
        if (particle.radius > particle.originalRadius * 1.5 || particle.radius < particle.originalRadius * 0.5) {
          particle.pulseDirection *= -1
        }

        // Bounce off edges with a buffer to prevent particles from getting stuck
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
          // Push particle away from edge slightly
          particle.x = particle.x < 0 ? 1 : canvas.width - 1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
          // Push particle away from edge slightly
          particle.y = particle.y < 0 ? 1 : canvas.height - 1
        }

        // Check if mouse is near this particle
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = particle.x - mousePosition.x
          const dy = particle.y - mousePosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            // Repel particles from mouse
            const angle = Math.atan2(dy, dx)
            const force = (100 - distance) / 100
            particle.x += Math.cos(angle) * force
            particle.y += Math.sin(angle) * force

            // Highlight particles near mouse
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2)
            ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, "0.8)") // Brighter version
            ctx.fill()
          } else {
            // Draw normal particle
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
          }
        } else {
          // Draw normal particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        }

        // Find connections
        particle.connections = []
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              // Increased connection distance
              particle.connections.push({
                point: otherParticle,
                opacity: 1 - distance / 150,
              })
            }
          }
        })

        // Draw connections
        particle.connections.forEach((connection) => {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(connection.point.x, connection.point.y)

          // Create gradient connections
          const gradient = ctx.createLinearGradient(particle.x, particle.y, connection.point.x, connection.point.y)

          // Get colors from both particles
          const color1 = particle.color
          const color2 = connection.point.color

          gradient.addColorStop(0, color1.replace(/[\d.]+\)$/g, `${connection.opacity * 0.5})`))
          gradient.addColorStop(1, color2.replace(/[\d.]+\)$/g, `${connection.opacity * 0.5})`))

          ctx.strokeStyle = gradient
          ctx.lineWidth = 0.8
          ctx.stroke()
        })
      })

      // Continue the animation loop
      animationFrameId = requestAnimationFrame(drawParticles)
    }

    // Track mouse position
    const handleMouseMove = (event) => {
      mousePosition.x = event.clientX
      mousePosition.y = event.clientY
    }

    // Reset mouse position when mouse leaves
    const handleMouseLeave = () => {
      mousePosition.x = null
      mousePosition.y = null
    }

    // Handle window resize
    const handleResize = () => {
      resizeCanvas()
    }

    // Set up event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    // Initialize canvas and start animation
    resizeCanvas()
    createParticles()
    drawParticles()

    // Cleanup function
    return () => {
      isActive = false // Set flag to stop animation
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, []) // Empty dependency array to ensure this only runs once

  return <canvas ref={canvasRef} className="fixed inset-0 -z-5 pointer-events-none opacity-80" style={{ zIndex: -5 }} />
}
