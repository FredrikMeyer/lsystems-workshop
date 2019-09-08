export class LSystem {
    constructor(alphabet, axiom, productions) {
        this.alphabet = alphabet
        this.axiom = axiom
        this.productions = productions
    }

    map(sentence) {
        return sentence.split("")
            .map(c => this.productions[c] || c)
            .join("")
    }

    grow(sentence, n) {
        if (!sentence) return this.grow(this.axiom, n-1)

        let c = n

        let result = sentence
        while (c > 0) {
            result = this.map(result)
            c--
        }
        
        return result
    }
}

export const L = new LSystem(["F", "f", "+", "-"], "F-F-F-F",
    {
        "F": "F+f-FF+F+FF+Ff+FF-f+FF-F-FF-Ff-FFF",
        "f": "ffff"
    })


