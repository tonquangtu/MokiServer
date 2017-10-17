const moment = require('moment');
const now = new Date();
console.log(now.getFullYear());
console.log(now.getYear());
console.log(now.getDay());
console.log(now.getDate());
console.log(moment([now.getFullYear(), now.getMonth(), now.getDate()], "YYYY-MM-DD"));

const wrapped = moment(now);
const nowS = wrapped.format('YYYY-MM-DD HH:mm:ss');
console.log(nowS);
