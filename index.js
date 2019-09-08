import p5 from  'p5'
import 'p5/lib/addons/p5.dom'

import {LSystem, L} from './lsystem.js'

const Dragon = new LSystem(["F", "+", "-"], "F++F++F", {F: "F-F++F-F"})

const Sierpinski = new LSystem(["L", "R", "+", "-"], "R",
    {
        L: "R+L+R",
        R: "L-R-L",
    })

const ThreeA = new LSystem(["F", "[", "]", "+", "-"], "F",
    {
        F: "F[+F]F[-F]F"
    })

const ThreeB = new LSystem(["F", "[", "]", "+", "-"], "F",
    {
        F: "FF-[-F+F+F]+[+F-F-F]"
    })

const [w, h] = [ window.innerWidth, window.innerHeight]

let textX, textY, textD, textN, textA, textTheta
let sliderX, sliderY, sliderD, sliderN, sliderA, sliderTheta

const sketch = s => {
    s.setup = () => {
        s.createCanvas(w, h)
        s.background(0)
        s.stroke(255)

        textX = s.createSpan("X")
        textX.position(20, 30)
        textX.style('color', 'white')
        
        sliderX = s.createSlider(0, w, w / 2)
        sliderX.position(20, 40)
        sliderX.style('width', '100px');
        sliderX.changed(s.draw)

        textY = s.createSpan("Y")
        textY.position(20, 50)
        textY.style('color', 'white')

        sliderY = s.createSlider(0, h, h / 2)
        sliderY.position(20, 60)
        sliderY.style('width', '100px');
        sliderY.changed(s.draw)

        textD = s.createSpan("d")
        textD.position(20, 70)
        textD.style('color', 'white')

        sliderD = s.createSlider(0, 10, 5, 0.1)
        sliderD.position(20, 80)
        sliderD.style('width', '100px');
        sliderD.changed(s.draw)

        textN = s.createSpan("n")
        textN.position(20, 90)
        textN.style('color', 'white')

        sliderN = s.createSlider(0, 10, 5)
        sliderN.position(20, 100)
        sliderN.style('width', '100px');
        sliderN.changed(s.draw)

        textA = s.createSpan("turtle angle")
        textA.position(20, 110)
        textA.style('color', 'white')

        sliderA = s.createSlider(0, 2 * Math.PI, 0, 0.001)
        sliderA.position(20, 120)
        sliderA.style('width', '100px');
        sliderA.changed(s.draw)

        textTheta = s.createSpan("branch angle")
        textTheta.position(20, 130)
        textTheta.style('color', 'white')

        sliderTheta = s.createSlider(0, 2 * Math.PI, Math.PI/3, Math.PI/12)
        sliderTheta.position(20, 140)
        sliderTheta.style('width', '100px');
        sliderTheta.changed(s.draw)
    }

    s.draw = () => {
        s.background(0)
        
        const x = sliderX.value()
        const y = sliderY.value()
        const d = sliderD.value()? sliderD.value() : 5
        const n = sliderN.value()
        const angle = sliderA.value()
        const theta = sliderTheta.value()

        const turtle = new Turtle(x, y, angle , d, theta)

        turtle.consume(s, ThreeA.grow("", n))
        s.noLoop()
    }
}

class Turtle {
    constructor(x, y, startAngle, d, delta) {
        this.x = x
        this.y = y
        this.startAngle = startAngle
        this.d = d
        this.delta = delta
    }

    // If the grammer uses a alphabet other than "Ff+-[]", send in map here, before consuming.
    addAlphabetMap(map) {
        this.alphabetMap = map
    }

    consume(s, sentence)  {
        s.resetMatrix()
        s.translate(this.x, this.y)
        s.rotate(this.startAngle)
        
        for (let i = 0; i < sentence.length; i++) {
            let current = this.alphabetMap ? this.alphabetMap[sentence.charAt(i)] : sentence.charAt(i)

            if (current == "F") {
                s.line(0, 0, 0, -this.d)
                /* s.ellipse(0, 0, this.d, this.d) */
                /* s.noFill() */
                s.translate(0, -this.d)
            } else if (current == "+") {
                s.rotate(this.delta)
            } else if (current == "-") {
                s.rotate(-this.delta)
            } else if (current == "f") {
                s.translate(0, -this.d)
            } else if (current == "[") {
                s.push()
            } else if (current == "]") {
                s.pop()
            }
        }
    }
}

const P5 = new p5(sketch)
