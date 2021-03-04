export function csson(obj: HTMLElement, styling: CSSonStyling) {
    for (let property in styling) {
        let o = styling[property];
        if (typeof o === "string") obj.style[property] = o;
        else if (typeof o === "number") obj.style[property] = o + "px";
        else if (o instanceof Array) {
            let str = o.join("px ") + "px";
            obj.style[property] = str;
        }
    }
}

export interface CSSonStyling {
    [x: string]: any;

    // Positioning & Sizing
    top?: number | string;
    left?: number | string;
    width?: number | string;
    height?: number | string;
    padding?: number | string | number[];
    margin?: number | string | number[];

    // Backgrounds
    backgroundImage?: string;
    backgroundSize?: "auto" | "contains" | "cover" | "inherit" | "initial" | "revert" | "unset";
    backgroundColor?: string;

    // Borders
    border?: string;
    borderLeft?: number | string;
    borderRight?: number | string;
    borderTop?: number | string;
    borderBottom?: number | string;
    borderColor?: string;
    borderRadius?: number | string | number[];

    // Others
    display?: "block" | "inline-block" | "none";
    whiteSpace?: "pre";
}