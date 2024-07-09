from datetime import datetime
import json
from sre_constants import IN
from typing import Optional, TypedDict
import urllib.request
from enum import Enum, auto

# Last date added was 5/9/2022

# Get the webpage
page = urllib.request.urlopen("""
https://api.dineoncampus.com/v1/location/5b10d972f3eeb60909e01489/periods/6280a615b63f1e12d60c7dd0?platform=0&date=2022-5-9
""")
read = json.loads(page.read())

currentRegistry = []
names = set()


class MeasurementUnits(int, Enum):
    g = auto()
    kcal = auto()
    mg = auto()
    RE = auto()
    IU = auto()
    cup = auto()
    ounce = auto()
    oz = auto()
    half = auto()
    plate = auto()
    floz = auto()
    slice = auto()
    each = auto()
    tbsp = auto()
    wedge = auto()
    piece = auto()
    tsp = auto()
    ladle2oz = auto()
    ladle4oz = auto()
    ladle6oz = auto()
    serving = auto()
    sandwich = auto()
    ladle8oz = auto()

def matchMeasurement(input: list[str]) -> MeasurementUnits:
    if len(input) == 2:
        if input[0] == 'oz' and input[1] == 'portion':
            return MeasurementUnits.oz
        if input[0] == 'oz' and input[1] == 'meat':
            return MeasurementUnits.oz
    if len(input) == 1:
        match input[0]:
            case 'piece' | '2-1/2"x3"' | '4"x3"':
                return MeasurementUnits.piece
            case 'cup':     return MeasurementUnits.cup
            case 'each':    return MeasurementUnits.each
            case 'plate':   return MeasurementUnits.plate
            case 'floz':    return MeasurementUnits.floz
            case 'tbsp':    return MeasurementUnits.tbsp
            case 'wedge':   return MeasurementUnits.wedge
            case 'slice' | '1/14th' | '1/8th' | '1/10th':
                return MeasurementUnits.slice
            case 'half':    return MeasurementUnits.half
            case 'each':    return MeasurementUnits.each
            case 'tsp':     return MeasurementUnits.tsp
            case 'ladle-2oz': return MeasurementUnits.ladle2oz
            case 'ladle-4oz': return MeasurementUnits.ladle4oz
            case 'ladle-6oz': return MeasurementUnits.ladle6oz
            case 'ladle-8oz': return MeasurementUnits.ladle8oz
            case 'serving(s)': return MeasurementUnits.serving
            case 'sandwich': return MeasurementUnits.sandwich
            # Now onto the nutrient measurements
            case 'g':       return MeasurementUnits.g
            case 'mg':      return MeasurementUnits.mg
            case 'RE':      return MeasurementUnits.RE
            case 'IU':      return MeasurementUnits.IU
            case 'ounce':   return MeasurementUnits.ounce
            case 'oz':      return MeasurementUnits.oz
    if len(input) == 3:
        if input in [['2"', 'x', '3"'], ['2"', 'x', '2"']]:
            return MeasurementUnits.piece
    raise Exception('Measurement Mismatch: "' + str(input[0:]) +  '" does not match any known measurements')
    
    
Measurement = tuple[float, MeasurementUnits]

ignored = ['Calories', 'Calories From Fat', 'Saturated Fat + Trans Fat (g)']

b = []

class Fats(TypedDict):
    totFat: Measurement
    transFat: Optional[Measurement]
    satFat: Optional[Measurement]
    polyUnsaturatedFat: Optional[Measurement]
    monoUnsaturatedFat: Optional[Measurement]

class Carbohydrates(TypedDict):
    dietaryFiber: Optional[Measurement]
    totCarboydrates: Measurement
    sugars: Optional[Measurement]
    addedSugars: Optional[Measurement]

class BVitamins(TypedDict):
    biotin_B7: Optional[Measurement]
    cobalamin_B12: Optional[Measurement]
    folate_B9: Optional[Measurement]
    niacin_B3: Optional[Measurement]
    pantothenicAcid_B5: Optional[Measurement]
    pyridoxine_B6: Optional[Measurement]
    riboflavin_B2: Optional[Measurement]
    thiamin_B1: Optional[Measurement]

class Minerals(TypedDict):
    calcium: Optional[Measurement]
    chloride: Optional[Measurement]
    chromium: Optional[Measurement]
    copper: Optional[Measurement]
    fluoride: Optional[Measurement]
    iodine: Optional[Measurement]
    iron: Optional[Measurement]
    magnesium: Optional[Measurement]
    manganese: Optional[Measurement]
    molybdenum: Optional[Measurement]
    phosphorus: Optional[Measurement]
    potassium: Optional[Measurement]
    zinc: Optional[Measurement]
    choline: Optional[Measurement]
    selenium: Optional[Measurement]
    
class Vitamins(TypedDict):
    bVitamins: BVitamins
    vitaminA: Optional[Measurement]
    vitaminC: Optional[Measurement]
    vitaminD: Optional[Measurement]
    vitaminE: Optional[Measurement]
    vitaminK: Optional[Measurement]

class Nutrients(TypedDict):
    fats: Optional[Fats]
    cholesterol: Optional[Measurement]
    sodium: Optional[Measurement]
    carbohydrates: Optional[Carbohydrates]
    protein: Optional[Measurement]
    vitamins: Optional[Vitamins]
    minerals: Optional[Minerals]

