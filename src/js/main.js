let audioProcessor;
let visualizer;
let frameCount = 0;
let isRunning = false;

async function startVisualization() {
  try {
    console.log("Starting audio visualizer...");

    // Get canvas element and set up visualizer
    const canvas = document.getElementById("visualizer");
    if (!canvas) {
      console.error("Canvas element not found!");
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

    visualizer = new Visualizer(canvas);
    audioProcessor = new AudioProcessor();

    await audioProcessor.startProcessing();
    console.log("Audio processing started");

    // Hide start screen and show canvas
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";

    isRunning = true;
    animate();
  } catch (error) {
    console.error("Error accessing microphone:", error);
    alert("Error accessing microphone: " + error.message);
  }
}

function animate() {
  if (!isRunning) return;

  requestAnimationFrame(animate);
  const frequencyData = audioProcessor.getFrequencyData();

  // Debug: Check if we're getting audio data every 60 frames (about once per second)
  frameCount++;
  if (frameCount % 60 === 0) {
    const sum = frequencyData.reduce((a, b) => a + b, 0);
    const max = Math.max(...frequencyData);
    const avg = sum / frequencyData.length;
    console.log(
      `Frame ${frameCount}: Sum=${sum}, Max=${max}, Avg=${avg.toFixed(
        2
      )}, Length=${frequencyData.length}`
    );

    // Show first few values
    console.log("First 10 values:", Array.from(frequencyData.slice(0, 10)));
  }

  visualizer.update(frequencyData);
}

window.onload = function () {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", startVisualization);
};
