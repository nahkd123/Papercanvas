export class PenColor {
    constructor(
        public r = 0,
        public g = 0,
        public b = 0,
        public a = 1
    ) {}

    match(color: PenColor) {
        return color.r === this.r && color.g === this.g && color.b === this.b && color.a === this.a;
    }

    setFrom(color: PenColor) {
        this.r = color.r; this.g = color.g; this.b = color.b; this.a = color.a;
        return this;
    }

    toHSLA() {
        const r = this.r, g = this.g, b = this.b;
        const cmax = Math.max(r, g, b);
        const cmin = Math.min(r, g, b);
        const delta = cmax - cmin;
        let h = 0, s = 0, l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = ((b - r) / delta) + 2;
        else if (cmax === b) h = ((r - g) / delta) + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0? 0 : delta / (1 - Math.abs(2 * l - 1));

        return [h, s, l, this.a];
    }

    fromHSLA(h = 0, s = 0, l = 0, a = this.a) {
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c/2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {r = c; g = x; b = 0;}
        else if (60 <= h && h < 120) {r = x; g = c; b = 0;}
        else if (120 <= h && h < 180) {r = 0; g = c; b = x;}
        else if (180 <= h && h < 240) {r = 0; g = x; b = c;}
        else if (240 <= h && h < 300) {r = x; g = 0; b = c;}
        else if (300 <= h && h < 360) {r = c; g = 0; b = x;}

        r += m; g += m; b += m;
        this.r = r; this.g = g; this.b = b; this.a = a;
    }

    toCappedArray(cap = 255) {
        return [
            Math.round(cap * this.r),
            Math.round(cap * this.g),
            Math.round(cap * this.b),
            Math.round(cap * this.a)
        ];
    }

    toCSSString() {
        return `rgba(${Math.round(255 * this.r)}, ${Math.round(255 * this.g)}, ${Math.round(255 * this.b)}, ${this.a})`;
    }
}