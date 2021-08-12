/**
 * Takes care of autocomplete items
 * @param inp The text field element
 * @param arr The list of possible autocomplete items
 */
function autoComplete(inp, arr) {
    // The element containing the autocompleted lists
    const activeElements = document.createElement("DIV");
    // Configure the activeElements
    activeElements.setAttribute("id", "autocomplete-list");
    activeElements.setAttribute("class", "autocomplete-items");
    // Append that element as a child of the autocomplete container 
    inp.parentElement?.appendChild(activeElements);
    // Index of the current item focused on
    var currentFocus;
    // Execute a function when someone writes in the text field
    inp.addEventListener("input", function (e) {
        // Construct the searchQuery
        let searchQuery = new RegExp(this.value.toLowerCase(), 'g');
        // Close any already open lists of autocompleted values
        closeAllLists();
        // If there is no search query, don't show results
        if (this.value == "")
            return false;
        currentFocus = -1;
        let tempList = Array.from(arr);
        let searchMatchesBegin = [];
        let searchMatchesRandom = [];
        // For each item in the tempListay...
        for (let i = 0; i < tempList.length; i++) {
            // Search through the entire string for the input value
            let temp = tempList[i].toLowerCase().matchAll(searchQuery);
            let matches = [];
            let b = temp.next();
            while (!b.done) {
                matches.push(b.value.index ?? 0);
                b = temp.next();
            }
            if (matches.length > 0) {
                for (let j = 0; j < matches.length; j++) {
                    if (matches[j] == 0 || tempList[i])
                        ;
                }
            }
        }
    });
    // Call a function when someone presses a key on the keyboard
    inp.addEventListener("keydown", function (e) {
        if (activeElements.firstChild) {
            if (e.code == "ArrowDown") {
                // DOWN key, increase focus
                removeActive();
                currentFocus++;
                addActive();
            }
            else if (e.code == "ArrowUp") {
                // UP key, decrease focus
                removeActive();
                currentFocus--;
                addActive();
            }
            else if (e.code == "Enter" || e.code == "NumpadEnter") {
                // ENTER key, prevent form being submitted
                e.preventDefault();
                // And update the input field if needed
                if (currentFocus > -1) {
                    inp.value = activeElements.getElementsByTagName("div")[currentFocus].getElementsByTagName("input")[0].value;
                    // CLose the lists of autocompleted values
                    closeAllLists();
                }
            }
        }
    });
    function addSearchDiv(resultObj) {
        // Create a DIV element for the matching search
        let a = document.createElement("DIV");
        a.innerHTML = "";
        // Make the matching letters bold
        let cursor = 0;
        for (let j = 0; j < matches.length; j++) {
            a.innerHTML += tempList[i].slice(cursor, matches[j]) + "<strong>" + tempList[i].substr(matches[j], this.value.length) + "</strong>";
            cursor = matches[j] + this.value.length;
        }
        // Add the remaining part of the strign
        a.innerHTML += tempList[i].substr(cursor);
        // Insert a hidden input field that will hold the current array item's value
        a.innerHTML += "<input type='hidden' value='" + tempList[i] + "'>";
        // Call a function when someoen clicks on this DIV element
        a.addEventListener("click", function (e) {
            // Insert the value fo rthe autocomplete text field
            inp.value = this.getElementsByTagName("input")[0].value;
            // CLose the lists of autocompleted values
            closeAllLists();
        });
        activeElements.appendChild(a);
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
        if (currentFocus >= eles.length)
            currentFocus = 0;
        if (currentFocus < 0)
            currentFocus = eles.length - 1;
        // Add the active class "autocomplete-active"
        eles[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive() {
        activeElements.getElementsByTagName("DIV")[currentFocus].classList.remove("autocomplete-active");
    }
}
