import { useState, useEffect } from 'react';
import ParticleWave from '../../components/ParticleWave';

export default function Login({ onLoginSuccess }) {
    // Auth Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldShake, setShouldShake] = useState(false);

    // Layout/UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShouldShake(false);
        setLoading(true);

        const credentials = { username, password };

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (res.ok) {
                onLoginSuccess();
            } else {
                const data = await res.json().catch(() => ({}));
                triggerError(data.detail || 'Authentication failed. Please verify credentials.');
            }
        } catch (err) {
            // Fallback client-side verification if backend is offline or simulating
            console.warn("Backend offline or unreachable. Using fallback local authentication.");
            if (username === 'admin' && password === 'idleaxe') {
                onLoginSuccess();
            } else {
                triggerError('Invalid credentials. (Try admin / idleaxe)');
            }
        } finally {
            setLoading(false);
        }
    };

    const triggerError = (msg) => {
        setError(msg);
        setShouldShake(true);
        // Reset shake state after animation runs so it can shake again
        setTimeout(() => setShouldShake(false), 500);
    };

    // Close modal on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const navLinks = ['Home', 'Resources', 'Features', 'Community', 'Pricing'];

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between bg-[#0a0a0a] text-white font-sans selection:bg-[#00e676]/30 selection:text-[#00e676]">
            {/* Background 3D Particle Wave (occupies right ~60% of screen) */}
            <ParticleWave />

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full">
                <div className="mx-auto max-w-[1200px] w-full px-[20px] md:px-[40px] py-[20px] flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/5 shadow-inner">
                            LOGO
                        </div>
                    </div>

                    {/* Center: Nav links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-[40px]">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="text-white/75 hover:text-white text-[13px] font-medium tracking-wide transition-all duration-200"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    {/* Right: CTA and Login (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-white hover:text-white/80 text-[13px] font-semibold tracking-wide transition-smooth cursor-pointer"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-[18px] py-[8px] rounded-full bg-white hover:bg-white/95 text-black font-bold text-[12px] tracking-wide uppercase transition-smooth shadow-lg active:scale-95 cursor-pointer"
                        >
                            GET STARTED
                        </button>
                    </div>

                    {/* Hamburger Button (Mobile) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 focus:outline-none z-30"
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
                        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
                        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="absolute top-0 left-0 w-full bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/5 flex flex-col p-8 pt-24 gap-6 z-20 md:hidden animate-fade-in-up">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white/70 hover:text-white text-base font-medium tracking-wide transition-smooth"
                                >
                                    {link}
                                </a>
                            ))}
                        </nav>
                        <hr className="border-white/10" />
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsModalOpen(true);
                                }}
                                className="text-white hover:text-white/85 text-sm font-semibold tracking-wide text-left py-2"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsModalOpen(true);
                                }}
                                className="w-full py-3 rounded-full bg-white hover:bg-white/95 text-black font-bold text-xs tracking-wider uppercase text-center transition-smooth"
                            >
                                GET STARTED
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section Container */}
            <main className="relative z-10 flex-grow flex items-center mx-auto max-w-[1200px] w-full px-[20px] md:px-[40px] py-[60px] md:py-[100px]">
                <div className="w-full flex justify-start">
                    {/* Left Column (Content) */}
                    <div className="w-full max-w-[480px] lg:ml-[60px] flex flex-col items-start text-left">
                        {/* 1. Announcement Pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-[11px] md:text-[12px] font-medium tracking-wide mb-6 select-none animate-fade-in">
                            <span className="text-[#00e676]">⚡</span>
                            <span>Series D funding round was closed</span>
                        </div>

                        {/* 2. Headline */}
                        <h1 className="text-[36px] md:text-[56px] font-extrabold tracking-tight text-white leading-[1.08] mb-6 flex flex-col">
                            <span>Your smartest AI assistant</span>
                            <span className="text-[#00e676]">work faster and smarter</span>
                        </h1>

                        {/* 3. Subheading */}
                        <p className="text-white/65 text-[14px] md:text-[15px] leading-relaxed mb-8 max-w-[440px]">
                            Smarter sales, faster decisions: AI powered dashboard with call analytics, transcripts, summaries and more.
                        </p>

                        {/* 4. CTA Buttons Row */}
                        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-5">
                            {/* Primary Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-3 rounded-full bg-[#00e676] hover:bg-[#39ff14] text-black font-bold text-xs uppercase tracking-widest transition-smooth hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <span>GET STARTED</span>
                                <span className="text-xs">↗</span>
                            </button>
                            {/* Secondary Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group text-white hover:text-white/90 text-xs font-bold uppercase tracking-widest py-2 transition-smooth flex items-center justify-center gap-1 cursor-pointer border-b border-transparent hover:border-white/50"
                            >
                                <span>DISCOVER MORE</span>
                                <span className="transition-transform group-hover:translate-x-0.5">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer space to balance out */}
            <div className="h-12" />

            {/* Sleek, Glassmorphic Login Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="absolute inset-0 bg-[#0a0a0a]/70" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="modal-wrapper relative z-10 w-full max-w-md p-8 rounded-2xl glass-card transition-all duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-smooth cursor-pointer"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>

                        {/* Form container */}
                        <div className={`${
                            shouldShake ? 'animate-shake border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : ''
                        }`}>
                            {/* Header */}
                            <div className="flex flex-col items-center mb-8 text-center">
                                <div className="flex items-center gap-2 mb-3 select-none">
                                    <svg className="w-9 h-9 text-[#00e676] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M14 12l-4 4V8l4 4z" fill="currentColor" opacity="0.3" />
                                        <path d="M3 3l18 18M8 5h8l4 4v8M5 8v8l4 4h8" />
                                    </svg>
                                    <h1 className="text-3xl font-black tracking-tighter text-white">
                                        IDLE<span className="text-[#00e676] text-glow-emerald">AXE</span>
                                    </h1>
                                </div>
                                <span className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
                                    FinOps Swarm Command Plane
                                </span>
                            </div>

                            {/* Error Box */}
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                                    <span className="text-sm">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 font-bold">
                                        Operator Username
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={loading}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="e.g. admin"
                                        className="w-full px-4 py-3 rounded-xl glow-input font-mono text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 font-bold">
                                        Security Credentials
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            disabled={loading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl glow-input font-mono text-sm pr-12"
                                        />
                                        <button
                                            type="button"
                                            tabIndex="-1"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-3.5 bg-[#00e676] hover:bg-[#39ff14] disabled:bg-[#00e676]/40 text-black font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center font-mono text-sm uppercase tracking-wider gap-2 cursor-pointer border border-[#00e676]/20"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Authorizing Swarm...
                                        </>
                                    ) : (
                                        '🔑 Initialize Command'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
