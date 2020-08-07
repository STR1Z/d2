const d2 = {
  vec: (x, y) => new d2.Vector(x, y),
  vecGroup: (...args) => d2.VectorGroup.pack(args),
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
  Collision: {
    rectPoint: (ap, as, p) => Math.abs(ap.x - p.x) * 2 < as.x && Math.abs(ap.y - p.y) * 2 < as.y,
    shapePoint: (g, p) => {
      let inside = false;
      for (let i = 0, j = g.size - 1; i < g.size; j = i++) {
        let xi = g.vectors[i].x,
          yi = g.vectors[i].y,
          xj = g.vectors[j].x,
          yj = g.vectors[j].y;
        if (yi > p.y != yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    },
    rects: (ap, as, bp, bs) => ap.x < bp.x + bs.x && ap.x + as.x > bp.x && ap.y < bp.y + bs.y && ap.y + as.y > bp.y,
    lines: (a1, a2, b1, b2) => {
      let det = (a2.x - a1.x) * (b2.y - b1.y) - (b2.x - b1.x) * (a2.y - a1.y);
      if (det === 0) return false;
      let lambda = ((b2.y - b1.y) * (b2.x - a1.x) + (b1.x - b2.x) * (b2.y - a1.y)) / det;
      let gamma = ((a1.y - a2.y) * (b2.x - a1.x) + (a2.x - a1.x) * (b2.y - a1.y)) / det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
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
      for (let i = 1; i < group.size; i++) if (d2.Collision.lines(group.vectors[i - 1], group.vectors[i], p1, p2)) return true;
      if (d2.Collision.lines(group.vectors[group.size - 1], group.vectors[0], p1, p2)) return true;
      return false;
    },
    shapes: (target, g) => {
      for (let i = 1; i < target.size; i++) if (d2.Collision.shapeLine(g, target.vectors[i - 1], target.vectors[i])) return true;
      if (d2.Collision.shapeLine(g, target.vectors[target.size - 1], target.vectors[0])) return true;
      return false;
    },
    inGroup: (group, fn) => {},
  },
  Node: class {
    constructor() {
      this.nodes = [];
    }
    render() {}
    update() {}
    renderNodes(...args) {
      for (let n of this.nodes) n.render(...args);
    }
    updateNodes(...args) {
      for (let n of this.nodes) n.update(...args);
    }
    append(...e) {
      this.nodes.push(...e);
    }
  },
  Engine: class {
    constructor({ fps = 30, tps = 30, canvas, node, usingKeyboard = false, usingMouse = false }) {
      this.fps = fps;
      this.tps = tps;
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.node = node;
      this.ticks = this.frames = 0;
      this.removeKeyboardEventListener = () => {};
      this.removeMouseEventListener = () => {};
      if (usingKeyboard) {
        this.keyboard = {};
        const keyUpHandler = (e) => (this.keyboard[e.key.toLowerCase()] = false);
        const keyDownHandler = (e) => (this.keyboard[e.key.toLowerCase()] = true);
        addEventListener("keyup", keyUpHandler);
        addEventListener("keydown", keyDownHandler);
        this.removeKeyboardEventListener = () => {
          removeEventListener("keyup", keyUpHandler);
          removeEventListener("keydown", keyDownHandler);
        };
      }
      if (usingMouse) {
        this.mouse = {
          position: new d2.Vector(0, 0),
          button: {},
        };
        const mouseMoveHandler = (e) => {
          let rect = this.canvas.getBoundingClientRect(),
            scaleX = this.canvas.width / rect.width,
            scaleY = this.canvas.height / rect.height;
          this.mouse.position = new d2.Vector((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
        };
        const mouseDownHandler = (e) => (this.mouse.button[e.button] = true);
        const mouseUpHandler = (e) => (this.mouse.button[e.button] = false);
        addEventListener("mousedown", mouseDownHandler);
        addEventListener("mouseup", mouseUpHandler);
        addEventListener("mousemove", mouseMoveHandler);

        this.removeMouseEventListener = () => {
          removeEventListener("mousedown", mouseDownHandler);
          removeEventListener("mousemove", mouseMoveHandler);
          removeEventListener("mouseup", mouseUpHandler);
        };
      }
    }
    render() {
      this.node.render({ frames: this.frames, ctx: this.ctx, keyboard: this.keyboard, mouse: this.mouse });
      this.frames++;
    }
    update() {
      this.node.update({ ticks: this.ticks, keyboard: this.keyboard, mouse: this.mouse });
      this.ticks++;
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
    destroy() {
      this.removeKeyboardEventListener();
      this.removeMouseEventListener();
      this.stop();
    }
  },
};
