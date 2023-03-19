export namespace Lagrange {
    export function interpolate(x: number, points: [number, number][]) {
        // construct a polynomial
        return points.map((point, i) => {
            let a = point[1], b = 1;
            for (let j = 0; j < points.length; j++) {
                if (i == j) continue;
                a *= x - points[j][0];
                b *= point[0] - points[j][0];
            }

            return a / b;
        }).reduce((a, b) => a + b);
    }

    export function functionAsString(points: [number, number][]) {
        function sanitize(v: any) {
            if (typeof v != "number") return +v;
            return v;
        }

        return points
        .map(point => point.map(sanitize))
        .map((point, i) => {
            let a = `${point[1]}`, b = 1;
            for (let j = 0; j < points.length; j++) {
                if (i == j) continue;
                a += ` * (x - ${points[j][0]})`;
                b *= point[0] - points[j][0];
            }

            return `((${a}) / (${b}))`
        }).join(" + ");
    }

    export function compileFunction(points: [number, number][]): ((x: number) => number) {
        return new Function("x", `return ${functionAsString(points)};`) as any;
    }

    export function plot(ctx: CanvasRenderingContext2D, xFrom: number, xTo: number, points: [number, number][]) {
        ctx.beginPath();

        for (let i = xFrom; i <= xTo; i += (xTo - xFrom) / 100) {
            if (i == xFrom) ctx.moveTo(i, interpolate(i, points));
            else ctx.lineTo(i, interpolate(i, points));
        }

        ctx.stroke();
        ctx.closePath();

        points.forEach(p => {
            ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2);
        });
    }
}