class MathHelper {

    static sign(value) {
        if (value > 0) return 1;
        if (value < 0) return -1;
        return 0;
    }

    static toRadians(value) {
        return value * Math.PI / 180;
    }
    
    static toDegrees(value) {
        return value * 180 / Math.PI;
    }
    
    static clamp(n, min, max) {
        return n <= min ? min : n >= max ? max : n;
    }

    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export { MathHelper };