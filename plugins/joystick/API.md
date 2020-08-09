# D2

## Joystick Plugin

An alternative for keyboard inputs for mobile clients.

---

### Installation

Place the CDN after the d2 script in the head.

---

### Using it...

```js
let config = {
  // ...your other config here
  usingJoystick: true,
};
```

### Getting the data...

```js
class Player extends d2.Node {
  constructor() {
    // Your constructor here...
  }
  update(props) {
    let playerMove = props.joystick.vector; // This is an instance of the Vector class, so feel free to use all methods that returns a new Vector. The vector is also normalized...
    this.position.add(playerMove.timesn(10));
  }
}
```
