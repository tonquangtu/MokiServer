// const obj1 = { a: 7, b: 6 };
// const c = 8;
// const copy = { ...obj1, c };
// console.log(copy);

const original = { a: 1, b: 2 };
const c = 4;
const copy2 = Object.assign({}, original, { c}); // copy => { a: 1, b: 2, c: 3 }
console.log(copy2);
