import { object } from "fast-check";

const operators: Record<string, Function> = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  MOD: (a, b) => a % b,
};

// Transform the expression given to an array of string
export function stringToArray(str: string) {
  if (str.match(/^[A-Za-z]/)) {
    throw new Error("Ce doit être un nombre");
  } else {
    return str.split(" ");
  }
}

// Create a little array with the numbers to operate with
// take those numbers out of the big array
export function isolateOneOperation(arr: string[]) {
  const stack: number[] = [];
  let operator: string = "";
  let elementToRemove: number = 0;
  let numberOfElementsToRemove: number = 0;

  for (let i: number = 1; i < arr.length; i++) {
    if (arr[i] in operators) {
      if (parseInt(arr[i - 1]) < 0 || parseInt(arr[i - 2]) < 0) {
        throw new Error("Les chiffres négatifs ne sont pas acceptés");
      }

      operator = arr[i];

      if (arr[i - 1] == "NEGATE" && arr[i - 3] == "NEGATE") {
        elementToRemove = i - 4;
        numberOfElementsToRemove = 5;
        stack.push(-parseInt(arr[i - 4]));
        stack.push(-parseInt(arr[i - 2]));
      } else if (arr[i - 1] == "NEGATE" && arr[i - 3] != "NEGATE") {
        elementToRemove = i - 3;
        numberOfElementsToRemove = 4;
        stack.push(parseInt(arr[i - 3]));
        stack.push(-parseInt(arr[i - 2]));
      } else if (arr[i - 2] == "NEGATE") {
        elementToRemove = i - 3;
        numberOfElementsToRemove = 4;
        stack.push(-parseInt(arr[i - 3]));
        stack.push(parseInt(arr[i - 1]));
      } else {
        elementToRemove = i - 2;
        numberOfElementsToRemove = 3;
        stack.push(parseInt(arr[i - 2]));
        stack.push(parseInt(arr[i - 1]));
      }

      arr.splice(elementToRemove, numberOfElementsToRemove);
      break;
    }
  }
  return { stack, operator, arr, elementToRemove };
}

// Do the little calcul
export function calcul(arr: number[], operator: string) {
  let resultToPush: number = 0;
  let result: string[] = [];
  if (operator in operators) {
    if (operator === "/") {
      if (arr[1] === 0) {
        throw new Error("Division par zero");
      }
    }
    resultToPush = operators[operator](arr[0], arr[1]);
    result.push(Math.abs(resultToPush).toString());
    if (resultToPush < 0) {
      result.push("NEGATE");
    }
  } else {
    throw new Error("Operateur non pris en charge");
  }

  return result;
}

// Put the result of the little calcul inside of the big array
export function insertNewNumber(bigArray: string[], newNumber: string[], placeOfTheNewNumber: number) {
  bigArray.splice(placeOfTheNewNumber, 0, newNumber[0].toString());
  if (newNumber[1] == "NEGATE") {
    bigArray.splice(placeOfTheNewNumber + 1, 0, newNumber[1].toString());
  }
  return bigArray;
}

// Operate the full calcul
export function expressionToCalculate(str: string) {
  let finalResult = 0;
  let bigArray: string[] = stringToArray(str);

  if (bigArray.length == 2) {
    finalResult = -parseInt(bigArray[0]);
    return finalResult;
  }

  while (bigArray.length > 2) {
    let operationToDo = isolateOneOperation(bigArray);
    let result: any[] = calcul(operationToDo.stack, operationToDo.operator);
    bigArray = insertNewNumber(operationToDo.arr, result, operationToDo.elementToRemove);
    if (bigArray.length == 2) {
      finalResult = -parseInt(bigArray[0]);
      return finalResult;
    }
  }

  finalResult = parseInt(bigArray[0]);

  return finalResult;
}
