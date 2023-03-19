type UIElement = HTMLElement | Generator<unknown, any, UIElement> | (() => UIElement) | UIAppendable;

interface HTMLElement {
    then(cb: (e: this) => any): this;
    add(...elem: UIElement[]): this;
}

interface UIAppendable {
    readonly element: HTMLElement;
}

HTMLElement.prototype.then = function(cb: (e: any) => any) {
    cb(this);
    return this;
}

HTMLElement.prototype.add = function(...elem: UIElement[]) {
    elem.forEach(child => {
        if (child == null) return;

        if (child instanceof HTMLElement) this.appendChild(child);
        else if (typeof child == "function") this.add(child());
        else if ("element" in child) this.appendChild(child.element);
        else {
            let result: IteratorResult<unknown, UIElement>;
            while (!(result = child.next()).done) this.add(result.value);
            this.add(result.value);
        }
    });

    return this;
};