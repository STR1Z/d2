d2.plugins.engine.push((engine, config) => {
  if (!config.usingFullcanvas) return;
  let canvas = document.body.appendChild(document.createElement("canvas"));
  canvas.style = "position: fixed; top: 0; left: 0;";
  canvas.id = "d2-fullcanvas-canvas";
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  addEventListener("resize", resizeCanvas);
  engine.canvas = canvas;
});
