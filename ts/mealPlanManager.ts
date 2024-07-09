const MEALHISTORYOBJECT = "mealHistoryObject";

class MealPlanManager {
    static mealHistory: mealInstance[] = [];

    static init() {
        localforage.getItem(MEALHISTORYOBJECT).then(item => {
            MealPlanManager.mealHistory = item ?? [];
        }).catch(error => {
            console.error("MealPlanManager failed to initialize: ", error);
        });
    }

    static addMealInstance(nutritionLabel: NutrientInfo, mealTime: Date) {
        MealPlanManager.mealHistory.push({
            dataBaseId: nutritionLabel.databaseId,
            timeSubmitted: Date.now(),
            timeEaten: mealTime.getTime()
        });
    }

    static fetchDay(day?: Date): mealInstance[] {
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

        if (currentIndex == -1) {}
    }
}

type mealInstance = {
    dataBaseId: number,
    timeSubmitted: number,
    timeEaten: number
}

enum times {
    breakfast,
    lunch,
    dinner,
    earlymorning,
    morning,
    afternoon,
    evening
}