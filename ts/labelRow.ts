class LabelRow extends HTMLTableRowElement {

    first: HTMLTableDataCellElement;
    second: HTMLTableDataCellElement;


    constructor(first: string, second: string) {
        super();
        
        this.first = document.createElement("td");
        this.first.innerHTML = first;

        this.second = document.createElement("td");
        this.second.innerHTML = second;

        this.appendChild(this.first);
        this.appendChild(this.second);
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

window.customElements.define('lable-row', LabelRow, { extends: "tr"});