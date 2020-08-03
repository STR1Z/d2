# getlib
###### Documentation v0.0.1
Some random lightweight Game Engine Tools Library that helps to create some casual games for school projects or whatever.

---
### Classes
- Vector
- VectorGroup
- Node
- Engine
### Utility
- Colision
- vec
- vecGroup
---
### Vector
Class responsible for 2D vector manipulation.
```javascript
//create
let myVector = new getL.Vector(10,10)
//modify
myVector.add(new getL.Vector(10,10))
//check is modified
console.log(myVector.x, myVector.y) // 20, 20
//create new vector from sum of two vectors
let otherVector = myVector.plus(new getL.Vector(15,15))
//myVector will not get modified. The same can be achieved with...
let otherVector2 = myVector.copy.add(new getL.Vector(15,15))
```
##### Properties
Name | Type | Description | Constraint
-----|------|-------------|----------
x | Number | Stores the X value | None
y | Number | Stores the Y value | None
length | Number | Returns the length/magnitude | Readonly
array  | Number | Returns in array format `[x,y]` | Readonly
angle  | Number | Return the direction/angle | Readonly
copy | Vector | Return a deep copy of the instance | Readonly
##### Methods (`A.method(B)` returns `A`)
Name | Description | Parameter
-|-|-
point | Changes the direction of the vector | angle : `Number`
translate | Translates `this` by vector | vector : `Vector`
rotate | Rotates `this` by angle | angle : `Number`
scale | Scales `this` by scalar or vector | scalar : `Number` **or** vector : `Vector`
add | Increases `this` by vector | vector : `Vector`
sub | Decreases `this` by vector | vector : `Vector`
mul | Multiplies `this` by vector | vector : `Vector`
div | Divides `this` by vector | vector : `Vector`
muln | Multiplies `this.x` and `this.y` by scalar | scalar : `Number`
divn | Devides `this.x` and `this.y` by scalar | scalar : `Number`
##### Methods (`A.method(B)` returns `C`)
Name | Description | Parameter
-|-|-
plus | Sum of two vectors | vector : `Vector`
minus | Difference of two vectors | vector : `Vector`
times | Product of two vectors | vector : `Vector`
over | Quotient of two vectors | vector : `Vector`
timesn | Returns `new Vector(this.x * scalar, this.y * scalar)` | vector : `Vector`
overn | Returns `new Vector(this.x / scalar, this.y / scalar)` | vector : `Vector`
### VectorGroup
A wrapper that contains multiple vectors and **have most of the methods from the Vector class** that can be aplied to a group of vectors.
##### Properties
Name | Type | Description | Constraint
-----|------|-------------|----------
vectors | Array<Vector> | Stores the vectors | None
size | Number | Returns the amount of vectors | Readonly
array  | Number | Returns in array format `[[x,y]...]` | Readonly
sum  | Vector | Return a vector representing the sum | Readonly
average | Vector | Returns the average of all the vectors | Readonly

##### Static methods (`Vector.method(args)` returns `new Vector`)
Name | Description | Parameter
-----|-------------|----------
pack | Returns a vector from a matrix | matrix : `Array<[x,y]>`

##### Iterative methods
Name | Description | Parameter
-----|-------------|----------
each | vectorGroup.vectors.forEach shorthand | fn : `function(vector, index)`
link | Iterate over all the adjacent pairs if arranged circularly | fn : `function(vectorA, vectorB)`

### Node
An empty shell to create Game Objects
##### Properties
Name | Type | Description | Constraint
-----|------|-------------|----------
nodes | Array<Node> | Stores all the subnodes | None

##### Methods
Name | Description | Parameter
-----|-------------|----------
render | For rendering | renderProps : Object
update | For updating | updateProps : Object
renderNodes | For rendering the subnodes | renderProps : Object
updateNodes | For updating the subnodes | updateProps : Object
append | Pushes a Node to the subnodes | ...nodes : ...Array<Node>
  
```typescript
renderProps = {
  frames : Number, //Amount of frames rendered.
  ctx : CanvasContext, //Used to draw on the canvas.
  keyboard: Object<Char, Boolean>, //Used to get keyboard data.
  mouse: {
    position : Vector, //Position of the mouse.
    button : {
      0 : Boolean, // is mouse primary button down ?
      1 : Boolean, // is mouse middle button down ? 
      2 : Boolean, // is mouse secondary button down ?
    }
  }
}

updateProps = {
  ticks : Number, //Amount of updates.
  keyboard: Object<Char, Boolean>, //Used to get keyboard data.
  mouse: {
    position : Vector, //Position of the mouse.
    button : {
      0 : Boolean, // is mouse primary button down ?
      1 : Boolean, // is mouse middle button down ? 
      2 : Boolean, // is mouse secondary button down ?
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
  usingMouse: true
}
let engine = new getL.Engine(config)
engine.run()
// pause the engine
engine.stop()
//destroy the engine : removes all event listeners
engine.destroy()
```

##### Config
Name | Description | Default | Type
-|-|-|-
fps | Frames per second | 30 | Number
tps | Ticks per second | 30 | Number
canvas | Dom canvas element | undefined | HTMLElement
usingKeyboard | Listen for keyboard events | false | Boolean
usingMouse | Listen for mouse events | false | Boolean

---
### Collision
Simple collision detection utility. Very unoptimised for large quantities of objects.
Name | Description | Return type | Param 0 | Param 1 | Param 2 | Param 4
-----|-------------|-------------|---------|---------|---------|---------
rectPoint | Checks if a point is inside a rectangle. | Boolean | Rectangle position : `Vector` | rectangle size : `Vector` | point position : `Vector` | 
shapePoint | Checks if a point is inside a shape formed with vertices. | Boolean | shape : `VectorGroup` | point position : `Vector` | 
rects | Checks if two rectangle collides. | Boolean | Rectangle A position : `Vector` | rectangle A size : `Vector` | rectangle B position : `Vector` | rectangle B size : `Vector`
lines | Checks if two lines crosses. | Boolean | line A start : `Vector` | line A end : `Vector` | line B start : `Vector` | line B end : `Vector`
lines_point | Get the intersetion point of two lines, if lines touches and are parallel return `true`, otherwise return `false` | Vector or Boolean | line A start : `Vector` | line A end : `Vector` | line B start : `Vector` | line B end : `Vector`
shapeLine | Checks if a shape and a line are colliding | Boolean | shape : `VectorGroup` | line start : `Vector` | line end : `Vector` | 
shapes | Checks if two shapes are colliding | Boolean | shape A : `VectorGroup` | shape B : `VectorGroup` | | 

### vec
Shorthand to create a vector.
```javascript
let myVector = getL.vec(0,0)
```
### vecGroup
Shorthand to create a vector group.
```javascript
let myGroup = getL.vecGroup(
  [0,0],
  [0,1],
  [1,1],
  [1,0]
)
```
