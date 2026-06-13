import { useEffect, useRef } from 'react';

/**
 * Full-viewport fixed particle wave canvas.
 * Renders an organic 3D dot-grid wave across the entire screen.
 * Reacts to scroll position for a parallax drift effect.
 * Background color: #050f0a (near-black green tint).
 */
export default function ParticleWave() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let scrollY = 0;

        // Grid config — dense organic mesh
        const cols = 70;
        const rows = 55;
        const spacing = 18;

        // Camera / Projection config
        const fov = 500;
        const angleX = 0.48;
        const angleY = -0.38;

        let time = 0;

        const handleScroll = () => {
            scrollY = window.scrollY || window.pageYOffset;
        };

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleResize();
        handleScroll();

        const render = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Clear with the global dark green-tinted background
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#050f0a';
            ctx.fillRect(0, 0, width, height);

            // Radial green glow — centered slightly right
            const glowX = width * 0.6;
            const glowY = height * 0.45;
            const glowRadius = Math.max(width, height) * 0.55;

            const glowGrad = ctx.createRadialGradient(
                glowX, glowY, 40,
                glowX, glowY, glowRadius
            );
            glowGrad.addColorStop(0, 'rgba(0, 61, 31, 0.45)');
            glowGrad.addColorStop(0.3, 'rgba(0, 35, 18, 0.2)');
            glowGrad.addColorStop(0.6, 'rgba(0, 15, 8, 0.08)');
            glowGrad.addColorStop(1, 'rgba(5, 15, 10, 0)');

            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, width, height);

            time += 0.01;

            // Scroll-based parallax offset — dots drift vertically as user scrolls
            const scrollOffset = scrollY * 0.15;

            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            const projectedPoints = [];

            for (let ix = 0; ix < cols; ix++) {
                for (let iz = 0; iz < rows; iz++) {
                    const cx = (ix - cols / 2) * spacing;
                    const cz = (iz - rows / 2) * spacing;

                    // Organic undulating wave — fabric/terrain-like
                    const distFromCenter = Math.sqrt(cx * cx + cz * cz);
                    const y =
                        Math.sin(ix * 0.1 + time * 0.85) * 26 +
                        Math.cos(iz * 0.08 + time * 0.7) * 18 +
                        Math.sin(distFromCenter * 0.01 - time * 0.45) * 14 +
                        Math.sin((ix + iz) * 0.055 + time * 0.35) * 9;

                    // Rotation around Y-axis
                    const rotX1 = cx * cosY - cz * sinY;
                    const rotZ1 = cx * sinY + cz * cosY;

                    // Rotation around X-axis
                    const rotY2 = y * cosX - rotZ1 * sinX;
                    const rotZ2 = y * sinX + rotZ1 * cosX;

                    // Perspective projection
                    const scale = fov / (fov + rotZ2);

                    // Center the grid in the viewport, apply scroll parallax
                    const screenX = (width * 0.55) + rotX1 * scale;
                    const screenY = (height * 0.48) + rotY2 * scale - scrollOffset;

                    projectedPoints.push({
                        x: screenX,
                        y: screenY,
                        z: rotZ2,
                        scale,
                        ix,
                        iz,
                    });
                }
            }

            // Sort by depth (back-to-front)
            projectedPoints.sort((a, b) => b.z - a.z);

            projectedPoints.forEach(pt => {
                // Skip off-screen points with margin
                if (pt.x < -40 || pt.x > width + 40 || pt.y < -60 || pt.y > height + 60) {
                    return;
                }

                const size = Math.max(0.5, 1.5 * pt.scale);
                const depthFade = Math.max(0, Math.min(1, pt.scale * 1.15));
                const alpha = depthFade * 0.6;

                // Main dot — electric green
                ctx.fillStyle = `rgba(0, 230, 118, ${alpha})`;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
                ctx.fill();

                // Soft glow halo on alternating points
                if ((pt.ix + pt.iz) % 3 === 0) {
                    ctx.fillStyle = `rgba(0, 230, 118, ${alpha * 0.08})`;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, size * 3.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    );
}
