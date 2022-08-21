import p5 from "p5";
import { LSystem, L } from "./lsystem";

const Dragon = new LSystem(["F", "+", "-"], "F++F++F", { F: "F-F++F-F" });

const Sierpinski = new LSystem(["L", "R", "+", "-"], "R", {
  L: "R+L+R",
  R: "L-R-L",
});

const ThreeA = new LSystem(["F", "[", "]", "+", "-"], "F", {
  F: "F[+F]F[-F]F",
});

const ThreeB = new LSystem(["F", "[", "]", "+", "-"], "F", {
  F: "FF-[-F+F+F]+[+F-F-F]",
});

const [w, h] = [window.innerWidth, window.innerHeight];

let textX, textY, textD, textN, textA, textTheta;
let sliderX: p5.Element,
  sliderY: p5.Element,
  sliderD: p5.Element,
  sliderN: p5.Element,
  sliderA: p5.Element,
  sliderTheta: p5.Element;

class Turtle {
  x: number;
  y: number;
  startAngle: number;
  d: number;
  delta: number;
  alphabetMap: undefined | Record<string, string>;
  constructor(
    x: number,
    y: number,
    startAngle: number,
    d: number,
    delta: number
  ) {
    this.x = x;
    this.y = y;
    this.startAngle = startAngle;
    this.d = d;
    this.delta = delta;
    this.alphabetMap = undefined;
  }

  // If the grammer uses a alphabet other than "Ff+-[]", send in map here, before consuming.
  addAlphabetMap(map: Record<string, string>) {
    this.alphabetMap = map;
  }

  consume(p: p5, sentence: string) {
    p.resetMatrix();
    p.translate(this.x, this.y);
    p.rotate(this.startAngle);

    p.stroke(255, 70);

    let strokeWidth = 5;
    let newD = this.d;

    for (let i = 0; i < sentence.length; i++) {
      let current = this.alphabetMap
        ? this.alphabetMap[sentence.charAt(i)]
        : sentence.charAt(i);

      if (current == "F") {
        p.strokeWeight(strokeWidth);
        p.line(0, 0, 0, -newD);
        p.translate(0, -newD);
      } else if (current == "+") {
        p.rotate(this.delta + p.random(-0.1, 0.1));
      } else if (current == "-") {
        p.rotate(-this.delta + p.random(-0.05, 0.05));
      } else if (current == "f") {
        p.translate(0, -this.d);
      } else if (current == "[") {
        strokeWidth *= 0.4;
        newD *= 0.7;
        p.push();
      } else if (current == "]") {
        strokeWidth /= 0.4;
        newD /= 0.7;
        p.pop();
      }
    }
  }
}

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(w, h);
    p.background(0);
    p.stroke(255);

    textX = p.createSpan("X");
    textX.position(20, 30);
    textX.style("color", "white");
    sliderX = p.createSlider(0, w, w / 2);
    sliderX.position(20, 40);
    sliderX.style("width", "100px");
    // @ts-ignore
    sliderX.changed(p.draw);

    textY = p.createSpan("Y");
    textY.position(20, 50);
    textY.style("color", "white");

    sliderY = p.createSlider(0, h, h / 2);
    sliderY.position(20, 60);
    sliderY.style("width", "100px");
    // @ts-ignore
    sliderY.changed(p.draw);

    textD = p.createSpan("d");
    textD.position(20, 70);
    textD.style("color", "white");

    sliderD = p.createSlider(0, 10, 5, 0.1);
    sliderD.position(20, 80);
    sliderD.style("width", "100px");
    // @ts-ignore
    sliderD.changed(p.draw);

    textN = p.createSpan("n");
    textN.position(20, 90);
    textN.style("color", "white");

    sliderN = p.createSlider(0, 10, 7);
    sliderN.position(20, 100);
    sliderN.style("width", "100px");
    // @ts-ignore
    sliderN.changed(p.draw);

    textA = p.createSpan("turtle angle");
    textA.position(20, 110);
    textA.style("color", "white");

    sliderA = p.createSlider(0, 2 * Math.PI, 0, 0.001);
    sliderA.position(20, 120);
    sliderA.style("width", "100px");
    // @ts-ignore
    sliderA.changed(p.draw);

    textTheta = p.createSpan("branch angle");
    textTheta.position(20, 130);
    textTheta.style("color", "white");

    sliderTheta = p.createSlider(0, 2 * Math.PI, Math.PI / 7, Math.PI / 12);
    sliderTheta.position(20, 140);
    sliderTheta.style("width", "100px");
    // @ts-ignore
    sliderTheta.changed(p.draw);
  };

  p.draw = () => {
    // Define render logic for your sketch here
    console.log("drew");
    p.background(0);

    const x = sliderX.value();
    const y = sliderY.value();
    const d = sliderD.value() ? sliderD.value() : 5;
    const n = sliderN.value();
    const angle = sliderA.value();
    const theta = sliderTheta.value();

    const turtle = new Turtle(
      x as number,
      y as number,
      angle as number,
      d as number,
      theta as number
    );
    /* turtle.addAlphabetMap({
     *     "R": "F",
     *     "L": "F",
     *     "+": "+",
     *     "-":"-"
     * })
     */
    turtle.consume(p, ThreeB.grow("", n as number));
    console.log("got here");
    p.noLoop();
  };
};

new p5(sketch);
