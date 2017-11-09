// const now = new Date();
// const now2 = new Date('ssss');
// console.log(typeof now);
// console.log(Object.prototype.toString.call(now2));

const moment = require('moment');

test();

function test() {
  const now = new Date();
  // console.log(now.toDateString());
  // console.log(now.toISOString());
  // const expired = new Date('ss');
  // // expired.setDate(expired.getDate() - 1);
  //
  // const nowM = moment(new Date());
  // const expiredM = moment(expired);
  // const diff = nowM.diff(expiredM);
  // console.log(diff);
  const a = 'sss';

  console.log(Object.prototype.toString.call(now));
  console.log(Object.prototype.toString.call(a));
}

