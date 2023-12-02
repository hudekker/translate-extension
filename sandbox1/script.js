function regularFunction() {
  console.log(this);
}

const arrowFunction = () => {
  console.log(this);
};

const obj = {
  regularMethod: regularFunction,
  arrowMethod: arrowFunction,
};

obj.regularMethod(); // 'this' inside regularFunction will be 'obj'
obj.arrowMethod();   // 'this' inside arrowFunction will be determined by the lexical scope, not affected by obj
