import { Vector2 } from "./Vector2";

class Car {
    sprite: PIXI.Sprite;
    position: Vector2;
    velocity: Vector2;

    start: Vector2;
    dest: Vector2;
    stop: boolean;

    constructor(x, y, tex) {
        this.sprite = new PIXI.Sprite(tex);
        this.sprite.x = x;
        this.sprite.y = y;
        this.position = new Vector2(x, y);
        this.velocity = new Vector2();
        this.sprite.anchor.set(0.5);
        this.stop = true;
    }
    moveTo(x, y) {
        this.start = new Vector2(this.sprite.x, this.sprite.y);
        this.dest = new Vector2(x, y);
        this.velocity = Vector2.norm(Vector2.sub(this.dest, this.start));
        this.stop = false;        
    }
    update() {
        if (this.stop) return;
        if (this.start.distance(this.dest) <= 0.5) {
            this.stop = true;
            return;
        }
        this.start = Vector2.add(this.start, this.velocity);
        this.sprite.x = this.start.x;
        this.sprite.y = this.start.y;
        let r = Math.atan2(this.velocity.x, this.velocity.y);
        this.sprite.rotation = -r;
    }
};


export { Car };