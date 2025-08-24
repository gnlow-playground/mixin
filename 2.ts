class Animal {
    name
    get age() {
        console.log("Who get my age?")
        return 123
    }
    constructor(name: string) {
        console.log("I'm being constructed!")
        this.name = name
    }
}

class Dog extends Animal {
    constructor(name: string) {
        super(name)
        console.log(`Dog ${name} is being counstructed!`)
    }
    bark() {
        console.log(`Bark! i'm ${this.name}.`)
    }
}

class Cat extends Animal {
    constructor(name: string) {
        super(name)
        console.log(`Cat ${name} is being counstructed!`)
    }
    meow() {
        console.log(`Meow! i'm ${this.name}.`)
    }
}

// deno-lint-ignore no-explicit-any
type Args<Class extends { new(...args: any): any }> =
Class extends { new(...args: infer Args): infer _ }
    ? Args
    : never

interface Chimera extends Dog, Cat {}

const Chimera = function (this: Chimera, ...args: Args<typeof Animal>) {
    ;[Dog, Cat, Animal].forEach(Class => {
        const desc = Object.getOwnPropertyDescriptors(Class.prototype)

        Object.defineProperties(this, desc)
        Object.assign(this, new Class(...args))
    })
} as unknown as { new(...args: Args<typeof Animal>): Chimera }

const chimera = new Chimera("John")

console.log(chimera)
console.log(chimera.age)
chimera.bark()
chimera.meow()
