// For Objects
const newObj = {
  ...oldObj,
  nested: {
    ...oldObj.nested,
    keyToChange: newValue,
  },
};

// For Arrays
const newArr = [
  ...oldArr.slice(0, index),
  newValue,
  ...oldArr.slice(index + 1),
];

// For Nested Arrays/Objects
const newState = {
  ...state,
  items: state.items.map((item, i) =>
    i === targetIndex
      ? { ...item, value: newValue }
      : item
  ),
};