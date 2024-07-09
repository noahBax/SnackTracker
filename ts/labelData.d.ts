export type Measurement = [number, string]

export enum MeasurementUnits {
    g = 1,
    kcal,
    mg,
    RE,
    IU,
    cup,
    ounce,
    oz,
    half,
    plate,
    floz,
    slice,
    each,
    tbsp,
    wedge,
    piece,
    tsp,
    ladle2oz,
    ladle4oz,
    ladle6oz,
    serving,
    sandwich,
    ladle8oz
}

export interface Fats {
    totFat: Measurement,
    transFat?: Measurement,
    satFat?: Measurement,
    polyUnsaturatedFat?: Measurement,
    monoUnsaturatedFat?: Measurement
}

export interface Carbohydrates {
    totCarbohydrates: Measurement,
    dietaryFiber?: Measurement,
    sugars?: Measurement,
    addedSugars?: Measurement
}

export interface BVitamins {
    biotin_B7?: Measurement,
    cobalamin_B12?: Measurement,
    folate_B9?: Measurement,
    niacin_B3?: Measurement,
    pantothenicAcid_B5?: Measurement,
    pyridoxine_B6?: Measurement,
    riboflavin_B2?: Measurement,
    thiamin_B1?: Measurement
}

export interface Vitamins {
    bVitamins?: BVitamins
    vitaminA?: Measurement,
    vitaminC?: Measurement,
    vitaminD?: Measurement,
    vitaminE?: Measurement,
    vitaminK?: Measurement
}

export interface Minerals {
    calcium?: Measurement
    chloride?: Measurement
    chromium?: Measurement
    copper?: Measurement
    fluoride?: Measurement
    iodine?: Measurement
    iron?: Measurement
    magnesium?: Measurement
    manganese?: Measurement
    molybdenum?: Measurement
    phosphorus?: Measurement
    potassium?: Measurement
    sodium: Measurement
    zinc?: Measurement
    choline?: Measurement
    selenium?: Measurement
}

export interface Nutrients {
    fats?: Fats,
    cholesterol?: Measurement,
    sodium: Measurement,
    carbohydrates: Carbohydrates,
    protein: Measurement,
    vitamins: Vitamins
    minerals: Minerals
}

export interface NutrientInfo {
    name: string,
    brand: string,
    databaseId: number,
    servingSize: Measurement,
    calories: number,
    ingedients: string[],
    dateAdded: Date,
    brandIdentifier: string | number,
    labels: number[],
    allergens: number[],
    nutrients: Nutrients
}

export interface Storage {
    Ingredients: string[],
    Allergens: string[],
    Labels: string[],
    data: NutrientInfo[],
    nameList: string[]
}