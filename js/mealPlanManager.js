const MEALHISTORYOBJECT = "mealHistoryObject";
class MealPlanManager {
    static init() {
        localforage.getItem(MEALHISTORYOBJECT).then(item => {
            MealPlanManager.mealHistory = item ?? [];
        }).catch(error => {
            console.error("MealPlanManager failed to initialize: ", error);
        });
    }
    static addMealInstance(nutritionLabel, mealTime) {
        MealPlanManager.mealHistory.push({
            dataBaseId: nutritionLabel.dataBaseId,
            timeSubmitted: Date.now(),
            timeEaten: mealTime.getTime()
        });
    }
    static fetchDay(day) {
        day = day ?? new Date();
        // Make it the end of the day
        day.setHours(23);
        day.setMinutes(59);
        day.setSeconds(59);
        // It might do us handy to separate everything out into months
        // This would make downloading the database of entries easier and would lessen the sifting load
        let mealHistory = MealPlanManager.mealHistory;
        let currentIndex = mealHistory.length - 1;
        while (day.getTime() - mealHistory[currentIndex].timeEaten < 0 && currentIndex > -1) {
            currentIndex--;
        }
        // Walk back to get to the date
        if (currentIndex == -1) { }
    }
}
MealPlanManager.mealHistory = [];
var times;
(function (times) {
    times[times["breakfast"] = 0] = "breakfast";
    times[times["lunch"] = 1] = "lunch";
    times[times["dinner"] = 2] = "dinner";
    times[times["earlymorning"] = 3] = "earlymorning";
    times[times["morning"] = 4] = "morning";
    times[times["afternoon"] = 5] = "afternoon";
    times[times["evening"] = 6] = "evening";
})(times || (times = {}));
