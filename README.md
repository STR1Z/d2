# getlib
###### v0.0.1
Some random lightweight Game Engine Tools Library that helps to create some casual games for school projects or whatever.

---
### Classes
- Vector
- VectorGroup
- Node
- Engine
---
### Vector
Class responsible for 2d vector manipulation.
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



