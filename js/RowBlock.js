class RowBlock extends HTMLTableRowElement {
    constructor() {
        super();
        let inner = document.createElement("td");
        inner.setAttribute("block", "true");
        inner.colSpan = 2;
    }
}
window.customElements.define('label-row-block', RowBlock, { extends: "tr" });
