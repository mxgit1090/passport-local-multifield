exports.isPlainObject = function(value) {
  return (
    typeof value === 'object'
    && (Object.getPrototypeOf(value) === null || Object === value.constructor)
  );
}

exports.getFromField = function(inputObject, fieldString) {
  // @TODO: for nest object
  if (!exports.isPlainObject(inputObject)) inputObject = {};
  return inputObject[fieldString] || null;
}
