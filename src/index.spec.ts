// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";
import { stringToArray, isolateOneOperation, calcul, insertNewNumber, expressionToCalculate } from ".";

expect.extend(matchers);

test("A simple test (Jest)", () => {
  expect(1 + 1).toEqual(2);
});

test("Additional matchers (jest-extended)", () => {
  expect([1, 0]).toIncludeSameMembers([0, 1]);
});

test("Property-based testing (fast-check)", () => {
  type Boundaries = {
    min: number;
    max: number;
  };

  const minmax =
    ({ min, max }: Boundaries) =>
    (n: number): number =>
      Math.min(max, Math.max(min, n));

  fc.assert(
    fc.property(fc.integer(), (n): boolean => {
      const result = minmax({ min: 1, max: 10 })(n);
      return 1 <= result && result <= 10;
    })
  );
});

//////////////////////// tests on stringToArray() //////////////////////////

test("Should transform string to array", () => {
  // given
  const str: string = "1 1 +";
  // when
  const arr = stringToArray(str);
  // then
  expect(arr).toEqual(["1", "1", "+"]);
});

test("Should be a number", () => {
  // given
  const str: string = "a b c";
  // then
  expect(() => stringToArray(str)).toThrowError("Ce doit être un nombre");
});

//////////////////////// tests on arrayToLittleArray() //////////////////////////

test("Should create a new array of 2 numbers and give and operator", () => {
  // given
  const bigArray: any[] = ["1", "4", "+", "6", "-"];
  // when
  const operationToDo = isolateOneOperation(bigArray);
  // then
  expect(operationToDo.stack).toEqual([1, 4]);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "-"]);
});

test("Should create a new array of 2 numbers and give and operator", () => {
  // given
  const bigArray: any[] = ["1", "4", "+", "6", "-"];
  // when
  const operationToDo = isolateOneOperation(bigArray);
  // then
  expect(operationToDo.stack).toEqual([1, 4]);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "-"]);
});

test("Should be negate and not -number", () => {
  // given
  const arr: any[] = ["1", "-1", "+"];
  // then
  expect(() => isolateOneOperation(arr)).toThrowError("Les chiffres négatifs ne sont pas acceptés");
});

test("Should handle NEGATE well", () => {
  // given
  const bigArray: any[] = ["1", "NEGATE", "8", "NEGATE", "+", "6", "+"];
  // when
  const operationToDo = isolateOneOperation(bigArray);
  // then
  expect(operationToDo.stack).toEqual([-1, -8]);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "+"]);
});

test("Should handle NEGATE well", () => {
  // given
  const bigArray: any[] = ["1", "8", "NEGATE", "+", "6", "+"];
  // when
  const operationToDo = isolateOneOperation(bigArray);
  // then
  expect(operationToDo.stack).toEqual([1, -8]);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "+"]);
});

test("Should handle NEGATE well", () => {
  // given
  const bigArray: any[] = ["1", "NEGATE", "8", "+", "6", "+"];
  // when
  const operationToDo = isolateOneOperation(bigArray);
  // then
  expect(operationToDo.stack).toEqual([-1, 8]);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "+"]);
});

test("Should remove 5 elements of the array if the 2 numbers are NEGATE", () => {
  // given
  const bigArray: any[] = ["1", "NEGATE", "4", "NEGATE", "+", "6", "-"];
  // when
  const operationToDo = isolateOneOperation(bigArray);
  // then
  expect(operationToDo.stack).toEqual([-1, -4]);
  // expect(operationToDo.negate).toEqual(true);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "-"]);
});

//////////////////////// tests on calcul() //////////////////////////

test("Should do the operation", () => {
  // given
  const arr: number[] = [1, 4];
  const operator = "+";
  // when
  const result: any = calcul(arr, operator);
  // then
  expect(result).toEqual(["5"]);
});

test("Should return a number, followed by NEGATE if result in calcul() < 0", () => {
  // given
  const arr: number[] = [1, 4];
  const operator = "-";
  // when
  const result: any = calcul(arr, operator);
  // then
  expect(result).toEqual(["3", "NEGATE"]);
});

test("Should give an error when operator is not in operators", () => {
  // given
  const arr: number[] = [1, 4];
  const operator = "r";
  // // then
  expect(() => calcul(arr, operator)).toThrowError("Operateur non pris en charge");
});

//////////////////////// tests on expressionToCalculate() //////////////////////////

test("Should throw an error for division by zero", () => {
  // given
  const str: string = "1 0 /";
  // then
  expect(() => expressionToCalculate(str)).toThrowError("Division par zero");
});

test("Should replace the used characters of the big array with the new number", () => {
  // given
  const newNumber: any[] = [5];
  const placeOfTheNewNumber: number = 0;
  const bigArray: string[] = ["6", "-"];
  // when
  const newArray: string[] = insertNewNumber(bigArray, newNumber, placeOfTheNewNumber);
  // then
  expect(newArray).toEqual(["5", "6", "-"]);
});

//////////////////////// tests full calcul //////////////////////////

test("Should do an entire calcul", () => {
  expect(expressionToCalculate("1 4 + 4 -")).toEqual(1);
  expect(expressionToCalculate("1 1 1 - + 1 /")).toEqual(1);
  expect(expressionToCalculate("3 5 8 * 7 + *")).toEqual(141);
  expect(expressionToCalculate("8 1 NEGATE + 5 -")).toEqual(2);
  expect(expressionToCalculate("1 NEGATE")).toEqual(-1);
  expect(expressionToCalculate("8 1 NEGATE * 5 -")).toEqual(-13);
  expect(expressionToCalculate("8 1 MOD")).toEqual(0);
});
