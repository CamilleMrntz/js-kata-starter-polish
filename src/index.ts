import { object } from "fast-check";

const operators: Record<string, Function> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  MOD: (a, b) => a % b,
  NEGATE: (a) => -a,
};


export function stringToArray(str: string) {
  return str.split(' ');
}


export function arrayToLittleArray(arr: string[]) {
  const stack: number[] = [];
  var operator: string = '';
  var elementToRemove: number = 0;
  let numberOfElementsToRemove: number = 0;
  let negate: boolean = false;

  for (var i: number = 1; i < arr.length; i++) {
    if (arr[i] in operators) {
      stack.push(parseInt(arr[i-2]));
      stack.push(parseInt(arr[i-1]));
      if (arr[i] == 'NEGATE') {
        operator = arr[i+1];
        numberOfElementsToRemove= 4;
        negate = true;
      } else {
        operator = arr[i];
        numberOfElementsToRemove = 3;
      }
      elementToRemove = i - 2;
      arr.splice(elementToRemove, numberOfElementsToRemove);
      break;
    }
  }
  return { stack, operator, arr, elementToRemove, negate };
}


export function calcul(arr: number[], operator: string, negate: boolean) {
  var result: number = 0;
  if (operator in operators) {
    if (negate) {
        arr[1] = -arr[1];
    }
    if (operator === '/') {
        if (arr[1] === 0) {
            throw new Error('Division par zero');
        }
    }
    result = operators[operator](arr[0], arr[1]);
  } else {
    return "Operateur non pris en charge";
  }
  return result;
};


export function insertNewNumber(bigArray: string[], newNumber: number, placeOfTheNewNumber: number) {
  bigArray.splice(placeOfTheNewNumber, 0, newNumber.toString());
  return bigArray;
};


export function superFonctionQuiFaitLeCalcul(str: string) {
  var bigArray: string[] = stringToArray(str);
  while(bigArray.length > 1) {
    var operationToDo = arrayToLittleArray(bigArray);
    var result: any = calcul(operationToDo.stack, operationToDo.operator, operationToDo.negate);
    bigArray = insertNewNumber(operationToDo.arr, result, operationToDo.elementToRemove);
  }
  return parseInt(bigArray[0]);
};