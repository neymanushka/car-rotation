import * as PIXI from "pixi.js";
import { Component } from 'inferno';
import { Car } from './Car';
import { MathHelper } from "./MathHelper";

let point = function (x, y) {
    this.x = x;
    this.y = y;
};

function rotatePoint(point, count) {
    if (count > 1) point = rotatePoint(point, count - 1);
    point.y *= -1;
    [point.x, point.y] = [point.y, point.x];
    return point;
}


function rotate(arr, count) {
    if (count > 1) arr = rotate(arr, count - 1);
    arr[1] *= -1;
    return arr.reverse();
}

function getBezierBasis(i, n, t) {
    function f(n) {
        return (n <= 1) ? 1 : n * f(n - 1);
    };
    return (f(n) / (f(i) * f(n - i))) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

function getBezierCurve(arr) {
    let res = new Array()
    for (let t = 0; t < 1 + 0.01; t += 0.01) {
        if (t > 1) t = 1;
        let ind = res.length;

        res[ind] = new Array(0, 0);

        for (let i = 0; i < arr.length; i++) {
            let b = getBezierBasis(i, arr.length - 1, t);

            res[ind][0] += arr[i][0] * b;
            res[ind][1] += arr[i][1] * b;
        }
    }
    return res;
}

class PIXIComponent extends Component {
    app: any;
    pixi: any;
    car: Car;
    land: PIXI.Sprite;
    trail: PIXI.Graphics;
    trailStep: number;
    path: number[];

    constructor(props) {
        super(props);
        this.pixi = null;
        this.app = new PIXI.Application(window.innerWidth, window.innerHeight,
            {
                backgroundColor: 0x4EC0CA
            }
        );
    }
    updatePIXI = (element) => {
        this.pixi = element;
        if (this.pixi && this.pixi.children.length <= 0) {
            this.pixi.appendChild(this.app.view);
            this.setup();
        }
    }
    setup = () => {
        PIXI.loader
            .add("land", "sprites/cross.png")
            .add("car", "sprites/car2d.png")
            .load(this.initialize);
    };
    initialize = () => {
        this.car = new Car(800, 450, PIXI.loader.resources["car"].texture);
        this.land = new PIXI.Sprite(PIXI.loader.resources["land"].texture);
        this.app.stage.addChild(this.land);
        this.trail = new PIXI.Graphics();
        this.app.stage.addChild(this.trail);
        this.app.stage.addChild(this.car.sprite);
                
        this.path = this.getNewTrail();
        this.car.sprite.x = this.path[0][0];
        this.car.sprite.y = this.path[0][1];

        window.setInterval(() => {
            this.car.update();
            if (this.car.stop) {
                if (this.trailStep < this.path.length) {
                    this.car.moveTo(this.path[this.trailStep][0], this.path[this.trailStep][1]);
                    this.trailStep++;
                }
                else {
                    this.path = this.getNewTrail();
                    this.car.sprite.x = this.path[0][0];
                    this.car.sprite.y = this.path[0][1];
                    this.car.sprite.rotation = 0;
                    this.trailStep = 0;
                }
            }
        }, 1);
        //this.app.renderer.plugins.interaction.on('mousemove', (e) => { console.log(e.data.global.x, e.data.global.y) });
    };
    getNewTrail = () => {
        this.trail.clear();
        this.trail.beginFill(0xFF3300);
        this.trail.lineStyle(4, 0xffd900, 1);

        let startPoint = {
            center: new point(425, 425),
            start: new point(125, -97),
        };

        let arr = new Array();

        let start = new point(startPoint.start.x, startPoint.start.y + MathHelper.randomInt(0, 2) * 39);
        let direction = MathHelper.randomInt(0, 2);
        let dest = new point(startPoint.start.x, startPoint.start.y + (MathHelper.randomInt(0, 2) + 3) * 38);
        let end = new point(dest.x + 250, dest.y);

        if (direction == 0) {            
            dest = rotatePoint(dest, 1);
            end = rotatePoint(end, 1);
            let hh = Math.abs(dest.x - start.x) / 1.5;
            arr[2] = new Array(start.x - hh, start.y);
            arr[3] = new Array(dest.x, dest.y - hh);
        }

        if (direction == 1) {
            dest = rotatePoint(dest, 3);
            end = rotatePoint(end, 3);
            let hh = Math.abs(dest.x - start.x) / 1;
            arr[2] = new Array(start.x - hh, start.y);
            arr[3] = new Array(start.x - hh, start.y);
        }

        if (direction == 2) {
            dest = new point(startPoint.start.x, startPoint.start.y + (MathHelper.randomInt(0, 2) + 3) * 38);
            end = new point(dest.x + 250, dest.y);
            let l = dest.y - start.y;
            arr[2] = new Array(start.x - l, start.y);
            arr[3] = new Array(dest.x - l, dest.y);
        }

        arr[0] = new Array(start.x + 250, start.y);
        arr[1] = new Array(start.x, start.y);
        arr[4] = new Array(dest.x, dest.y);
        arr[5] = new Array(end.x, end.y);

        let r = MathHelper.randomInt(0, 3);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = rotate(arr[i], r);
            arr[i][0] += startPoint.center.x;
            arr[i][1] += startPoint.center.y;
        }

        let flow = []
            .concat([arr[0]])
            .concat(getBezierCurve(new Array(arr[1], arr[2], arr[3], arr[4])))
            .concat([arr[5]]);

        for (let i = 0; i < flow.length - 1; i++) {
            this.trail.moveTo(flow[i][0], flow[i][1]);
            this.trail.lineTo(flow[i + 1][0], flow[i + 1][1]);
        }
        this.trail.endFill();
        return flow;
    }
    render() {
        return (
            <div>
                <div ref={this.updatePIXI} />
            </div>
        );
    }
}

export { PIXIComponent };