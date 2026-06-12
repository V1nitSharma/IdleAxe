import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldShake, setShouldShake] = useState(false);

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

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Animated Grid Background */}
            <div className="grid-bg" />

            {/* Glowing Accent Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Glassmorphic Login Container */}
            <div className={`relative z-10 w-full max-w-md p-8 rounded-2xl glass-card transition-all duration-300 ${
                shouldShake ? 'animate-shake border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : ''
            }`}>
                {/* Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="flex items-center gap-1.5 mb-3 select-none">
                        <svg className="w-9 h-9 text-rose-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M14 12l-4 4V8l4 4z" fill="currentColor" opacity="0.3" />
                            <path d="M3 3l18 18M8 5h8l4 4v8M5 8v8l4 4h8" />
                        </svg>
                        <h1 className="text-3xl font-black tracking-tighter text-white">
                            IDLE<span className="text-rose-500 text-glow-crimson">AXE</span>
                        </h1>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
                        FinOps Swarm Command Plane
                    </span>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
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
                        className="w-full mt-2 py-3.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800/40 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all duration-300 flex items-center justify-center font-mono text-sm uppercase tracking-wider gap-2 cursor-pointer border border-rose-500/20"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Authorizing...
                            </>
                        ) : (
                            '🔑 Initialize Command'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
