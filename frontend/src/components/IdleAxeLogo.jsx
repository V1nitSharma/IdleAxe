import React from 'react';
import logoWhite from '../assets/logo_white.png';
import logoDark from '../assets/logo_dark.png';

/**
 * IdleAxe brand logo — displays the official logo image (white or dark)
 * with support for light and dark backgrounds, and icon-only mode.
 * The background of the logo matches the page background to block background wave particles.
 * The logo size is increased by 40% for better visibility.
 *
 * @param {object}  props
 * @param {number}  [props.size=32]       Icon height in px
 * @param {boolean} [props.showText=true] Show wordmark (full logo) or just the axe icon
 * @param {boolean} [props.lightBg=false] Set to true if rendering on a light background (renders dark logo)
 * @param {string}  [props.className]     Additional wrapper classes
 */
export default function IdleAxeLogo({ size = 32, showText = true, lightBg = false, className = '' }) {
    const logoImg = lightBg ? logoDark : logoWhite;
    const logoBg = lightBg ? '#ffffff' : '#050f0a';

    // Increase size by 40%
    const scaledSize = size * 1.4;

    if (!showText) {
        return (
            <span
                className={`inline-block overflow-hidden ${className}`}
                style={{
                    width: scaledSize,
                    height: scaledSize,
                    position: 'relative',
                    backgroundColor: logoBg,
                }}
            >
                <img
                    src={logoImg}
                    alt="IdleAxe Logo"
                    style={{
                        height: scaledSize * 1.6,
                        width: 'auto',
                        position: 'absolute',
                        top: '-10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        maxWidth: 'none',
                    }}
                />
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center ${className}`}>
            <img
                src={logoImg}
                alt="IdleAxe Logo"
                style={{
                    height: scaledSize * 1.3,
                    width: 'auto',
                    backgroundColor: logoBg,
                }}
                className="object-contain"
            />
        </span>
    );
}
