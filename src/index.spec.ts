// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";
import { stringToArray, arrayToLittleArray, calcul, insertNewNumber, superFonctionQuiFaitLeCalcul } from ".";

expect.extend(matchers);

test("Should transform string to array", () => {
  // given
  const str: string = "1 1 +";
  // when
  const arr = stringToArray(str);
  // then
  expect(arr).toEqual(["1", "1", "+"]);
});

test("Should create a new array of 2 numbers and give and operator", () => {
  // given
  const bigArray: any[] = ["1", "4", "+", "6", "-"];
  // when
  const operationToDo = arrayToLittleArray(bigArray);
  // then
  expect(operationToDo.stack).toEqual([1, 4]);
  expect(operationToDo.operator).toEqual("+");
  expect(operationToDo.arr).toEqual(["6", "-"]);
});

test("Should do the operation", () => {
  // given
  const arr: number[] = [1, 4];
  const operator = "+";
  // when
  const result: any = calcul(arr, operator);
  // then
  expect(result).toEqual(5);
});

test("Should give an error when operator is not in operators", () => {
  // given
  const arr: number[] = [1, 4];
  const operator = "r";
  // when
  const result: any = calcul(arr, operator);
  // then
  expect(result).toEqual("Operateur non pris en charge");
});

test("Should replace the used characters of the big array with the new number", () => {
  // given
  const newNumber: number = 5;
  const placeOfTheNewNumber: number = 0;
  const bigArray: string[] = ["6", "-"];
  // when
  const newArray: string[] = insertNewNumber(bigArray, newNumber, placeOfTheNewNumber);
  // then
  expect(newArray).toEqual(["5", "6", "-"]);
});

test("Should do an entire calcul", () => {
  // given
  const str: string = "1 4 + 4 -";
  // when
  const result: number = superFonctionQuiFaitLeCalcul(str);
  // then
  expect(result).toEqual(1);
});

test("Should do an other entire calcul", () => {
  // given
  const str: string = "1 1 1 - + 1 /";
  // when
  const result: number = superFonctionQuiFaitLeCalcul(str);
  // then
  expect(result).toEqual(1);
});

// test("A simple test (Jest)", () => {
//   expect(1 + 1).toEqual(2);
// });

// test("Additional matchers (jest-extended)", () => {
//   expect([1, 0]).toIncludeSameMembers([0, 1]);
// });

// test("Property-based testing (fast-check)", () => {
//   type Boundaries = {
//     min: number;
//     max: number;
//   };

//   const minmax =
//     ({ min, max }: Boundaries) =>
//     (n: number): number =>
//       Math.min(max, Math.max(min, n));

//   fc.assert(
//     fc.property(fc.integer(), (n): boolean => {
//       const result = minmax({ min: 1, max: 10 })(n);
//       return 1 <= result && result <= 10;
//     })
//   );
// });
