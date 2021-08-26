class NutritionLabel extends HTMLDivElement {
    constructor(data) {
        super();
        this.data = data;
        this.bodyPart = document.createElement("tbody");
        let tab = document.createElement("table");
        tab.append(this.bodyPart);
        this.append(tab);
        this.classList.add("label-wrapper");
        this.generateTop();
        this.generateMain();
    }
    generateTop() {
        this.bodyPart.innerHTML = "<tr><th colspan='2'><h2>Nutrition Facts</h2></th></tr>";
        let servRow = document.createElement("tr");
        servRow.innerHTML = "<td><h3>Serving Size</h3></td>";
        let size = document.createElement("td");
        let h3 = document.createElement("h3");
        h3.innerHTML = printMeasurement(this.data.servingSize, true);
        size.appendChild(h3);
        servRow.append(size);
        this.bodyPart.append(servRow);
        this.bodyPart.appendChild(new RowBlock());
        this.bodyPart.innerHTML += "<tr><td colspan='2'><h5>Amount per serving</h5></td></tr>";
        let calRow = document.createElement("tr");
        ;
        calRow.innerHTML = "<td><h3>Calories</h3></td>";
        let amount = document.createElement("td");
        let h32 = document.createElement("h3");
        h32.innerHTML = "" + this.data.calories;
        amount.appendChild(h32);
        calRow.appendChild(amount);
        this.bodyPart.appendChild(calRow);
        this.bodyPart.innerHTML += "<tr><td colspan='2' style='text-align: right;'><h5>% Daily Value</h5></td></tr>";
    }
    generateMain() {
        let nutrients = this.data.nutrients;
        // Fats Section
        let totFats = new LabelRow("<strong>Total Fat</strong> " + printMeasurement(nutrients.fats.totFat), calculatePercent(nutrients.fats.totFat));
        this.bodyPart.appendChild(totFats);
        for (const fatType in nutrients.fats) {
            if (fatType != "totFat") {
                let meas = nutrients.fats[fatType];
                let tempFat = new LabelRow(fatType + " " + printMeasurement(meas), calculatePercent(meas));
                tempFat.first.outerHTML += "tabbed";
                this.bodyPart.appendChild(tempFat);
            }
        }
        // Cholesterol
        if (nutrients.cholesterol) {
            let cholest = new LabelRow("<strong>Cholesterol</strong> " + printMeasurement(nutrients.cholesterol), calculatePercent(nutrients.cholesterol));
            this.bodyPart.appendChild(cholest);
        }
        // Sodium
        let sodi = new LabelRow("<strong>Sodium</strong> " + printMeasurement(nutrients.sodium), calculatePercent(nutrients.sodium));
        this.bodyPart.appendChild(sodi);
        // Carbs Section
        let totCarbs = new LabelRow("<strong>Total Carbohydrates</strong> " + printMeasurement(nutrients.carbohydrates.totCarbohydrates), calculatePercent(nutrients.carbohydrates.totCarbohydrates));
        this.bodyPart.appendChild(totCarbs);
        for (const carbType in nutrients.carbohydrates) {
            if (carbType != "totCarbohydrates") {
                let carb = new LabelRow(carbType + " " + printMeasurement(nutrients.carbohydrates[carbType]), calculatePercent(nutrients.carbohydrates[carbType]));
                carb.first.outerHTML += "tabbed";
                this.bodyPart.appendChild(carb);
            }
        }
    }
    connectedCallback() {
    }
    disconnectedCallback() {
    }
}
window.customElements.define("nutrition-label", NutritionLabel, { extends: "div" });
