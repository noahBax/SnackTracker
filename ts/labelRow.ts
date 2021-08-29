class LabelRow extends HTMLTableRowElement {

    first: HTMLTableDataCellElement;
    second: HTMLTableDataCellElement;


    constructor(first: string, second: string | null) {
        super();
        
        this.first = document.createElement("td");
        this.first.innerHTML = first;
        
        this.appendChild(this.first);
        
        if (second) {
            this.second = document.createElement("td");
            this.second.innerHTML = second;
            this.appendChild(this.second);
        }
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

window.customElements.define('lable-row', LabelRow, { extends: "tr"});