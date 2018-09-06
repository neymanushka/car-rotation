
class Vector2 {
    x: number;
    y: number;

    constructor();
    constructor(p1: Vector2);
    constructor(p1: number, p2: number)
    constructor(p1?: any, p2?: any) {
        if (typeof p1 === "object") {
            this.x = p1.x;
            this.y = p1.y;
        }
        else {
            p1 == undefined ? this.x = 0 : this.x = p1;
            p2 == undefined ? this.y = 0 : this.y = p2;
        }
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static sub(v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static mulv(v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    static mul(v: Vector2, n) {
        return new Vector2(v.x * n, v.y * n);
    }

    dot(v: Vector2) {
        return this.x * v.x + this.y * v.y;
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lenSqrt() {
        return this.x * this.x + this.y * this.y;
    }

    static norm(v: Vector2) {
        let len = v.len();
        return len != 0 ? Vector2.mul(v, 1 / len ) : new Vector2();
        //return Vector2.mul(v, 1 / len );
    }

    static reflect(v: Vector2, n: Vector2) {
        return Vector2.sub(v, Vector2.mul(n, 2 * v.dot(n)));

    }

    distance(v: Vector2) {
        return Vector2.sub(this, v).len();
    }

    toString() {
        return "[" + this.x + "," + this.y + "]";
    }

    project(v: Vector2) {
        let dot = this.dot(v);
        let t = this.dot(this);
        return new Vector2(dot / t * this.x, dot / t * this.y);
    }

    lineNormal(x1, y1, x2, y2) {
        return new Vector2(y1 - y2, x2 - x1);
    }

    cross(v: Vector2) {
        return this.x * v.y - v.x * this.y;
    }

    static negative(v: Vector2) {
        return new Vector2(-v.x, -v.y);
    }

    static clamp(v: Vector2, min: Vector2, max: Vector2) {
        let t = new Vector2();
        t.x = v.x <= min.x ? min.x : v.x >= max.x ? max.x : v.x;
        t.y = v.y <= min.y ? min.y : v.y >= max.y ? max.y : v.y;
        return t;
    }

    equally(v: Vector2) {
        return this.x == v.x && this.y == v.y;
    }

    static rotate(v: Vector2, angle: number) {
        return new Vector2(v.x * Math.cos(angle) - v.y * Math.sin(angle), v.x * Math.sin(angle) + v.y * Math.cos(angle));
    }
}


export { Vector2 };