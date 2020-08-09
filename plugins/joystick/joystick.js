d2.plugins.engineProps.push((engine, config) => {
  if (config.usingJoystick) {
    let joy = document.body.appendChild(document.createElement("div"));
    joy.style = "position: fixed; bottom: 50px; left: 50px; width: 180px; height: 180px; background: rgba(0,0,0,0.1); touch-action: none; border-radius: 50%; border: white 1px solid;";
    let stick = joy.appendChild(document.createElement("div"));
    stick.style = "position: absolute; top: 30%; bottom: 30%; left: 30%; right: 30% ; background: rgba(0,0,0,0.1); border-radius: 50%; border: white 1px solid;";

    let joystickData = {
      vector: d2.vec(0, 0),
    };

    engine.renderProps.joystick = joystickData;
    engine.updateProps.joystick = joystickData;
    const updateVector = (e) => {
      let rect = joy.getBoundingClientRect();
      let px = e.touches[0].clientX - rect.left;
      let py = e.touches[0].clientY - rect.top;
      let vec = d2.vec(px, py).sub(d2.vec(90, 90));
      let length = Math.min(vec.length, 100);
      vec.divn(vec.length / (length + 1e-100) + 1e-100);
      stick.style.transform = `translate(${vec.x}px, ${vec.y}px)`;
      joystickData.vector = vec.divn(100);
    };

    joy.addEventListener("touchstart", updateVector);
    joy.addEventListener("touchmove", updateVector);
    joy.addEventListener("touchend", () => {
      stick.style.transform = "";
      joystickData.vector = d2.vec(0, 0);
    });
  }
});
