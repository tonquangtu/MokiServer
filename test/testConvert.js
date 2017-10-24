console.log(Number("123.99  "));

function testDefaultl(a = 5) {
    console.log(a);
}

testDefaultl();
testDefaultl(8);

const sum = [3, 5, 7].reduce((total, item) => {
  return (total + item);
});

console.log(sum);
