export namespace BrushTips {
    export function createTip(width: number, height: number, cb: (ctx: OffscreenCanvasRenderingContext2D, cv: OffscreenCanvas) => any) {
        let cv = new OffscreenCanvas(width, height);
        let ctx = cv.getContext("2d");
        cb(ctx, cv);
        return cv.transferToImageBitmap();
    }

    export const SOFT_TIP = createTip(16, 16, ctx => {
        ctx.fillStyle = "#fff7";
        ctx.beginPath();
        ctx.moveTo(7.5, 7.5);
        ctx.arc(7.5, 7.5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#fff3";
        for (let i = 0; i < 1000; i++) ctx.fillRect(Math.random() * 16, Math.random() * 16, 1, 1);
    });
}