import { HeroAnimation } from './utils/HeroAnimation.js';

const HERO_FRAMES = Array.from({ length: 240 }, (_, i) => `ezgif-frame-${String(i + 1).padStart(3, '0')}.png`);

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initTracking();
    initQuoteCalculator();
    initScrollAnimations();
});

function initHeroAnimation() {
    new HeroAnimation('hero-canvas', '/hero-frames', HERO_FRAMES);
}

/**
 * Real-time Tracking SystemSimulation
 */
function initTracking() {
    const trackingBtn = document.getElementById('track-btn');
    const trackingInput = document.getElementById('tracking-input');
    const resultDiv = document.getElementById('tracking-result');

    if (!trackingBtn) return;

    trackingBtn.addEventListener('click', () => {
        const id = trackingInput.value.trim();

        if (!id) {
            showResult('Please enter a valid tracking ID.', 'error');
            return;
        }

        // Simulate API call
        trackingBtn.innerText = 'Searching...';
        trackingBtn.disabled = true;

        setTimeout(() => {
            trackingBtn.innerText = 'Track Shipment';
            trackingBtn.disabled = false;

            // Mock Data
            const status = ['In Transit', 'Out for Delivery', 'Departed from Hub', 'Arrived at Destination Port'];
            const randomStatus = status[Math.floor(Math.random() * status.length)];
            const location = ['Singapore Hub', 'London Gateway', 'Dubai Logistics City', 'Mumbai Port'];
            const randomLoc = location[Math.floor(Math.random() * location.length)];

            showResult(`
                <div class="glass-card tracking-response" style="margin-top: 24px; animation: slideIn 0.5s ease-out;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                        <span style="font-weight: 800; color: var(--primary); text-transform: uppercase; font-size: 0.8rem;">Status Report</span>
                        <span style="font-family: monospace; font-weight: 700;">${id.toUpperCase()}</span>
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 800; margin-bottom: 4px;">${randomStatus}</div>
                    <div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Current Node: ${randomLoc}</div>
                    
                    <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                        <div class="progress-bar" style="height: 100%; background: linear-gradient(to right, var(--primary), var(--secondary)); width: ${Math.floor(Math.random() * 80) + 20}%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                    </div>
                </div>
            `, 'success');
        }, 1200);
    });

    function showResult(html, type) {
        resultDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
        if (type === 'error') {
            resultDiv.style.color = '#ef4444';
        } else {
            resultDiv.style.color = 'inherit';
        }
    }
}

/**
 * Transparent Quote Calculator
 */
function initQuoteCalculator() {
    const calcBtn = document.querySelector('.quote-form .btn-primary');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('.quote-form input');
        let filled = true;
        inputs.forEach(input => {
            if (!input.value) filled = false;
        });

        if (!filled) {
            alert('Please fill all fields for an accurate quote.');
            return;
        }

        const basePrice = Math.floor(Math.random() * 500) + 100;
        calcBtn.innerText = `Estimated Cost: $${basePrice}.00`;

        setTimeout(() => {
            calcBtn.innerText = 'Calculate Cost';
        }, 3000);
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .section-title, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Simple custom CSS for intersection observer
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}
