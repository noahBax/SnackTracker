// Todo: Test out a mock nutrition label with the added "nutrtion-label element", you will need to make a nutrition object first
//  Todo: Complete the nutrition label test by making a fulll label
/*
a = new NutritionLabel(mockLabel)
document.body.appendChild(a)
*/
// Todo: Make it so that the nutrition label for each item pops up when it is selected
// Todo: Make it so that selecting the question-div pops up a form which can be filled in in the shape of a nutrition label
// I suggest doing this by actually making an HTML version of the form that pops up every time though who knows

const QUESTION_VALUE = "question_value";

/**
 * Takes care of autocomplete items
 * @param inp The text field element
 * @param arr The list of possible autocomplete items
 */
function autoComplete(inp: HTMLInputElement, arr: string[]) {
    
    // The element containing the autocompleted lists
    const activeElements: HTMLElement = document.createElement("DIV");
    // Configure the activeElements
    activeElements.setAttribute("id","autocomplete-list");
    activeElements.setAttribute("class", "autocomplete-items")
    // Append that element as a child of the autocomplete container 
    inp.parentElement?.appendChild(activeElements);
    // Index of the current item focused on
    var currentFocus: number;

    // Execute a function when someone writes in the text field
    inp.addEventListener("input", function (e) {

        
        // Construct the searchQuery
        let searchQuery = new RegExp(this.value.toLowerCase(), 'g');
        
        // Close any already open lists of autocompleted values
        closeAllLists();
        
        // If there is no search query, don't show results
        if (this.value == "") return false;

        currentFocus = 0;
        let exactMatch: [string, number[]] | null = null;
        let searchMatchesBegin: [string, number[]][] = []; // query item, indexes
        let searchMatchesRandom: [string, number[]][] = [];

        // For each item in the tempListay...
        for (let i = 0; i < arr.length; i++) {
            // Search through the entire string for the input value
            let temp = arr[i].toLowerCase().matchAll(searchQuery);
            let matches: number[] = [];
            let b = temp.next();
            while (!b.done) {
                matches.push(b.value.index ?? 0);
                b = temp.next();
            }

            if (matches.length > 0) {
                let found = false;
                for (let j = 0; j < matches.length; j++) {
                    if (matches[j] == 0 || arr[i][matches[j] - 1] == " ") {
                        found = true;
                        break;
                    }
                }
                if (this.value == arr[i]) {
                    exactMatch = [arr[i],matches];
                }
                if (found) {
                    searchMatchesBegin.push([arr[i],matches]);
                } else {
                    searchMatchesRandom.push([arr[i],matches]);
                }
            }
        }

        // If there are no results, cancel
        if (searchMatchesRandom.length == 0 && searchMatchesBegin.length == 0 && exactMatch == null) {
            addQuestionDiv();
            addActive();
            return false;
        }
        
        if (exactMatch != null) addSearchDiv(exactMatch[0], exactMatch[1]);

        for (let i = 0; i < searchMatchesBegin.length; i++) {
            addSearchDiv(searchMatchesBegin[i][0], searchMatchesBegin[i][1]);
        }
        for (let i = 0; i < searchMatchesRandom.length; i++) {
            addSearchDiv(searchMatchesRandom[i][0], searchMatchesRandom[i][1]);
        }

        addActive();
    });

    // Call a function when someone presses a key on the keyboard
    inp.addEventListener("keydown", function (e) {
        if (activeElements.firstChild) {
            if (e.code == "ArrowDown") {
                e.preventDefault();
                // DOWN key, increase focus
                removeActive();
                currentFocus++;
                addActive();
            } else if (e.code == "ArrowUp") {
                e.preventDefault();
                // UP key, decrease focus
                removeActive();
                currentFocus--;
                addActive();
            } else if (e.code == "Enter" || e.code == "NumpadEnter") {
                // ENTER key, prevent form being submitted
                e.preventDefault();

                // And update the input field if needed
                if (currentFocus > -1) {
                    let entry = activeElements.getElementsByTagName("div")[currentFocus].getElementsByTagName("input")[0].value;
                    if (entry == QUESTION_VALUE) {
                        questionClicked();
                    } else {
                        inp.value = activeElements.getElementsByTagName("div")[currentFocus].getElementsByTagName("input")[0].value;
                    }
                    
                    // CLose the lists of autocompleted values
                    closeAllLists();
                }
            }
         }
    });

    function addSearchDiv(item: string, matches: number[]) {

        // Create a DIV element for the matching search
        let a = document.createElement("DIV");
        a.innerHTML = "";
        // Make the matching letters bold
        let cursor = 0;
        for (let j = 0; j < matches.length; j++) {
            a.innerHTML += item.slice(cursor,matches[j]) + "<strong>" + item.substr(matches[j], inp.value.length) + "</strong>";
            cursor = matches[j] + inp.value.length;
        }
        // Add the remaining part of the strign
        a.innerHTML += item.substr(cursor);

        // Insert a hidden input field that will hold the current array item's value
        a.innerHTML += "<input type='hidden' value='" + item + "'>";

        // Call a function when someoen clicks on this DIV element
        a.addEventListener("click", function (e) {
            // Insert the value fo rthe autocomplete text field
            inp.value = item;
            
            // CLose the lists of autocompleted values
            closeAllLists();
        });
        activeElements.appendChild(a);
    }

    function addQuestionDiv() {
        
        let a = document.createElement("DIV");
        a.innerHTML = "<i>Not in database, add an entry?</i>";
        
        // Insert a hidden input field that will hold the current array item's value
        a.innerHTML += "<input type='hidden' value='" + QUESTION_VALUE + "'>";

        a.classList.add("question-div");
        a.addEventListener("click", function (e) {
            questionClicked();
        });

        activeElements.appendChild(a);
    }

    function questionClicked() {
        console.warn("Function 'questionClicked' not implemented yet");
    }

    
    /**
     * Close all autocompleted list items
     */
    function closeAllLists() {
        while (activeElements.lastChild) {
            activeElements.removeChild(activeElements.lastChild);
        }
    }

    function addActive() {
        let eles = activeElements.getElementsByTagName("DIV");
        if (currentFocus >= eles.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = eles.length -1;

        // Add the active class "autocomplete-active"
        eles[currentFocus].classList.add("autocomplete-active");
    }
    
    function removeActive() {
        activeElements.getElementsByTagName("DIV")[currentFocus].classList.remove("autocomplete-active");
    }
}
type Measurement = [number, string]

var mockLabel: NutrientInfo;
    mockLabel = {
    servingSize: [5,"cups"],
    calories: 500,
    nutrients: {
        fats: {
            totFat: [5, "oz"]
        },
        cholesterol: [7,"oz"],
        sodium: [5,"g"],
        carbohydrates: {
            totCarbohydrates: [70,"g"]
        },
        protein: [50,"g"]
    }
}

interface NutrientInfo {
    servingSize: Measurement,
    calories: number,
    nutrients: {
        fats: {
            totFat: Measurement,
            transFat?: Measurement,
            satFat?: Measurement,
            polyUnsaturadedFat?: Measurement,
            monoUnsaturatedFat?: Measurement
        }
        cholesterol?: Measurement,
        sodium: Measurement,
        carbohydrates: {
            totCarbohydrates: Measurement,
            dietaryFiber?: Measurement,
            sugars?: Measurement,
            addedSugars?: Measurement
        },
        protein: Measurement,
        biotin?: Measurement,
        calcium?: Measurement,
        chloride?: Measurement,
        choline?: Measurement,
        chromium?: Measurement,
        copper?: Measurement,
        folate?: Measurement,
        iodine?: Measurement,
        iron?: Measurement,
        magnesium?: Measurement,
        manganese?: Measurement,
        molybdenum?: Measurement,
        niacin?: Measurement,
        pantothenicAcid?: Measurement,
        phosphorus?: Measurement,
        potassium?: Measurement,
        riboflavin?: Measurement,
        selenium?: Measurement,
        thiamin?: Measurement,
        vitaminA?: Measurement,
        vitaminB6?: Measurement,
        vitaminB12?: Measurement,
        vitaminC?: Measurement,
        vitaminD?: Measurement,
        vitaminE?: Measurement,
        vitaminK?: Measurement,
        zinc?: Measurement
    }
}
// nutritionLabel: NutritionLabel = {
//     servingSize: 277,
//     calories: 280,
//     nutrients: {
//         fat: 9,
//         satFat: 4.5,
//         tranFat: 0,
//         cholesterol: 35,
//         sodium: 850,
//         totCarbs: 34,
//         dietFiber: 4,
//         totSugars: 6,
//         addSugars: 0,
//         protein: 15,
//         vitaminD: 0,
//         calcium: 320,
//         iron: 1.6,
//         potassium: 510
//     }
// }