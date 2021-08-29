var nutList: NutrientInfo[] = [];
var nameListIIT: string[] = [];
function addIITCommonsData(dataAdded) {
    var placeList = dataAdded.menu.periods.categories;

    function convertToNum(item: string): number {
        if (item.includes("+")) {
            item = item.substr(0,item.length - 1)
        }
        if (item.indexOf("/") != -1) {
            let temp = item.split("/");
            return parseInt(temp[0]) / parseInt(temp[1]);
        } else {
            return parseFloat(item);
        }
        
    }

    function buildMeas(item: string, meas: string): Measurement {
        return [convertToNum(item), meas];
    }
    let names = new Set();
    for (let i = 0; i < placeList.length; i++) {
        for (let j = 0; j < placeList[i].items.length; j++) {
            let food = placeList[i].items[j];
            let label: any = {};
            // Serving size
            {
                let starting = food.portion.split(" ");
                starting[0] = convertToNum(starting[0]);

                if (starting[1] == "floz") {
                    starting[1] = "fl oz";
                }
                label.servingSize = starting;
            }
            label.calories = food.calories;
            label.name = food.name.trim();
            label.ingedients = food.ingredients.split(",").map(item => item.trim());
            label.nutrients = {};
            label.brand = "IIT Dining";
            let nutrients = label.nutrients;
            nutrients.fats = {};
            nutrients.carbohydrates = {};
            for (let k = 0; k < food.nutrients.length; k++) {
                let info = food.nutrients[k];
                names.add(info.name);
                if (info.value != "0" && info.value != "-" && info.value != "0+" && !info.value.includes("less")) {
                    switch (info.name) {
                        case "Total Fat (g)":
                            label.nutrients.fats.totFat = [convertToNum(info.value), "g"];
                            break;
                        case "Trans Fat (g)":
                            label.nutrients.fats.transFat = buildMeas(info.value, "g");
                            break;
                        case "Saturated Fat (g)":
                            label.nutrients.fats.satFat = buildMeas(info.value, "g");
                            break;
                        case "Cholesterol (mg)":
                            label.nutrients.cholesterol = buildMeas(info.value, "mg");
                            break;
                        case "Sodium (mg)":
                            label.nutrients.sodium = buildMeas(info.value, "mg");
                            break;
                        case "Total Carbohydrates (g)":
                            label.nutrients.carbohydrates.totCarbohydrates = buildMeas(info.value, "g");
                            break;
                        case "Dietary Fiber (g)":
                            label.nutrients.carbohydrates.dietaryFiber = buildMeas(info.value, "g");
                            break;
                        case "Sugar (g)":
                            label.nutrients.carbohydrates.sugars = buildMeas(info.value, "g");
                            break;
                        case "Protein (g)":
                            label.nutrients.protein = buildMeas(info.value, "g");
                            break;
                        case "Potassium (mg)":
                            label.nutrients.potassium = buildMeas(info.value, "mg");
                            break;
                        case "Calcium (mg)":
                            label.nutrients.calcium = buildMeas(info.value, "mg");
                            break;
                        case "Iron (mg)":
                            label.nutrients.iron = buildMeas(info.value, "mg");
                            break;
                        case "Vitamin D (IU)":
                            let temp = convertToNum(info.value);
                            label.nutrients.vitaminD = [temp*0.025, "mcg"];
                            break;
                        case "Vitamin C (mg)":
                            label.nutrients.vitaminC = buildMeas(info.value, "mg");
                            break;
                        case "Vitamin A (RE)":
                            label.nutrients.vitaminA = buildMeas(info.value, "mcg RAE");
                            break;
                        default:
                    }
                }

            }
            if (typeof label.nutrients.fats.totFat == "undefined") {
                label.nutrients.fats.totFat = [0, 'g'];
            }
            if (typeof label.nutrients.sodium == "undefined") {
                label.nutrients.sodium = [0, 'mg'];
            }
            if (typeof label.nutrients.carbohydrates.totCarbohydrates == "undefined") {
                label.nutrients.carbohydrates.totCarbohydrates = [0, 'g'];
            }
            if (typeof label.nutrients.protein == "undefined") {
                label.nutrients.protein = [0, 'g'];
            }
            nutList.push(label);
            nameListIIT.push(label.name);
        }
    }
}
function pushToDatabase() {
    var added = 0;
    localforage.getItem('nameList').then(nameList2 => {
        localforage.getItem('database').then(database2 => {
            if (database2 == null) {
                database2 = [];
                nameList2 = [];
            }
            for (let i = 0; i < nameListIIT.length; i++) {
                if (!nameList2.includes(nameListIIT[i])) {
                    database2.push(nutList[i]);
                    nameList2.push(nameListIIT[i]);
                    added++;
                }
            }
            console.log("Added",added);
            localforage.setItem('nameList', nameList2);
            localforage.setItem('database', database2)
        });
    });
}