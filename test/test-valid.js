const helpers = require('../helpers/helpers');
console.log(validNumber(1));
console.log(validNumber('1'));
console.log(validNumber('ss'));
console.log(Number.isNaN('fff'));

function validNumber(aNumber) {
  if (!helpers.isExist(aNumber) || Number.isNaN(aNumber)) {
    return null;
  }

  const valid = Number(aNumber);
  if (Number.isNaN(valid)) {
    console.log('vao');
    return null;
  }
  return valid;
}
