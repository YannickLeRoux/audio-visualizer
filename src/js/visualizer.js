class Visualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    // 90s retro colors
    this.neonColors = [
      "#FF00FF", // Magenta
      "#00FFFF", // Cyan
      "#00FF00", // Lime
      "#FFFF00", // Yellow
      "#FF0080", // Hot Pink
      "#8000FF", // Purple
      "#FF4000", // Orange Red
      "#00FF80", // Spring Green
    ];

    this.mode = 0;
    this.modeTimer = 0;
    this.particles = [];
    this.trails = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random(),
      });
    }
  }

  draw(frequencyData) {
    // Create retro scan lines effect
    this.drawBackground();

    // Switch visualization modes based on timer
    this.modeTimer++;
    if (this.modeTimer > 300) {
      // Change mode every 5 seconds at 60fps
      this.mode = (this.mode + 1) % 5;
      this.modeTimer = 0;
    }

    switch (this.mode) {
      case 0:
        this.drawRadialBars(frequencyData);
        break;
      case 1:
        this.drawOscilloscope(frequencyData);
        break;
      case 2:
        this.drawParticleSystem(frequencyData);
        break;
      case 3:
        this.drawGeometricShapes(frequencyData);
        break;
      case 4:
        this.drawTunnelEffect(frequencyData);
        break;
    }

    this.drawGrid();
    this.drawModeText();
  }

  drawBackground() {
    // Create trailing effect instead of clearing
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Add scan lines
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    this.ctx.lineWidth = 1;
    for (let y = 0; y < this.height; y += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  drawRadialBars(frequencyData) {
    const bars = 64;
    const angleStep = (Math.PI * 2) / bars;

    for (let i = 0; i < bars; i++) {
      const amplitude = frequencyData[i * 4] / 255;
      const angle = i * angleStep;
      const length = amplitude * 200;

      const x1 = this.centerX + Math.cos(angle) * 100;
      const y1 = this.centerY + Math.sin(angle) * 100;
      const x2 = this.centerX + Math.cos(angle) * (100 + length);
      const y2 = this.centerY + Math.sin(angle) * (100 + length);

      // Create gradient
      const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, this.neonColors[i % this.neonColors.length]);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 3;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = this.neonColors[i % this.neonColors.length];

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  }

  drawOscilloscope(frequencyData) {
    this.ctx.strokeStyle = "#00FFFF";
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = "#00FFFF";

    this.ctx.beginPath();
    for (let i = 0; i < frequencyData.length; i++) {
      const x = (i / frequencyData.length) * this.width;
      const y = this.centerY + (frequencyData[i] - 128) * 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();

    // Add multiple waveforms with different colors
    const colors = ["#FF00FF", "#00FF00", "#FFFF00"];
    for (let wave = 0; wave < 3; wave++) {
      this.ctx.strokeStyle = colors[wave];
      this.ctx.shadowColor = colors[wave];
      this.ctx.beginPath();

      for (let i = 0; i < frequencyData.length; i += 2) {
        const x = (i / frequencyData.length) * this.width;
        const y =
          this.centerY +
          (frequencyData[i] - 128) * (1 + wave * 0.5) +
          wave * 50;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
  }

  drawParticleSystem(frequencyData) {
    const avgFreq =
      frequencyData.reduce((a, b) => a + b) / frequencyData.length;

    // Update particles
    this.particles.forEach((particle) => {
      particle.x += particle.vx * (1 + avgFreq / 50);
      particle.y += particle.vy * (1 + avgFreq / 50);
      particle.life -= 0.01;

      // Wrap around screen
      if (particle.x < 0) particle.x = this.width;
      if (particle.x > this.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.height;
      if (particle.y > this.height) particle.y = 0;

      // Reset if dead
      if (particle.life <= 0) {
        particle.life = 1;
        particle.x = Math.random() * this.width;
        particle.y = Math.random() * this.height;
      }
    });

    // Draw particles
    this.particles.forEach((particle, index) => {
      const size = (avgFreq / 255) * 10 + 2;
      const color = this.neonColors[index % this.neonColors.length];

      this.ctx.fillStyle = color;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = color;

      this.ctx.beginPath();
      this.ctx.arc(
        particle.x,
        particle.y,
        size * particle.life,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      // Connect nearby particles
      this.particles.forEach((other) => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 && avgFreq > 50) {
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * particle.life})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.stroke();
        }
      });
    });
  }

  drawGeometricShapes(frequencyData) {
    const shapes = 8;
    for (let i = 0; i < shapes; i++) {
      const amplitude = frequencyData[i * 32] / 255;
      const angle = (Date.now() / 1000 + i) * 0.5;
      const size = 50 + amplitude * 100;

      const x = this.centerX + Math.cos(angle) * 150;
      const y = this.centerY + Math.sin(angle) * 150;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(angle);

      this.ctx.strokeStyle = this.neonColors[i % this.neonColors.length];
      this.ctx.lineWidth = 2;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = this.neonColors[i % this.neonColors.length];

      // Draw rotating geometric shapes
      this.ctx.beginPath();
      const sides = 3 + (i % 6);
      for (let j = 0; j <= sides; j++) {
        const shapeAngle = (j / sides) * Math.PI * 2;
        const sx = Math.cos(shapeAngle) * size;
        const sy = Math.sin(shapeAngle) * size;

        if (j === 0) {
          this.ctx.moveTo(sx, sy);
        } else {
          this.ctx.lineTo(sx, sy);
        }
      }
      this.ctx.stroke();

      this.ctx.restore();
    }
  }

  drawTunnelEffect(frequencyData) {
    const rings = 20;
    const maxRadius = Math.min(this.width, this.height) / 2;

    for (let i = 0; i < rings; i++) {
      const radius = (maxRadius / rings) * (i + 1);
      const amplitude = frequencyData[i * 10] / 255;
      const thickness = 2 + amplitude * 10;

      this.ctx.strokeStyle = this.neonColors[i % this.neonColors.length];
      this.ctx.lineWidth = thickness;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = this.neonColors[i % this.neonColors.length];

      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawGrid() {
    this.ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < this.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  drawModeText() {
    const modes = [
      "RADIAL BARS",
      "OSCILLOSCOPE",
      "PARTICLES",
      "GEOMETRY",
      "TUNNEL",
    ];
    this.ctx.fillStyle = "#00FFFF";
    this.ctx.font = 'bold 20px "Courier New", monospace';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = "#00FFFF";
    this.ctx.fillText(`MODE: ${modes[this.mode]}`, 20, 40);
  }

  update(frequencyData) {
    this.draw(frequencyData);
  }
}
