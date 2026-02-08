/**
 * HeroAnimation handles frame-by-frame animation using a canvas.
 */
export class HeroAnimation {
    constructor(canvasId, framePath, frames) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.framePath = framePath;
        this.frameNames = frames;
        this.frameCount = frames.length;
        this.frameImages = [];
        this.currentFrame = 0;
        this.fps = 30;
        this.lastTime = 0;
        this.interval = 1000 / this.fps;
        this.isLoaded = false;
        this.bufferReady = false;

        // Load first frame immediately for instant visual
        this.loadFirstFrame();
        this.init();
    }

    async loadFirstFrame() {
        const firstFrame = new Image();
        firstFrame.src = `${this.framePath}/${this.frameNames[0]}`;
        firstFrame.onload = () => {
            this.frameImages[0] = firstFrame;
            this.resize(); // Initial draw
        };
    }

    async init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loadFrames(); // Start background loading
        requestAnimationFrame((time) => this.animate(time));
    }

    async loadFrames() {
        const loadPromises = this.frameNames.map((name, index) => {
            if (index === 0) return Promise.resolve(); // Already loading
            return new Promise((resolve) => {
                const img = new Image();
                img.src = `${this.framePath}/${name}`;
                img.onload = () => {
                    this.frameImages[index] = img;
                    if (index === 5) this.bufferReady = true;
                    resolve();
                };
            });
        });

        await Promise.all(loadPromises);
        this.isLoaded = true;
    }

    resize() {
        if (!this.canvas.parentElement) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();

        // Use device pixel ratio for sharpness
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Redraw current frame on resize
        this.drawFrame();
    }

    animate(time) {
        if (!this.frameImages[0] && !this.bufferReady) {
            requestAnimationFrame((t) => this.animate(t));
            return;
        }

        const delta = time - this.lastTime;

        if (delta >= this.interval) {
            if (this.currentFrame < this.frameCount - 1) {
                this.currentFrame++;
                this.drawFrame();
                this.lastTime = time - (delta % this.interval);
            } else {
                // Stop animation loop at last frame
                return;
            }
        }

        requestAnimationFrame((t) => this.animate(t));
    }

    drawFrame() {
        if (!this.isLoaded || !this.frameImages[this.currentFrame]) return;

        const img = this.frameImages[this.currentFrame];
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);

        // Calculate aspect ratio "cover" fit
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            // Image is wider than canvas - match height and crop sides
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller than canvas - match width and crop top/bottom
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }

        // Using drawImage to overwrite - no clearRect needed if it's cover
        this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
}
