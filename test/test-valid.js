const helpers = require('../helpers/helpers');
console.log(validNumber(1));
console.log(validNumber('1'));
console.log(validNumber('ss'));

function validNumber(aNumber) {
  if (!helpers.isExist(aNumber) || Number.isNaN(aNumber)) {
    return null;
  }

  const validNumber = Number(aNumber);
  if (Number.isNaN(validNumber)) {
    console.log('vao');
    return null;
  }
  return validNumber;
}
