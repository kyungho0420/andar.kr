/**
 * ANDAR - Aroma & Spa
 */
const siteConfig = {
    meta: {
        framework: 'V4',
        type: 'page',
        mode: 'demo',
        lang: 'ko',
        theme: true,
        scroll_smooth: true
    },
    api: {
        server: 'damso',
        turnstile: '0x4AAAAAABrG4DQP8tkp1_TI',
        redirect: '../'
    },
    canvas: {
        target: '#home',
        effect: 'fireflyEffect',
        overlay: 'dotted',

        image_type: 'cover',
        image_count: 3,
        image_slide: 10,
        image_path: './section/home/',
        image_format: 'jpg'
    },
    buttons: [
        { name: 'Profile', icon: 'mail', url: '#profile' },
        { name: 'Location', icon: 'location_on', url: '#location' },
        { name: 'Reservation', icon: 'calendar_month', url: './request/' }
    ]
};

// [Tier 3] Custom Effect: Fireflies (Calm & Natural)
window.fireflyEffect = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    flies: [],
    animationFrameId: null,

    init(container) {
        this.container = container;
        // V4 Canvas Plug creates .damso-canvas__effect
        this.canvas = container.querySelector('.damso-canvas__effect');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'damso-canvas__effect';
            container.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');

        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);

        window.addEventListener('resize', this.resize);
        this.resize();
        this.createFlies();
        this.animate();
    },

    resize() {
        if (!this.container) return;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    createFlies() {
        const count = 50;
        this.flies = [];
        for (let i = 0; i < count; i++) {
            this.flies.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                alpha: Math.random(),
                fading: Math.random() > 0.5
            });
        }
    },

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.flies.forEach(fly => {
            fly.x += fly.speedX;
            fly.y += fly.speedY;

            // Bounce off edges gently
            if (fly.x < 0 || fly.x > this.width) fly.speedX *= -1;
            if (fly.y < 0 || fly.y > this.height) fly.speedY *= -1;

            // Twinkle effect
            if (fly.fading) {
                fly.alpha -= 0.01;
                if (fly.alpha <= 0.2) fly.fading = false;
            } else {
                fly.alpha += 0.01;
                if (fly.alpha >= 0.8) fly.fading = true;
            }

            this.ctx.beginPath();
            this.ctx.arc(fly.x, fly.y, fly.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 200, ${fly.alpha})`; // Warm soft yellow
            this.ctx.fill();
        });

        this.animationFrameId = requestAnimationFrame(this.animate);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.V4) {
        window.V4.init(siteConfig).then(app => {
            app.registerEffect('fireflyEffect', window.fireflyEffect);
        });
    }
});