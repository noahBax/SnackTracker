var nutList = [];
var nameListIIT = [];
function addIITCommonsData(dataAdded) {
    var placeList = dataAdded.menu.periods.categories;
    function convertToNum(item) {
        if (item.includes("+")) {
            item = item.substr(0, item.length - 1);
        }
        if (item.indexOf("/") != -1) {
            let temp = item.split("/");
            return parseInt(temp[0]) / parseInt(temp[1]);
        }
        else {
            return parseFloat(item);
        }
    }
    function buildMeas(item, meas) {
        return [convertToNum(item), meas];
    }
    let names = new Set();
    for (let i = 0; i < placeList.length; i++) {
        for (let j = 0; j < placeList[i].items.length; j++) {
            let food = placeList[i].items[j];
            let label = {};
            // Serving size
            {
                let starting = food.portion.split(" ");
                starting[0] = convertToNum(starting[0]);
                if (starting[1] == "floz") {
                    starting[1] = "fl oz";
                }
                if (starting[1] == "ounce") {
                    starting[1] = "oz";
                }
                if (starting.length == 4) {
                    starting[1] = "bar";
                }
                starting = [starting[0], starting[1]];
                label.servingSize = starting;
            }
            label.calories = food.calories;
            // Name
            let nameArray = food.name.trim().split(" ");
            nameArray = nameArray.map(word => {
                if (!["with", "in", "de", "and"].includes(word)) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                return word;
            });
            label.name = nameArray.join(" ");
            // Date Added
            let dateArray = dataAdded.menu.date.split("-");
            let tempDate = new Date();
            tempDate.setMonth(parseInt(dateArray[1]));
            tempDate.setFullYear(parseInt(dateArray[0]));
            tempDate.setDate(parseInt(dateArray[2]));
            label.dateAdded = tempDate;
            label.ingedients = food.ingredients.split(",").map(item => item.trim());
            label.nutrients = {};
            label.brand = "IIT Dining";
            label.brandIdentifier = food.mrn;
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
                            label.nutrients.vitaminD = [temp * 0.025, "mcg"];
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
                else {
                    if (duplicateFoods[nameListIIT[i]] == undefined) {
                        duplicateFoods[nameListIIT[i]] = [database2[nameList2.indexOf(nameListIIT[i])]];
                    }
                    let contained = false;
                    for (let j = 0; j < duplicateFoods[nameListIIT[i]].length; j++) {
                        if (duplicateFoods[nameListIIT[i]][j].brandIdentifier == nutList[i].brandIdentifier) {
                            contained = true;
                        }
                    }
                    if (!contained) {
                        database2.push(nutList[i]);
                        nameList2.push(nameListIIT[i]);
                        added++;
                    }
                    duplicateFoods[nameListIIT[i]].push(nutList[i]);
                }
            }
            console.log(duplicateFoods);
            console.log("Added", added);
            localforage.setItem('nameList', nameList2);
            localforage.setItem('database', database2);
        });
    });
    function displayDate(date) {
        return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
    }
    function areEqual(nut1, nut2) {
        return (nut1.name == nut2.name && nut1.servingSize[0] == nut2.servingSize[0] && nut1.servingSize[1] == nut2.servingSize[1] && nut1.calories == nut2.calories && nut1.ingedients.toString() == nut2.ingedients.toString());
    }
}
let duplicateFoods = {};
