const d2 = {
  Vector: class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    point(a) {
      let length = this.length;
      this.x = length * Math.cos(a);
      this.y = length * Math.sin(a);
      return this;
    }
    translate(v) {
      return this.add(v);
    }
    rotate(v) {
      return this.point(v + this.angle);
    }
    scale(v) {
      return v instanceof this.constructor ? this.mul(v) : this.muln(v);
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
    mul(v) {
      this.x *= v.x;
      this.y *= v.y;
      return this;
    }
    div(v) {
      this.x /= v.x;
      this.y /= v.y;
      return this;
    }
    muln(n) {
      this.x *= n;
      this.y *= n;
      return this;
    }
    divn(n) {
      this.x /= n;
      this.y /= n;
      return this;
    }
    plus(v) {
      return new this.constructor(this.x + v.x, this.y + v.y);
    }
    minus(v) {
      return new this.constructor(this.x - v.x, this.y - v.y);
    }
    times(v) {
      return new this.constructor(this.x * v.x, this.y * v.y);
    }
    timesn(v) {
      return new this.constructor(this.x * v, this.y * v);
    }
    over(v) {
      return new this.constructor(this.x / v.x, this.y / v.y);
    }
    overn(v) {
      return new this.constructor(this.x / v, this.y / v);
    }

    *[Symbol.iterator]() {
      yield this.x;
      yield this.y;
    }
    get length() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    get array() {
      return [this.x, this.y];
    }
    get angle() {
      return Math.atan2(this.y, this.x);
    }
    get copy() {
      return new this.constructor(this.x, this.y);
    }
  },
  VectorGroup: class {
    constructor(...vectors) {
      this.vectors = vectors;
    }
    static pack(a) {
      return new this(...a.map((v) => new d2.Vector(v[0], v[1])));
    }
    each(fn) {
      this.vectors.forEach(fn);
      return this;
    }
    link(fn) {
      for (let i = 1; i < this.size; i++) fn(this.vectors[i - 1], this.vectors[i]);
      fn(this.vectors[this.size - 1], this.vectors[0]);
    }
    add(g) {
      return g instanceof this.constructor ? this.each((v, i) => v.add(g.vectors[i])) : this.each((v) => v.add(g));
    }
    sub(g) {
      return g instanceof this.constructor ? this.each((v, i) => v.sub(g.vectors[i])) : this.each((v) => v.sub(g));
    }
    mul(g) {
      return g instanceof this.constructor ? this.each((v, i) => v.mul(g.vectors[i])) : this.each((v) => v.mul(g));
    }
    div(g) {
      return g instanceof this.constructor ? this.each((v, i) => v.div(g.vectors[i])) : this.each((v) => v.div(g));
    }
    muln(g) {
      return g instanceof this.constructor ? this.each((v, i) => v.muln(g.vectors[i])) : this.each((v) => v.muln(g));
    }
    divn(g) {
      return g instanceof this.constructor ? this.each((v, i) => v.divn(g.vectors[i])) : this.each((v) => v.divn(g));
    }
    plus(g) {
      return this.copy.add(g);
    }
    minus(g) {
      return this.copy.sub(g);
    }
    times(g) {
      return this.copy.mul(g);
    }
    over(g) {
      return this.copy.over(g);
    }
    timesn(g) {
      return this.copy.muln(g);
    }
    overn(g) {
      return this.copy.divn(g);
    }
    translate(v) {
      return this.each((e) => e.add(v));
    }
    rotate(a) {
      return this.each((v) => v.rotate(a));
    }
    scale(v) {
      return typeof v == "number" ? this.each((e) => e.muln(v)) : this.each((e) => e.mul(v));
    }
    get copy() {
      return new this.constructor(...this.vectors.map((v) => v.copy));
    }
    get sum() {
      return new GETL.Vector(
        ...this.vectors.reduce(
          (acc, v) => {
            acc[0] += v.x;
            acc[1] += v.y;
          },
          [0, 0]
        )
      );
    }
    *[Symbol.iterator]() {
      for (let v of this.vectors) yield v.array;
    }
    get array() {
      return this.vectors.map((v) => [v.x, v.y]);
    }
    get size() {
      return this.vectors.length;
    }
    get average() {
      this.sum.ndiv(this.size);
    }
  },
  Node: class {
    constructor() {
      this.nodes = [];
      for (let fn of d2.plugins.node) fn(this, config);
    }
    render() {}
    update() {}
    renderNodes(...args) {
      for (let n of this.nodes) n.render(...args);
    }
    updateNodes(...args) {
      for (let n of this.nodes) n.update(...args);
    }
    append(...nodes) {
      nodes.forEach((n) => (n.parent = this));
      this.nodes.push(...nodes);
    }
  },
  Engine: class {
    constructor(config) {
      let { fps = 30, tps = 30, canvas, node, usingKeyboard = false, usingMouse = false, usingTouch = false } = config;
      this.fps = fps;
      this.tps = tps;
      this.canvas = canvas;
      this.node = node;
      this.ticks = this.frames = 0;
      for (let fn of d2.plugins.engine) fn(this, config);

      this.ctx = this.canvas.getContext("2d");

      const getPositionOnCanvas = (x, y) => {
        let rect = this.canvas.getBoundingClientRect(),
          scaleX = this.canvas.width / rect.width,
          scaleY = this.canvas.height / rect.height;
        let px = Math.max(0, Math.min((x - rect.left) * scaleX, this.canvas.width));
        let py = Math.max(0, Math.min((y - rect.top) * scaleY, this.canvas.height));
        return new d2.Vector(px, py);
      };

      if (usingKeyboard) {
        this.keyboard = {
          events: {},
        };
        addEventListener("keyup", (e) => {
          this.keyboard[e.key.toLowerCase()] = false;
          this.keyboard.events.up = e;
        });
        addEventListener("keydown", (e) => {
          this.keyboard[e.key.toLowerCase()] = true;
          this.keyboard.events.down = e;
        });
      }
      if (usingMouse || usingTouch)
        this.pointer = {
          position: new d2.Vector(0, 0),
          down: false,
        };
      if (usingMouse) {
        this.mouse = {
          position: new d2.Vector(0, 0),
          button: {},
          events: {},
        };
        this.canvas.addEventListener("mousemove", (e) => {
          this.mouse.position = getPositionOnCanvas(e.clientX, e.clientY);
          this.pointer.position = this.mouse.position;
          this.mouse.events.move = e;
        });
        this.canvas.addEventListener("mousedown", (e) => {
          this.mouse.position = getPositionOnCanvas(e.clientX, e.clientY);
          this.pointer.position = this.mouse.position;
          this.mouse.button[e.button] = true;
          this.pointer.down = this.mouse.button[0];
          this.mouse.events.down = e;
        });
        this.canvas.addEventListener("mouseup", (e) => {
          this.mouse.button[e.button] = false;
          this.pointer.down = this.mouse.button[0];
          this.mouse.events.up = e;
        });
      }
      if (usingTouch) {
        this.canvas.style.touchAction = "none";
        this.touch = {
          position: new d2.Vector(0, 0),
          down: false,
          events: {},
        };
        this.canvas.addEventListener("touchmove", (e) => {
          this.touch.position = getPositionOnCanvas(e.touches[0].clientX, e.touches[0].clientY);
          this.pointer.position = this.touch.position;
          this.touch.events.move = e;
        });
        this.canvas.addEventListener("touchstart", (e) => {
          this.touch.position = getPositionOnCanvas(e.touches[0].clientX, e.touches[0].clientY);
          this.pointer.position = this.touch.position;
          this.touch.down = this.pointer.down = true;
          this.touch.events.start = e;
        });
        this.canvas.addEventListener("touchend", (e) => {
          this.touch.down = this.pointer.down = false;
          this.touch.events.end = e;
        });
      }
      this.renderProps = { frames: this.frames++, ctx: this.ctx, keyboard: this.keyboard, mouse: this.mouse, pointer: this.pointer, assets: d2.assets };
      this.updateProps = { ticks: this.ticks++, keyboard: this.keyboard, mouse: this.mouse, pointer: this.pointer, assets: d2.assets };

      for (let fn of d2.plugins.engineProps) fn(this, config);
    }
    render() {
      this.node.render(this.renderProps);
    }
    update() {
      this.node.update(this.updateProps);
    }
    run() {
      this.update();
      this.render();
      this.updater = setInterval(() => this.update(), 1000 / this.tps);
      this.renderer = setInterval(() => this.render(), 1000 / this.fps);
    }
    stop() {
      clearInterval(this.renderer);
      clearInterval(this.updater);
      this.renderer = this.updater = null;
    }
  },
  vec: (x, y) => new d2.Vector(x, y),
  vecGroup: (...args) => d2.VectorGroup.pack(args),
  collision: {
    rectPoint: (ap, as, p) => Math.abs(ap.x - p.x) * 2 < as.x && Math.abs(ap.y - p.y) * 2 < as.y,
    circlePoint: (cp, cr, p) => Math.abs(cp.minus(p)) < cr,
    shapePoint: (s, p) => {
      let inside = false;
      for (let i = 0, j = s.size - 1; i < s.size; j = i++) {
        let xi = s.vectors[i].x,
          yi = s.vectors[i].y,
          xj = s.vectors[j].x,
          yj = s.vectors[j].y;
        if (yi > p.y != yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    },
    rects: (ap, as, bp, bs) => ap.x < bp.x + bs.x && ap.x + as.x > bp.x && ap.y < bp.y + bs.y && ap.y + as.y > bp.y,
    circles: (ap, ar, bp, br) => Math.abs(ap.minus(bp) < ar + br),
    lines: (a1, a2, b1, b2) => {
      let det = (a2.x - a1.x) * (b2.y - b1.y) - (b2.x - b1.x) * (a2.y - a1.y);
      if (det === 0) return false;
      let lambda = ((b2.y - b1.y) * (b2.x - a1.x) + (b1.x - b2.x) * (b2.y - a1.y)) / det;
      let gamma = ((a1.y - a2.y) * (b2.x - a1.x) + (a2.x - a1.x) * (b2.y - a1.y)) / det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    },
    shapes: (a, b) => {
      for (let i = 1; i < a.size; i++) if (d2.collision.shapeLine(b, a.vectors[i - 1], a.vectors[i])) return true;
      if (d2.collision.shapeLine(b, a.vectors[a.size - 1], a.vectors[0])) return true;
      return false;
    },
    linesIntersection: (a1, a2, b1, b2) => {
      let a_m = (a2.y - a1.y) / (a2.x - a1.x) + 1e-100;
      let a_b = a1.y - a_m * a1.x;
      let b_m = (b2.y - b1.y) / (b2.x - b1.x) + 1e-100;
      let b_b = b1.y - b_m * b1.x;
      if (a_m == b_m) return a_b == b_b;
      let x = (b_b - a_b) / (a_m - b_m);
      if (Math.min(Math.min(a1.x, a2.x), Math.min(b1.x, b2.x)) < x && x < Math.max(Math.max(a1.x, a2.x), Math.max(b1.x, b2.x))) return new d2.Vector(x, a_m * x + a_b);
      return false;
    },
    shapeLine: (group, p1, p2) => {
      for (let i = 1; i < group.size; i++) if (d2.collision.lines(group.vectors[i - 1], group.vectors[i], p1, p2)) return true;
      if (d2.collision.lines(group.vectors[group.size - 1], group.vectors[0], p1, p2)) return true;
      return false;
    },
    circleLine: (cp, cr, l1, l2) => {
      var dist;
      const v1x = l2.x - l1.x;
      const v1y = l2.y - l1.y;
      const v2x = cp.x - l1.x;
      const v2y = cp.y - l1.y;
      const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);
      if (u >= 0 && u <= 1) dist = (l1.x + v1x * u - cp.x) ** 2 + (l1.y + v1y * u - cp.y) ** 2;
      else dist = u < 0 ? (l1.x - cp.x) ** 2 + (l1.y - cp.y) ** 2 : (l2.x - cp.x) ** 2 + (l2.y - cp.y) ** 2;
      return dist < cr * cr;
    },
    shapeCircle: (s, cp, cr) => {
      for (let i = 1; i < s.size; i++) if (d2.collision.circleLine(s.vectors[i - 1], s.vectors[i], cp, cr)) return true;
      if (d2.collision.circleLine(s.vectors[a.size - 1], s.vectors[0], cp, cr)) return true;
      return false;
    },
    betweenNodes: (nodes, fn) => {
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) fn(nodes[i], nodes[j]);
    },
  },
  preload: (data, fn = () => {}) => {
    return new Promise((resolve) => {
      let pending = 0;
      let type_event = { image: "load", audio: "canplaythrough", video: "canplaythrough" };
      for (let type in type_event)
        if (data[type])
          for (let name in data[type]) {
            pending++;
            let e = document.createElement(type);
            e.src = data[type][name];
            d2.assets[type][name] = e;
            e.addEventListener(type_event[type], () => {
              fn(pending);
              if (--pending == 0) resolve();
            });
          }
    });
  },
  assets: {
    audio: {},
    image: {},
    video: {},
  },
  plugins: {
    engine: [],
    engineProps: [],
    node: [],
  },
};
d2.Node2 = d2.Node;
addEventListener("load", () => {
  if (!d2.NO_WATERMARK) console.log("%cUsing D2 library\n%cversion 0.0.2\nhttps://github.com/STR1Z/d2", "font-size: 16px; ", "font-size: 10px; text");
});
