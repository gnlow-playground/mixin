class Animal {
    name
    constructor(name: string) {
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
            ;[Dog, Cat].forEach(Class => {
                Object.assign(this, new Class())
            })
            Object.assign(this, new Animal(...args))
        }
    }
    ;[Dog, Cat].forEach(Class => {
        Object.getOwnPropertyNames(Class.prototype)
        .filter(p => p != "constructor")
        .forEach(p => Mixin.prototype[p] = Class.prototype[p])
    })
    return new Mixin(...args)
} as unknown as { new(...args: Args<typeof Animal>): Chimera }

const chimera = new Chimera("John")

console.log(chimera)
chimera.bark()
