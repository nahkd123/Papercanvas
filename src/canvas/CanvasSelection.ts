export class CanvasSelection {
    bitmap: ImageBitmap;

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    static async fromFile(file: File) {
        let bitmap = await window.createImageBitmap(file);
        let selection = new CanvasSelection(0, 0, bitmap.width, bitmap.height);
        selection.bitmap = bitmap;
        return selection;
    }

    static async fromClipboard(event: ClipboardEvent) {
        if (event.clipboardData.files.length === 0) return null;
        let file = event.clipboardData.files.item(0);
        return await this.fromFile(file);
    }
}