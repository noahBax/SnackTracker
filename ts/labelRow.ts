class LabelRow extends HTMLTableRowElement {

    first: HTMLTableDataCellElement;
    second: HTMLTableDataCellElement;


    constructor(first: string, second: string) {
        super();
        
        this.first = new HTMLTableDataCellElement();
        this.first.innerHTML = first;

        this.second = new HTMLTableDataCellElement();
        this.second.innerHTML = second;
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

window.customElements.define('lable-row', LabelRow, { extends: "tr"});