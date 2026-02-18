export class Human {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hunger = 100;
        this.age = 0;
        this.alive = true;
        this.size = 6;
    }

    // placeholder update — simulation functions will be used externally
    update() {
        // no-op here; gameLoop will call movement/hunger/aging
    }
}
