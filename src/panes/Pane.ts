export abstract class Pane {
    parentDOM: HTMLDivElement;

    titleDOM: HTMLDivElement;
    titleNameDOM: HTMLDivElement;
    contentsWrapper: HTMLDivElement;
    
    contents: HTMLDivElement;

    constructor(title: string, width = 600, height = 400) {
        this.parentDOM = document.createElement("div");
        this.parentDOM.className = "pane";

        this.titleDOM = document.createElement("div");
        this.titleDOM.className = "title";
        this.parentDOM.appendChild(this.titleDOM);

        this.titleNameDOM = document.createElement("div");
        this.titleNameDOM.className = "titlename";
        this.titleNameDOM.textContent = title;
        this.titleDOM.appendChild(this.titleNameDOM);

        this.contentsWrapper = document.createElement("div");
        this.contentsWrapper.className = "wrapper";
        this.contentsWrapper.style.width = width + "px";
        this.contentsWrapper.style.height = height + "px";
        this.parentDOM.appendChild(this.contentsWrapper);

        this.contents = document.createElement("div");
        this.contents.className = "contents";
        this.contentsWrapper.appendChild(this.contents);
    }

    render(ts: number) {}
}