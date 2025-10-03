class Visualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
  }

  draw(frequencyData) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const barWidth = (this.width / frequencyData.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      barHeight = (frequencyData[i] / 255) * this.height;

      if (barHeight > 1) {
        // Only draw if there's significant audio
        this.ctx.fillStyle = this.getRandomColor();
        this.ctx.fillRect(x, this.height - barHeight, barWidth, barHeight);
      }
      x += barWidth + 1;
    }
  }

  update(frequencyData) {
    this.draw(frequencyData);
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
