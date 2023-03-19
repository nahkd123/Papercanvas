import { Lagrange } from "./Lagrange";

export namespace Bezier {
    export function cubicPoints(
        quality: number,
        x1: number, y1: number, cpx1: number, cpy1: number,
        cpx2: number, cpy2: number, x2: number, y2: number
    ) {
        let points: [number, number][] = [];
        const stepSize = 1 / quality;

        for (let t = 0; t <= 1; t += stepSize) {
            let x = (1 - t) ** 3 * x1 + 3 * (1 - t) ** 2 * t * cpx1 + 3 * (1 - t) * t * t * cpx2 + t ** 3 * x2;
            let y = (1 - t) ** 3 * y1 + 3 * (1 - t) ** 2 * t * cpy1 + 3 * (1 - t) * t * t * cpy2 + t ** 3 * y2;
            points.push([x, y]);
        }

        return points;
    }

    export function cubicInterpolation(
        quality: number,
        x1: number, y1: number, cpx1: number, cpy1: number,
        cpx2: number, cpy2: number, x2: number, y2: number
    ) {
        return Lagrange.compileFunction(cubicPoints(quality, x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2));
    }
}