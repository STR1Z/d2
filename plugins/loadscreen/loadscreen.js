d2.loadscreen = {
  init: () => {
    let e = (d2.loadscreen.element = document.body.appendChild(document.createElement("div")));
    e.style.display = "none";
    e.style.position = "fixed";
    e.style.top = e.style.bottom = e.style.left = e.style.right = 0;
    e.className = "d2-loadscreen";
    e.style.zIndex = 10;
  },
  waitForClick: () => {
    return new Promise((resolve) => {
      d2.loadscreen.element.addEventListener("click", function () {
        d2.loadscreen.element.removeEventListener("click", this);
        resolve();
      });
    });
  },
  show: () => {
    d2.loadscreen.element.style.display = "block";
  },
  hide: () => {
    d2.loadscreen.element.style.display = "none";
  },
  display: (html) => {
    d2.loadscreen.element.innerHTML = html;
  },
};
