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
    bark() {
        console.log(`Bark! i'm ${this.name}.`)
    }
}

class Cat extends Animal {
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

const Chimera = function (...args: Args<typeof Animal>) {
    class Mixin {
        constructor(...args: Args<typeof Animal>) {
            ;[Dog, Cat, Animal].forEach(Class => {
                Object.defineProperties(this,
                    Object.getOwnPropertyDescriptors(new Class(...args))
                )
            })
        }
    }
    ;[Dog, Cat, Animal].forEach(Class => {
        const desc = Object.getOwnPropertyDescriptors(Class.prototype)

        const filtered = Object.fromEntries(
            Object.entries(desc)
            .filter(([k]) => k != "constructor")
        )

        Object.defineProperties(Mixin.prototype, filtered)
    })
    return new Mixin(...args)
} as unknown as { new(...args: Args<typeof Animal>): Chimera }

const chimera = new Chimera("John")

console.log(chimera)
console.log(chimera.age)
chimera.bark()
