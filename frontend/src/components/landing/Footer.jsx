import React from 'react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#050816] py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M14 12l-4 4V8l4 4z" fill="currentColor" opacity="0.8" />
                                <path d="M3 3l18 18M8 5h8l4 4v8M5 8v8l4 4h8" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight">IdleAxe</span>
                    </div>
                    
                    <div className="flex gap-8 text-sm text-gray-500 mb-4 md:mb-0">
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
