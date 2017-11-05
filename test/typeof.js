// const now = new Date();
// const now2 = new Date('ssss');
// console.log(typeof now);
// console.log(Object.prototype.toString.call(now2));

const moment = require('moment');

test();

function test() {
  const now = new Date();
  const expired = 'dd';
  // expired.setDate(expired.getDate() - 1);

  const nowM = moment(new Date());
  const expiredM = moment(expired);
  const diff = nowM.diff(expiredM);
  console.log(diff);
}

