import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, GitBranch, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import IdleAxeLogo from '../../components/IdleAxeLogo';
import ParticleWave from '../../components/ParticleWave';

const features = [
    {
        icon: Shield,
        title: 'Policy-Gated Cleanup',
        text: 'Dry-run first, human approval before any destructive action. Every decision is auditable.',
    },
    {
        icon: GitBranch,
        title: 'Context-Aware Intelligence',
        text: 'Git lifecycle, owner metadata, usage signals, and idle duration inform every recommendation.',
    },
    {
        icon: FileText,
        title: 'Audit-Ready Ledger',
        text: 'PostgreSQL state ledger records every recommendation, approval, and action taken.',
    },
];

const stats = [
    { value: '$12K+', label: 'Avg. monthly savings' },
    { value: '91%', label: 'Waste detection rate' },
    { value: '<2min', label: 'Time to first insight' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function LandingPage() {
    return (
        <>
            {/* Global fixed particle canvas — sits behind everything */}
            <ParticleWave />

            <main
                className="theme-landing min-h-screen selection:bg-emerald-400/20"
                style={{ position: 'relative', zIndex: 1 }}
            >
                {/* ─── Navbar ─── */}
                <header className="landing-navbar fixed top-0 left-0 right-0 z-50">
                    <div
                        className="w-full flex items-center justify-between py-4"
                        style={{ paddingLeft: '6vw', paddingRight: '6vw' }}
                    >
                        <Link to="/" className="flex items-center">
                            <IdleAxeLogo size={30} />
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link
                                to="/login"
                                className="text-white/80 hover:text-white text-sm font-semibold transition-all"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: '#00e676',
                                    color: '#000000',
                                    borderRadius: '999px',
                                    border: 'none',
                                }}
                            >
                                Get Started
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ─── Hero ─── */}
                <section
                    className="relative flex items-center"
                    style={{
                        minHeight: '100vh',
                        paddingLeft: '7vw',
                        paddingRight: '6vw',
                        paddingTop: '100px',
                        paddingBottom: '60px',
                    }}
                >
                    {/* Radial green glow behind hero headline area */}
                    <div className="landing-hero-glow" aria-hidden="true" />

                    {/* Left-aligned hero content — ~50% width */}
                    <div
                        className="relative"
                        style={{ zIndex: 2, maxWidth: '620px', width: '100%' }}
                    >
                        {/* Dark backdrop behind text for legibility */}
                        <div className="landing-hero-backdrop">
                            {/* Badge pill */}
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                custom={0}
                                className="mb-6 inline-flex items-center gap-2.5 px-4 py-2"
                                style={{
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '0.5px solid rgba(255,255,255,0.15)',
                                    borderRadius: '999px',
                                }}
                            >
                                <CheckCircle2
                                    className="h-3.5 w-3.5"
                                    style={{ color: '#4ade80' }}
                                />
                                <span className="landing-section-label">
                                    Autonomous cloud cleanup
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                custom={1}
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                    fontWeight: 800,
                                    lineHeight: 1.08,
                                    letterSpacing: '-0.02em',
                                    textAlign: 'left',
                                }}
                            >
                                <span style={{ color: '#ffffff' }}>Kill idle cloud spend</span>
                                <br />
                                <span style={{ color: '#22c55e' }}>
                                    without trusting a bot blindly.
                                </span>
                            </motion.h1>

                            {/* Subheading */}
                            <motion.p
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                custom={2}
                                style={{
                                    marginTop: '24px',
                                    maxWidth: '540px',
                                    fontSize: '16px',
                                    lineHeight: 1.7,
                                    color: 'rgba(255,255,255,0.55)',
                                    textAlign: 'left',
                                }}
                            >
                                IdleAxe scans Cloud workloads, proves what is safe to remove,
                                routes cleanup for approval, and keeps every recommendation tied
                                to audit evidence.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                custom={3}
                                className="mt-10 flex flex-col gap-3 sm:flex-row"
                            >
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                                    style={{
                                        backgroundColor: '#00e676',
                                        color: '#000000',
                                        borderRadius: '999px',
                                        padding: '14px 28px',
                                        border: 'none',
                                    }}
                                >
                                    Get Started Free
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── Stats ─── */}
                <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    custom={0}
                    className="landing-stats-border grid grid-cols-1 sm:grid-cols-3 gap-6 py-12 mb-16"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        paddingLeft: '7vw',
                        paddingRight: '7vw',
                    }}
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p
                                className="text-3xl sm:text-4xl"
                                style={{
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                    color: '#ffffff',
                                }}
                            >
                                {stat.value}
                            </p>
                            <p
                                className="mt-1 text-sm font-medium"
                                style={{ color: 'rgba(255,255,255,0.55)' }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.section>

                {/* ─── Features ("How it Works") ─── */}
                <section
                    className="pb-20"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        paddingLeft: '7vw',
                        paddingRight: '7vw',
                    }}
                >
                    <div className="landing-features-wrapper">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            custom={0}
                            className="text-center mb-14"
                        >
                            <p className="landing-section-label" style={{ marginBottom: '12px' }}>
                                How it works
                            </p>
                            <h2
                                style={{
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: 'clamp(1.75rem, 3vw, 44px)',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Three agents. One governed flow.
                            </h2>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {features.map((feature, i) => (
                                <motion.article
                                    key={feature.title}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-40px' }}
                                    custom={i}
                                    className="landing-feature-card group"
                                >
                                    <div className="icon-container">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.text}</p>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Bottom CTA ─── */}
                <section
                    className="landing-cta-card text-center mb-12 sm:py-20"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        marginLeft: '7vw',
                        marginRight: '7vw',
                        padding: '4rem 2rem',
                    }}
                >
                    <div className="relative z-10">
                        <h2
                            style={{
                                fontWeight: 800,
                                fontSize: 'clamp(1.75rem, 4vw, 48px)',
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}
                        >
                            Stop Paying For
                            <br />
                            Idle Infrastructure.
                        </h2>
                        <p
                            className="mx-auto mt-5"
                            style={{
                                maxWidth: '480px',
                                fontSize: '15px',
                                lineHeight: 1.6,
                                color: 'rgba(255,255,255,0.7)',
                                textAlign: 'center',
                            }}
                        >
                            Transform passive cloud monitoring into autonomous cloud
                            optimization today.
                        </p>
                        <div className="mt-8">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: '#0d0d0d',
                                    color: '#ffffff',
                                    borderRadius: '999px',
                                    padding: '14px 28px',
                                    border: 'none',
                                }}
                            >
                                Start Free
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer
                    className="landing-footer py-8 text-center"
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                        © {new Date().getFullYear()} IdleAxe · Autonomous Cloud Governance
                    </p>
                </footer>
            </main>
        </>
    );
}
