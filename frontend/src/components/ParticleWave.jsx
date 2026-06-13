import { useEffect, useRef } from 'react';

export default function ParticleWave() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Grid config
        const cols = 55;
        const rows = 45;
        const spacing = 18;

        // Camera / Projection config
        const fov = 450;
        const angleX = 0.55; // Vertical tilt (radians)
        const angleY = -0.45; // Horizontal rotation (radians)

        // Wave time state
        let time = 0;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear with near-black color
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            // Draw radial green glow backdrop on the right 60%
            const glowX = width * 0.7;
            const glowY = height * 0.5;
            const glowRadius = Math.max(width, height) * 0.5;
            
            const glowGrad = ctx.createRadialGradient(
                glowX, glowY, 50,
                glowX, glowY, glowRadius
            );
            glowGrad.addColorStop(0, 'rgba(0, 61, 31, 0.45)'); // deep dark green (#003d1f)
            glowGrad.addColorStop(0.4, 'rgba(0, 20, 10, 0.15)');
            glowGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
            
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, width, height);

            time += 0.015;

            // Array to hold points for sorting (painters algorithm) to get correct 3D overlap
            const projectedPoints = [];

            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            for (let ix = 0; ix < cols; ix++) {
                for (let iz = 0; iz < rows; iz++) {
                    // Position point relative to grid center
                    const cx = (ix - cols / 2) * spacing;
                    const cz = (iz - rows / 2) * spacing;

                    // Undulating 3D wave formula
                    const distFromCenter = Math.sqrt(cx * cx + cz * cz);
                    const y = Math.sin(ix * 0.14 + time) * 32 +
                              Math.cos(iz * 0.12 + time * 0.85) * 22 +
                              Math.sin(distFromCenter * 0.015 - time * 0.6) * 12;

                    // 1. Rotation around Y-axis (horizontal)
                    const rotX1 = cx * cosY - cz * sinY;
                    const rotZ1 = cx * sinY + cz * cosY;

                    // 2. Rotation around X-axis (tilt)
                    const rotY2 = y * cosX - rotZ1 * sinX;
                    const rotZ2 = y * sinX + rotZ1 * cosX;

                    // 3. Perspective Projection
                    const scale = fov / (fov + rotZ2);
                    
                    // Offset to shift grid onto the right half of the screen
                    const screenX = (width * 0.7) + rotX1 * scale;
                    const screenY = (height * 0.45) + rotY2 * scale;

                    // Push to array with depth (rotZ2) for sorting
                    projectedPoints.push({
                        x: screenX,
                        y: screenY,
                        z: rotZ2,
                        scale: scale,
                        ix,
                        iz
                    });
                }
            }

            // Sort points by depth (Z desc, i.e. draw back-to-front)
            projectedPoints.sort((a, b) => b.z - a.z);

            // Draw points
            projectedPoints.forEach(pt => {
                // Determine fade based on proximity to left edge
                // Left fade: starts fading from x = width * 0.45 down to width * 0.15 where it becomes 0
                const leftFade = Math.max(0, Math.min(1, (pt.x - (width * 0.2)) / (width * 0.35)));
                
                // If it is offscreen or fully faded, skip drawing
                if (pt.x < 0 || pt.x > width || pt.y < 0 || pt.y > height || leftFade <= 0) {
                    return;
                }

                // Size and Alpha calculation
                // Base size scales with distance
                const size = Math.max(0.6, 1.8 * pt.scale);
                
                // Depth fade (fog effect)
                const depthFade = Math.max(0, Math.min(1, pt.scale * 1.3));
                const alpha = depthFade * leftFade * 0.75;

                // Color calculation: vivid green (#00e676)
                ctx.fillStyle = `rgba(0, 230, 118, ${alpha})`;
                
                // Draw dot
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
                ctx.fill();

                // Optional grid lines (subtle mesh connecting dots horizontally & vertically)
                // Drawing every 4th line for subtle organic complexity
                if (pt.ix % 2 === 0 && pt.iz % 2 === 0) {
                    ctx.fillStyle = `rgba(0, 230, 118, ${alpha * 0.15})`;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, size * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 right-0 w-full h-full block z-0 pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
