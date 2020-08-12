d2.Audiolize = class {
  init(audio, size) {
    this.audio = audio;
    this.context = new AudioContext();
    this.src = this.context.createMediaElementSource(this.audio);
    this.analyzer = this.context.createAnalyser();
    this.src.connect(this.analyzer);
    this.analyzer.connect(this.context.destination);
    this.analyzer.fftSize = size;
    this.size = this.analyzer.frequencyBinCount;
    this.data = new Uint8Array(this.size);
    this.audio.play();
  }
  *[Symbol.iterator]() {
    for (let i of this.current) yield i;
  }
  get current() {
    this.analyzer.getByteFrequencyData(this.data);
    return this.data;
  }
  get average() {
    let sum = 0;
    for (let i of this.data) sum += i;
    return sum / this.size;
  }
};
