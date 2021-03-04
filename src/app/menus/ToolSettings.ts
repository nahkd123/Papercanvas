import { csson } from "../../csson/CSSon.js";
import { MenuBox } from "../../stdmenu/MenuBox.js";
import { ButtonMenuGadget, MenuGadget } from "../../stdmenu/MenuGadget.js";
import { Session } from "../Session.js";

export class ToolSettings extends MenuBox {
    colorPicker: ColorPickerGadget;
    test = new ButtonMenuGadget("Test");

    constructor(public session: Session) {
        super("bottom-left");

        this.colorPicker = new ColorPickerGadget(this);
        this.addGadget(this.colorPicker);
    }
}

class ColorPickerGadget extends MenuGadget {
    constructor(public parent: ToolSettings) {
        super("colorpicker");
    }

    strip: HTMLCanvasElement;
    stripData: ImageBitmap;

    saturationSlider: HTMLInputElement;
    alphaSlider: HTMLInputElement;

    loadGadget() {
        csson(this.contents, {
            width: 250
        });

        let label = document.createElement("div");
        label.textContent = "Color Picker";
        label.style.paddingBottom = "7px";
        this.contents.append(label);

        this.strip = document.createElement("canvas");
        this.strip.width = 250;
        this.strip.height = 100;
        this.contents.append(this.strip);
        this.renderStrip();

        let satContainer = document.createElement("div");
        this.contents.append(satContainer);

        let satLabel = document.createElement("div");
        csson(satLabel, {
            display: "inline-block",
            verticalAlign: "top",
            padding: [2, 31.98, 0, 0]
        });
        satLabel.textContent = "Saturation";
        satContainer.append(satLabel);

        this.saturationSlider = document.createElement("input");
        this.saturationSlider.type = "range";
        this.saturationSlider.min = "0";
        this.saturationSlider.max = "1";
        this.saturationSlider.step = "0.01";
        this.saturationSlider.disabled = true;
        csson(this.saturationSlider, {
            margin: 0,
            padding: [0, 0, 2, 0],
            width: 150
        });
        satContainer.append(this.saturationSlider);

        let alphaContainer = document.createElement("div");
        this.contents.append(alphaContainer);

        let alphaLabel = document.createElement("div");
        csson(alphaLabel, {
            display: "inline-block",
            verticalAlign: "top",
            padding: [2, 62, 0, 0]
        });
        alphaLabel.textContent = "Alpha";
        alphaContainer.append(alphaLabel);

        this.alphaSlider = document.createElement("input");
        this.alphaSlider.type = "range";
        this.alphaSlider.min = "0";
        this.alphaSlider.max = "1";
        this.alphaSlider.step = "0.01";
        this.alphaSlider.disabled = true;
        csson(this.alphaSlider, {
            margin: 0,
            padding: [0, 0, 2, 0],
            width: 150
        });
        alphaContainer.append(this.alphaSlider);

        this.strip.addEventListener("mousedown", event => {
            this.stripClick(event.offsetX, event.offsetY);

            let moveEvt = (event: MouseEvent) => {
                if (event.target === this.strip) this.stripClick(event.offsetX, event.offsetY);
            };
            let upEvt = () => {
                document.removeEventListener("mousemove", moveEvt);
                document.removeEventListener("mouseup", upEvt);
            }
            document.addEventListener("mousemove", moveEvt);
            document.addEventListener("mouseup", upEvt);
        });

        let saturationSliderChange = () => {
            let selectedColor = this.parent.session.tools.selectedTool?.selectedColor;
            if (selectedColor === undefined) return;

            let hsla = selectedColor.toHSLA();
            hsla[1] = parseFloat(this.saturationSlider.value);
            selectedColor.fromHSLA(...hsla);
            this.parent.session.tools.selectedTool.onColorChange();
            this.renderStrip();
        };
        this.saturationSlider.addEventListener("mousedown", saturationSliderChange);
        this.saturationSlider.addEventListener("mousemove", saturationSliderChange);
        this.saturationSlider.addEventListener("mouseup", saturationSliderChange);

        this.alphaSlider.addEventListener("change", () => {
            let selectedColor = this.parent.session.tools.selectedTool?.selectedColor;
            if (selectedColor === undefined) return;
            selectedColor.a = parseFloat(this.alphaSlider.value);
            this.parent.session.tools.selectedTool.onColorChange();
            this.renderStrip();
        });
    }

    renderStrip() {
        let ctx = this.strip.getContext("2d");
        
        const pW = 1 * this.strip.width / 360 * 2;
        const pH = 1 * this.strip.height / 100 * 2;
        
        let sat = this.parent.session.tools.selectedTool?.selectedColor?.toHSLA()[1];
        sat = Math.max(Math.min(sat, 1), 0) * 100;

        if (!this.stripData) {
            for (let i = 0; i < 360; i++) {
                const pX = i * this.strip.width / 360;
                for (let j = 0; j <= 100; j++) {
                    const pY = j * this.strip.height / 100;
                    ctx.fillStyle = `hsl(${i}, 100%, ${100 - j}%)`;
                    ctx.fillRect(pX, pY, pW, pH);
                }
            }
            window.createImageBitmap(this.strip).then(img => {
                this.stripData = img;
            });
        } else {
            ctx.filter = "saturate(" + sat + "%)";
            ctx.drawImage(this.stripData, 0, 0);
        }

        // Overlay weeee
        let selectedColor = this.parent.session.tools.selectedTool?.selectedColor;
        if (selectedColor === undefined) return;
        let hsla = selectedColor.toHSLA();

        const pointX = hsla[0] * this.strip.width / 360;
        const pointY = (1 - hsla[2]) * this.strip.height;

        ctx.strokeStyle = "#ffffff8a";
        ctx.lineWidth = 3;
        circleAt(pointX, pointY, 5.5);
        ctx.stroke();
        ctx.strokeStyle = "#171717";
        ctx.lineWidth = 2;
        circleAt(pointX, pointY, 7);
        ctx.stroke();
        
        function circleAt(pointX: number, pointY: number, rad: number) {
            ctx.beginPath();
            ctx.moveTo(pointX + rad, pointY);
            ctx.arc(pointX, pointY, rad, 0, Math.PI * 2);
            ctx.closePath();
        }
    }

    stripClick(x: number, y: number) {
        let selectedColor = this.parent.session.tools.selectedTool?.selectedColor;
        if (selectedColor === undefined) return;

        let s = selectedColor.toHSLA()[1];
        selectedColor.fromHSLA(
            x * 360 / this.strip.width,
            s,
            1 - y / this.strip.height
        );

        this.parent.session.tools.selectedTool.onColorChange();
        this.renderStrip();
    }
}