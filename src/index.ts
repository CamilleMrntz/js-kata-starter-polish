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

  for (var i: number = 1; i < arr.length; i++) {
    if (arr[i] in operators) {
      stack.push(parseInt(arr[i-2]));
      stack.push(parseInt(arr[i-1]));
      operator = arr[i];
      elementToRemove = i - 2;
      const numberOfElementsToRemove: number = 3;
      arr.splice(elementToRemove, numberOfElementsToRemove);
      break;
    }
  }
  return { stack, operator, arr, elementToRemove };
}


export function calcul(arr: number[], operator: string) {
  var result: number = 0;
  if (operator in operators) {
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
    var result: any = calcul(operationToDo.stack, operationToDo.operator);
    bigArray = insertNewNumber(operationToDo.arr, result, operationToDo.elementToRemove);
  }
  return parseInt(bigArray[0]);
};