def buildNutrients(nutrientObj: list[dict]) -> Nutrients:
    nutr = {}
    for i in nutrientObj:
        if i['name'] in ignored or i['value_numeric'] == '0' or i['value_numeric'] == '-' or i['value_numeric'] == '0+':
            continue
        measurement = matchMeasurement([i['uom']])
        compString = (i['name'][0: i['name'].index('(' + i['uom'] + ')')]).strip()

        adding: Measurement
        if '+' in i['value_numeric']:
            adding = (float(i['value_numeric'][0:-1]), measurement)
        else:
            adding = (float(i['value_numeric']), measurement)

        objString = ""
        carb = {}
        fats = {}
        mine = {}
        vita = {}
        match compString:
            case 'Protein':
                nutr['protein'] = adding
            case 'Cholesterol':
                nutr['cholesterol'] = adding
            case 'Sodium':
                nutr['sodium'] = adding
            case 'Total Carbohydrates':
                carb['totCarboydrates'] = adding
            case 'Sugar':
                carb['sugars'] = adding
            case 'Total Fat':
                fats['totFat'] = adding
            case 'Saturated Fat':
                fats['satFat'] = adding
            case 'Dietary Fiber':
                carb['dietaryFiber'] = adding
            case 'Potassium':
                mine['potassium'] = adding
            case 'Calcium':
                mine['calcium'] = adding
            case 'Iron':
                mine['iron'] = adding
            case 'Trans Fat':
                fats['transFat'] = adding
            case 'Vitamin D':
                vita['vitaminD'] = adding
            case 'Vitamin C':
                vita['vitaminC'] = adding
            case 'Vitamin A':
                vita['vitaminA'] = adding
            case _:
                raise Exception('Nutrient Mismatch: "' + compString + '" does not match any known nutrients')

        if len(carb.keys()) != 0:
            nutr['carbohydrates'] = carb
        if len(vita.keys()) != 0:
            nutr['vitamins'] = vita
        if len(mine.keys()) != 0:
            nutr['minerals'] = mine
        if len(fats.keys()) != 0:
            nutr['fats'] = fats
    return nutr  # type: ignore



        
class NutrientInfo(TypedDict):
    name: str
    brand: str
    databaseID: int
    servingSize: Measurement
    calories: int
    ingredients: list[int]
    dateAdded: tuple[int, int, int]
    brandIdentifier: int
    nutrients: Nutrients
    allergens: list[int]
    labels: list[int]

# Load the storage file
class MyData(TypedDict):
    Ingredients: list[str]
    Allergens: list[str]
    Labels: list[str]
    StoredIDs: list[int]
    data: list[NutrientInfo]
    nameList: list[str]
file = open('./myData.json', 'r')
storage: MyData = json.loads(file.read())
file.close()

        
ingredientIntersects = 0
alreadyStoredIntersects = 0
newAllergens = 0
newAdded = 0
triedAdding = 0

for i in read['menu']['periods']['categories']:
    for j in i['items']:

        triedAdding += 1
        
        # Don't do work we don't have to
        if int(j['mrn']) in storage['StoredIDs']:
            alreadyStoredIntersects += 1
            continue

        # Date Added
        date = datetime.now()
        dateNow = (int(date.year), int(date.month), int(date.day))

        # Serving Size
        servingAmount = 0
        temp = j['portion'].split(' ')
        if '/' in temp[0]:
            t = temp[0].split('/')
            if '-' in t[0]:
                u = t[0].split('-')
                if len(u) > 2:
                    raise Exception("Serving Size Error: " + str(temp[0]) + " is an awkard phrase")
                t[0] = int(u[0]) + int(u[1])
            servingAmount = float(int(t[0]) / int(t[1]))
        else:
            servingAmount = float(temp[0])
        serving = (servingAmount, matchMeasurement(temp[1:]))

        # Ingredients
        ingredients = []
        temp = j['ingredients'].split(',')
        for k in temp:
            t = k.strip()
            if t in storage['Ingredients']:
                ingredients.append(storage['Ingredients'].index(t))
                ingredientIntersects += 1
            else:
                ingredients.append(len(storage['Ingredients']))
                storage['Ingredients'].append(t)

        # Nutrients
        nutrients = buildNutrients(j['nutrients'])

        # Allergens and labels
        allerg: list[int] = []
        labels: list[int] = []
        for k in j['filters']:
            name = k['name'].lower()
            if '*' in name:
                name = name[0:-1]
            if k['type'] == 'label':
                if name in storage['Labels']:
                    labels.append(storage['Labels'].index(name))
                else:
                    labels.append(len(storage['Labels']))
                    storage['Labels'].append(name)
            elif k['type'] == 'allergen':
                if name in storage['Allergens']:
                    allerg.append(storage['Allergens'].index(name))
                else:
                    allerg.append(len(storage['Allergens']))
                    storage['Allergens'].append(name)
                    newAllergens += 1
            else:
                raise Exception('Filter Mismatch: "' + k['type'] + '" is not an accounted for label')


        item: NutrientInfo = {
            'name': j['name'].strip(),
            'brand': 'IIT Dining Hall',
            'calories': int(j['calories']),
            'databaseID': len(storage['data']),
            'brandIdentifier': int(j['mrn']),
            'nutrients': nutrients,
            'ingredients': ingredients,
            'dateAdded': dateNow,
            'servingSize': serving,
            'allergens': allerg,
            'labels': labels
        }
        storage['data'].append(item)
        storage['StoredIDs'].append(item['brandIdentifier'])
        storage['nameList'].append(item['name'])
        newAdded += 1

print("New Allergens Added:", newAllergens)
print("Ingredient Intersects: ", ingredientIntersects)
print("Already Stored:", alreadyStoredIntersects)
print("Items Available:", triedAdding)
print("Items Added:", newAdded)

file = open('./myData.json', 'w')
file.write(json.dumps(storage))
file.close()
