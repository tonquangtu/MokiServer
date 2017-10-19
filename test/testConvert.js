console.log(Number("123.99  "));

function testDefaultl(a = 5) {
    console.log(a);
}

testDefaultl();
testDefaultl(8);
