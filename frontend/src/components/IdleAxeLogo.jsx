import React from 'react';

/**
 * IdleAxe brand logo — axe icon traced from the official logo
 * with split-tone "IDLE" (dark) + "AXE" (emerald) wordmark.
 *
 * @param {object}  props
 * @param {number}  [props.size=32]       Icon height in px
 * @param {boolean} [props.showText=true] Show wordmark beside icon
 * @param {string}  [props.className]     Additional wrapper classes
 */
export default function IdleAxeLogo({ size = 32, showText = true, className = '' }) {
    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            {/* Axe icon SVG */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="IdleAxe logo"
            >
                {/* Axe head */}
                <path
                    d="M30 18C30 18 18 30 16 50C14 70 26 82 26 82L52 56L30 18Z"
                    fill="#0f172a"
                />
                {/* Axe blade curve */}
                <path
                    d="M26 82C26 82 14 70 16 50C18 30 30 18 30 18L22 12C22 12 6 28 4 52C2 76 18 92 18 92L26 82Z"
                    fill="#1e293b"
                />
                {/* Handle */}
                <path
                    d="M52 56L100 108"
                    stroke="#0f172a"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                {/* Handle detail */}
                <path
                    d="M48 52L96 104"
                    stroke="#1e293b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.4"
                />
                {/* Axe top edge highlight */}
                <path
                    d="M30 18L52 56"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.7"
                />
                {/* Blade slash accent */}
                <path
                    d="M58 48L78 20"
                    stroke="#059669"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <path
                    d="M62 52L86 16"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>

            {/* Wordmark */}
            {showText && (
                <span className="text-lg font-black tracking-tight leading-none select-none">
                    <span className="text-gray-900">IDLE</span>
                    <span className="text-emerald-600">AXE</span>
                </span>
            )}
        </span>
    );
}
