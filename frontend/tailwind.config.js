/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                // Core dark palette
                obsidian: {
                    950: '#04060b',
                    900: '#0a0e1a',
                    800: '#0f1629',
                    700: '#151d38',
                    600: '#1c2545',
                },
                // Neon accents
                neon: {
                    emerald: '#34d399',
                    cyan: '#22d3ee',
                    amber: '#fbbf24',
                    crimson: '#f43f5e',
                    purple: '#a78bfa',
                },
            },
            boxShadow: {
                'glow-emerald': '0 0 20px rgba(52, 211, 153, 0.3), 0 0 60px rgba(52, 211, 153, 0.1)',
                'glow-emerald-lg': '0 0 30px rgba(52, 211, 153, 0.4), 0 0 80px rgba(52, 211, 153, 0.15)',
                'glow-crimson': '0 0 20px rgba(244, 63, 94, 0.3), 0 0 60px rgba(244, 63, 94, 0.1)',
                'glow-amber': '0 0 20px rgba(251, 191, 36, 0.3), 0 0 60px rgba(251, 191, 36, 0.1)',
                'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.4s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'scan': 'scan 4s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                glowPulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-16px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
        },
    },
    plugins: [],
};