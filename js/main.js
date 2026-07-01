/**
 * Premium portfolio landing — dot grid, custom cursor, ambient motion
 */

const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;

if (isTouchOnly) {
  document.body.classList.add("is-touch");
}

// ─── Dot Grid Canvas ──────────────────────────────────────────

class DotGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dots = [];
    this.mouse = { x: 0.5, y: 0.5 };
    this.targetMouse = { x: 0.5, y: 0.5 };
    this.time = 0;
    this.spacing = 32;
    this.dotRadius = 1;

    this.resize();
    window.addEventListener("resize", () => this.resize());

    if (!isTouchOnly) {
      window.addEventListener("mousemove", (e) => {
        this.targetMouse.x = e.clientX / window.innerWidth;
        this.targetMouse.y = e.clientY / window.innerHeight;
      });
    }

    this.animate();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.buildGrid();
  }

  buildGrid() {
    this.dots = [];
    const cols = Math.ceil(this.width / this.spacing) + 2;
    const rows = Math.ceil(this.height / this.spacing) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.dots.push({
          baseX: col * this.spacing,
          baseY: row * this.spacing,
          x: col * this.spacing,
          y: row * this.spacing,
          phase: Math.random() * Math.PI * 2,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.3 + Math.random() * 0.7,
          driftAmp: 2 + Math.random() * 4,
          brightness: 0.15 + Math.random() * 0.25,
        });
      }
    }
  }

  animate() {
    this.time += 0.012;

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.04;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.04;

    const parallaxStrength = 22;
    const offsetX = (this.mouse.x - 0.5) * parallaxStrength;
    const offsetY = (this.mouse.y - 0.5) * parallaxStrength;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const dot of this.dots) {
      const ambient = Math.sin(this.time + dot.phase) * 0.5 + 0.5;
      const distX = dot.baseX - this.mouse.x * this.width;
      const distY = dot.baseY - this.mouse.y * this.height;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const proximity = Math.max(0, 1 - dist / 280);

      // Per-dot floating drift
      const driftT = this.time * dot.driftSpeed + dot.driftPhase;
      const floatX = Math.sin(driftT) * dot.driftAmp;
      const floatY = Math.cos(driftT * 0.8) * dot.driftAmp;

      // Slow traveling wave across the grid
      const wave =
        Math.sin(dot.baseX * 0.012 + dot.baseY * 0.008 + this.time * 0.6) * 3 +
        Math.cos(dot.baseX * 0.006 - this.time * 0.4 + dot.baseY * 0.01) * 2;

      dot.x =
        dot.baseX +
        offsetX * (dot.baseY / this.height) +
        floatX +
        Math.sin(wave) * 1.5;
      dot.y =
        dot.baseY +
        offsetY * (dot.baseX / this.width) +
        floatY +
        Math.cos(wave) * 1.5;

      const alpha = dot.brightness * (0.35 + ambient * 0.4) + proximity * 0.4;
      const radius = this.dotRadius + ambient * 0.4 + proximity * 0.9;

      const r = 255;
      const g = 255 - proximity * 40 - ambient * 10;
      const b = 255 - proximity * 20 - ambient * 5;

      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      this.ctx.fill();

      if (proximity > 0.08 || ambient > 0.75) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, radius + 4, 0, Math.PI * 2);
        const glowAlpha = proximity > 0.08 ? proximity * 0.1 : ambient * 0.04;
        this.ctx.fillStyle = `rgba(139, 92, 246, ${glowAlpha})`;
        this.ctx.fill();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ─── Custom Cursor ────────────────────────────────────────────

class CustomCursor {
  constructor(el) {
    this.el = el;
    this.core = el.querySelector(".cursor__core");
    this.ring = el.querySelector(".cursor__ring");

    this.corePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.ringPos = { x: this.corePos.x, y: this.corePos.y };
    this.target = { x: this.corePos.x, y: this.corePos.y };

    this.state = { hovering: false, text: false, pressing: false };

    window.addEventListener("pointermove", (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
      this.el.classList.remove("is-hidden");
    }, { passive: true });

    window.addEventListener("pointerdown", () => {
      this.state.pressing = true;
      this.el.classList.add("is-pressing");
    });

    window.addEventListener("pointerup", () => {
      this.state.pressing = false;
      this.el.classList.remove("is-pressing");
    });

    document.documentElement.addEventListener("pointerleave", () => {
      this.el.classList.add("is-hidden");
    });

    document.documentElement.addEventListener("pointerenter", () => {
      this.el.classList.remove("is-hidden");
    });

    this.setupHover();
    this.animate();
  }

  setupHover() {
    const interactiveSelector =
      "a, button, [data-cursor-hover], input, textarea, select, label";

    document.addEventListener("pointerover", (e) => {
      const target = e.target.closest(interactiveSelector);
      if (!target) return;

      const isText = target.matches("input, textarea");
      this.state.hovering = !isText;
      this.state.text = isText;

      this.el.classList.toggle("is-hovering", this.state.hovering);
      this.el.classList.toggle("is-text", this.state.text);
    });

    document.addEventListener("pointerout", (e) => {
      const from = e.target.closest(interactiveSelector);
      const to = e.relatedTarget?.closest?.(interactiveSelector);

      if (from && from !== to) {
        this.state.hovering = false;
        this.state.text = false;
        this.el.classList.remove("is-hovering", "is-text");
      }
    });
  }

  lerp(current, target, speed) {
    return current + (target - current) * speed;
  }

  setLayerPosition(el, pos) {
    el.style.left = `${pos.x}px`;
    el.style.top = `${pos.y}px`;
  }

  animate() {
    this.corePos.x = this.lerp(this.corePos.x, this.target.x, 0.3);
    this.corePos.y = this.lerp(this.corePos.y, this.target.y, 0.3);

    this.ringPos.x = this.lerp(this.ringPos.x, this.target.x, 0.16);
    this.ringPos.y = this.lerp(this.ringPos.y, this.target.y, 0.16);

    this.setLayerPosition(this.core, this.corePos);
    this.setLayerPosition(this.ring, this.ringPos);

    requestAnimationFrame(() => this.animate());
  }
}

// ─── Init ─────────────────────────────────────────────────────

const canvas = document.getElementById("dot-grid");
const cursor = document.getElementById("cursor");

new DotGrid(canvas);

if (!isTouchOnly) {
  new CustomCursor(cursor);
}
