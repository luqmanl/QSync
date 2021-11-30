/* eslint-disable no-magic-numbers */
type dataPoint = { x: number; y: number };
type data = dataPoint[];

const list1 = [1, 2, 4, 6, 7, 8, 10, 11, 21, 26, 28, 34, 37, 40, 46, 50, 53];
const list2 = [1, 2, 4, 5, 4, 6, 4, 15, 9, 8, 6, 5, 2, 8, 12, 9, 3];
export const ExampleBasisHistory: data = list1.map((x, i) => {
  return { x: x, y: list2[i] };
});
