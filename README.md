# d2

###### Documentation v0.0.1

Some random lightweight Game Engine Tools Library that helps to create some casual games for school projects or whatever.

Currently, this library probably has limited support for mobile devives, it might partially work or not at all.

---

### Classes

- Vector
- VectorGroup
- Node
- Engine

### Utility

- colision
- vec
- vecGroup
- preload

---

### Vector

Class responsible for 2D vector manipulation.

```javascript
//create
let myVector = new d2.Vector(10, 10);
//modify
myVector.add(new d2.Vector(10, 10));
//check is modified
console.log(myVector.x, myVector.y); // 20, 20
//create new vector from sum of two vectors
let otherVector = myVector.plus(new d2.Vector(15, 15));
//myVector will not get modified. The same can be achieved with...
let otherVector2 = myVector.copy.add(new d2.Vector(15, 15));
```

- chaining methods that returns a NEW vector is not recommended.

##### Properties

| Name   | Type   | Description                        | Constraint |
| ------ | ------ | ---------------------------------- | ---------- |
| x      | Number | Stores the X value                 | None       |
| y      | Number | Stores the Y value                 | None       |
| length | Number | Returns the length/magnitude       | Readonly   |
| array  | Number | Returns in array format `[x,y]`    | Readonly   |
| angle  | Number | Return the direction/angle         | Readonly   |
| copy   | Vector | Return a deep copy of the instance | Readonly   |

##### Methods (`A.method(B)` returns `A`)

| Name      | Description                         | Parameter            |
| --------- | ----------------------------------- | -------------------- |
| point     | Changes the direction of the vector | `Number`             |
| translate | Translates by a vector              | `Vector`             |
| rotate    | Rotates by a angle                  | `Number`             |
| scale     | Scales by a number or vector        | `Number` or `Vector` |
| add       | Increases by a vector               | `Vector`             |
| sub       | Decreases by a vector               | `Vector`             |
| mul       | Multiplies by a vector              | `Vector`             |
| div       | Divides by a vector                 | `Vector`             |
| muln      | Multiplies `x` and `y` by number    | `Number`             |
| divn      | Devides `x` and `y` by number       | `Number`             |

##### Methods (`A.method(B)` returns `C`)

| Name   | Description                                            | Parameter |
| ------ | ------------------------------------------------------ | --------- |
| plus   | Sum of two vectors                                     | `Vector`  |
| minus  | Difference of two vectors                              | `Vector`  |
| times  | Product of two vectors                                 | `Vector`  |
| over   | Quotient of two vectors                                | `Vector`  |
| timesn | Returns `new Vector(this.x * number, this.y * number)` | `Vector`  |
| overn  | Returns `new Vector(this.x / number, this.y / number)` | `Vector`  |

### VectorGroup

A wrapper that contains multiple vectors and **have most of the methods from the Vector class** that can be aplied to a group of vectors such as:

- translate
- rotate
- scale
- add
- sub
- mul
- muln
- divn
- plus
- minus
- times
- over
- timesn
- overn

##### Properties

| Name    | Type            | Description                            | Constraint |
| ------- | --------------- | -------------------------------------- | ---------- |
| vectors | `Array<Vector>` | Stores the vectors                     | None       |
| size    | `Number`        | Returns the amount of vectors          | Readonly   |
| array   | `Number`        | Returns in array format `[[x,y]...]`   | Readonly   |
| sum     | `Vector`        | Return a vector representing the sum   | Readonly   |
| average | `Vector`        | Returns the average of all the vectors | Readonly   |

##### Static methods (`Vector.method(args)` returns `new Vector`)

| Name | Description                    | Parameter      |
| ---- | ------------------------------ | -------------- |
| pack | Returns a vector from a matrix | `Array<[x,y]>` |

##### Iteration methods

| Name | Description                                                | Parameter                    |
| ---- | ---------------------------------------------------------- | ---------------------------- |
| each | vectorGroup.vectors.forEach shorthand                      | `function(vector, index)`    |
| link | Iterate over all the adjacent pairs if arranged circularly | `function(vectorA, vectorB)` |

### Node

An empty shell to create Game Objects.

##### Properties

| Name  | Type          | Description             | Constraint |
| ----- | ------------- | ----------------------- | ---------- |
| nodes | `Array<Node>` | Stores all the subnodes | None       |

##### Methods

| Name        | Description                   | Parameter                    |
| ----------- | ----------------------------- | ---------------------------- |
| render      | For rendering                 | `Object` renderProps         |
| update      | For updating                  | `Object` updateProps         |
| renderNodes | For rendering the subnodes    | `Object` renderProps         |
| updateNodes | For updating the subnodes     | `Object` updateProps         |
| append      | Pushes a Node to the subnodes | `...Array<Node>` ...subnodes |

