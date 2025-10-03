function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomShape() {
  const shapes = ["circle", "square", "triangle"];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function getRandomSize(min, max) {
  return Math.random() * (max - min) + min;
}
