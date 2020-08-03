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
##### Methods (Returns `this`)
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