```typescript
//typescript to display the property types.
interface renderProps {
  frames : Number, //Amount of frames rendered.
  ctx : CanvasRenderingContext2D, //Used to draw on the canvas.
  keyboard: { //Used to get keyboard data.
    String key : Boolean, //is key down ?
    event: {
      up: KeyupEvent,
      down: KeydownEvent
    }
  },
  mouse: {
    position : Vector, //Position of the mouse.
    button : {
      0 : Boolean, // is mouse primary button down ?
      1 : Boolean, // is mouse middle button down ?
      2 : Boolean, // is mouse secondary button down ?
    },
    event: {
      up: MouseupEvent,
      down: MousedownEvent,
      move: MousemoveEvent
    }
  },
  touch: {
    position: Vector, //Position of the last touch.
    down: Boolean, // is user touching the screen ?
    event: {
      move: TouchmoveEvent,
      start: TouchstartEvent,
      end: TouchendEvent
    }
  }
}

interface updateProps {
  ticks : Number, //Amount of updates.
  keyboard: { //Used to get keyboard data.
    String key : Boolean, //is key down ?
    event: {
      up: KeyupEvent,
      down: KeydownEvent
    }
  },
  mouse: {
    position : Vector, //Position of the mouse.
    button : {
      0 : Boolean, // is mouse primary button down ?
      1 : Boolean, // is mouse middle button down ?
      2 : Boolean, // is mouse secondary button down ?
    },
    event: {
      up: MouseupEvent,
      down: MousedownEvent,
      move: MousemoveEvent
    }
  },
  touch: {
    position: Vector, //Position of the last touch.
    down: Boolean, // is user touching the screen ?
    event: {
      move: TouchmoveEvent,
      start: TouchstartEvent,
      end: TouchendEvent
    }
  }
}
```

### Engine

Class responsible of updating, rendering and channeling user inputs.

```javascript
let config = {
  fps: 60,
  tps: 60,
  canvas: document.getElementById("myCanvas"),
  node: myScene,
  usingKeyboard: true,
  usingMouse: true,
  usingTouch: true,
};
let engine = new d2.Engine(config);
engine.run();
// pause the engine
engine.stop();
//destroy the engine : removes all event listeners
engine.destroy();
```

##### Config

| Name          | Description                | Default     | Type          |
| ------------- | -------------------------- | ----------- | ------------- |
| fps           | Frames per second          | `30`        | `Number`      |
| tps           | Ticks per second           | `30`        | `Number`      |
| canvas        | Dom canvas element         | `undefined` | `HTMLElement` |
| usingKeyboard | Listen for keyboard events | `false`     | `Boolean`     |
| usingMouse    | Listen for mouse events    | `false`     | `Boolean`     |
| usingTouch    | Listen for touch events    | `false`     | `Boolean`     |

---

### Collision

Simple collision detection utility. Very unoptimised for large quantities of objects.
Name | Description | Return type | Param 0 | Param 1 | Param 2 | Param 4
-----|-------------|-------------|---------|---------|---------|---------
rectPoint | Checks if a point is inside a rectangle. | `Boolean` | `Vector` Rectangle position | `Vector` rectangle size | `Vector` point position |
shapePoint | Checks if a point is inside a shape formed with vertices. | `Boolean` | `VectorGroup` shape | `Vector` point position |
circleLine | Checks if a point is inside a circle | `Boolean` | `Vector` circle postion | `Number` circle radius | `Vector` Point position
rects | Checks if two rectangle collides. | `Boolean` | `Vector` Rectangle A position |`Vector` rectangle A size | `Vector` rectangle B position | `Vector` rectangle B size
lines | Checks if two lines crosses. | `Boolean` | `Vector` line A start | `Vector` line A end | `Vector` line B start | `Vector` line B end
linesIntersection | Get the intersetion point of two lines, if lines touches and are parallel return `true`, otherwise return `false` | `Vector` or `Boolean` | `Vector`line A start | `Vector` line A end | `Vector` line B start | `Vector` line B end
shapeLine | Checks if a shape and a line are colliding | `Boolean` | `VectorGroup` shape | `Vector` line start | `Vector` line end |
circleLine | Checks if a circle and a line are colliding | `Boolean` | `Vector` circle position | `Number` circle radius | `Vector` Line start point | `Vector` Line end point |
shapes | Checks if two shapes are colliding | `Boolean` | `VectorGroup` shape A | `VectorGroup` shape B |
circles | Checks if two cirlces are colliding | `Boolean` | `Vector` circle A position | `Number` circle A radius | `Vector` circle B position | `Number` circle B radius|
shapeCircle | Checks if a shape and circle are colliding | `Boolean` | `VectorGroup` shape | `Vector` circle position | `Number` circle radius |
betweenNodes | Iterates through a group of nodes efficiently | `undefined` | `function(Node, Node)` handler |

### vec

Shorthand to create a vector.

```javascript
let myVector = d2.vec(0, 0);
```

### vecGroup

Shorthand to create a vector group.

```javascript
let myGroup = d2.vecGroup([0, 0], [0, 1], [1, 1], [1, 0]);
```

### preload

To preload images, audio and videos. Return a promise.

```js
preload({
  image: {
    someImage: "/images/your_image.png",
  },
  audio: {
    someAudio: "/audio/your_audio.mp3",
  },
  video: {
    someVideo: "/videos/your_video.mp4",
  },
}).then(() => {
  // To access the preloaded DOM elements
  d2.assets.audio.play();
  // The 'assets' object will also be available in renderProps and updateProps.
  // Usually the engine starts here...
  engine.run();
});
```
