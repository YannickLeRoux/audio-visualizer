class AudioProcessor {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.microphone = null;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  async startProcessing() {
    try {
      // Resume AudioContext if it's suspended
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
        console.log("AudioContext resumed");
      }
      console.log("AudioContext state:", this.audioContext.state);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      console.log(
        "Audio analyser setup complete, frequency bins:",
        this.analyser.frequencyBinCount
      );
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }
}
