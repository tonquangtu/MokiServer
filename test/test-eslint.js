const a = 5;
const obj = {
  a,
  b: 5,
  'data-bla': 5,
  addFriends(friends) {
    console.log(friends);
  },
};

console.log(obj.hasOwnProperty('a')); // bad
console.log(Object.prototype.hasOwnProperty.call(obj, 'a')); // good
console.log(obj);

// copy object
let originObj = {
  a: 1,
  b: 2,
};

// very bad
const copy = Object.assign(originObj, { c: 3 });
console.log(originObj);
console.log(copy);
delete copy.a;
console.log(copy);

// bad
const original = { a: 1, b: 2 };
const copy2 = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }
console.log(copy2);

// good
// const original2 = { a: 1, b: 2 };
// const copy3 = { ...original2, c: 3 }; // copy3 => { a: 1, b: 2, c: 3 }
// const { x, ...noA } = copy3;
// console.log(copy3);
// console.log(noA);

// bad
const items = [4, 5, 6, 7];
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i += 1) {
  itemsCopy[i] = items[i];
}

// good
// spread ... allow iterable as array expands space

const itemsCopy2 = [...items]; // copy all elements of items into itemsCopy2
console.log(itemsCopy2);

// should return in array function
// good
let newArr = [1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});

console.log(newArr);

// good
[1, 2, 3].map(x => x + 1);

// bad
const flat = {};
[[0, 1], [2, 3], [4, 5]].reduce((memo, item, index) => {
  console.log(memo);
  console.log(item);
  // const flatten = memo.concat(item);
  // flat[index] = flatten;
});

// good
// const flat2 = {};
// [[0, 1], [2, 3], [4, 5]].reduce((memo, item, index) => {
//   const flatten = memo.concat(item);
//   flat2[index] = flatten;
//   return flatten;
// });

// // bad
// inbox.filter((msg) => {
//   const { subject, author } = msg;
//   if (subject === 'Mockingbird') {
//     return author === 'Harper Lee';
//   } else {
//     return false;
//   }
// });
//
// // good
// inbox.filter((msg) => {
//   const { subject, author } = msg;
//   if (subject === 'Mockingbird') {
//     return author === 'Harper Lee';
//   }
//
//   return false;
// });

// forEach
const tasks = [

  {
    'name'     : 'Write for Envato Tuts+',

    'duration' : 120
  },

  {
    'name'     : 'Work out',

    'duration' : 60
  },

  {
    'name'     : 'Procrastinate on Duolingo',

    'duration' : 240
  },
];

const taskNames = [];
tasks.forEach((task, index) => {
  console.log(index);
  taskNames.push(task.name);
});

console.log(taskNames);

const task_names = tasks.map(task => task.name);
console.log(task_names);

// filter elements suitable/fit with condition
const difficult_tasks = tasks.filter(function (task) {
  return task.duration >= 120;
});

// Using ES6
const difficult_tasks2 = tasks.filter(task => task.duration >= 120 );

console.log(difficult_tasks);
console.log(difficult_tasks2);

// bad
function getFullName1(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// destructing object
// good
function getFullName2(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName3({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

const user = {
  firstName: 'tu',
  lastName: 'ton quang',
};
console.log(getFullName3(user));

const arr4 = [1, 2, 3, 4];

// destructing array
const [first, second] = arr4;
console.log(first);
console.log(second);

// good, should use template string than plus string
function sayHi(name) {
  return `How are you, ${name}?`;
}

