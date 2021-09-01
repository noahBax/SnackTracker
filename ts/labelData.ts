function printMeasurement(item: Measurement, includeSpace?: boolean): string {
    
    return "" + item[0] + (includeSpace ? " " : "") + item[1];
}

function calculatePercent(item: Measurement, name: string): string | null{
    if (recommendedValues.hasOwnProperty(name)) {
        return (item[0] / recommendedValues[name] * 100).toFixed(0) + "%";
    }
    return " ";
}

var nutrientNames = {
    totFat: "Total Fat",
    transFat: "Trans Fat",
    satFat: "Saturated Fat",
    polyUnsaturadedFat: "Polyunsaturated Fat",
    monoUnsaturatedFat: "Monounsaturated Fat",
    cholesterol: "Cholesterol",
    sodium: "Sodium",
    totCarbohydrates: "Total Carbohydrates",
    dietaryFiber: "Fiber",
    sugars: "Sugars",
    addedSugars: "Added Sugars",
    protein: "Protein",
    biotin: "Biotin",
    calcium: "Calcium",
    chloride: "Chloride",
    choline: "Choline",
    chromium: "Chromium",
    copper: "Copper",
    folate: "Folate",
    iodine: "Iodine",
    iron: "Iron",
    magnesium: "Magnesium",
    manganese: "Manganese",
    molybdenum: "Molybdenum",
    niacin: "Niacin",
    pantothenicAcid: "Pantothenic Acid",
    phosphorus: "Phosphorus",
    potassium: "Potassium",
    riboflavin: "Riboflavin",
    selenium: "Selenium",
    thiamin: "Thiamin",
    vitaminA: "Vitamin A",
    vitaminB6: "Vitamin B6",
    vitaminB12: "Vitamin B12",
    vitaminC: "Vitamin C",
    vitaminD: "Vitamin D",
    vitaminE: "vitamin E",
    vitaminK: "Vitamin K",
    zinc: "Zinc"
}

var recommendedValues = {
    totFat: 78,
    satFat: 20,
    cholesterol: 300,
    sodium: 2300,
    totCarbohydrates: 275,
    dietaryFiber: 28,
    addedSugars: 50,
    protein: 50,
    biotin: 30,
    calcium: 1300,
    chloride: 2300,
    choline: 550,
    chromium: 35,
    copper: 0.9,
    folate: 400,
    iodine: 150,
    iron: 18,
    magnesium: 420,
    manganese: 2.3,
    molybdenum: 45,
    niacin: 16,
    pantothenicAcid: 5,
    phosphorus: 1250,
    potassium: 4700,
    riboflavin: 1.3,
    selenium: 55,
    thiamin: 1.2,
    vitaminA: 900,
    vitaminB6: 1.7,
    vitaminB12: 2.4,
    vitaminC: 90,
    vitaminD: 20,
    vitaminE: 15,
    zinc: 11
}