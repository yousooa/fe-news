function test() {
  let count = 0;
  return () => {
    count++;
    console.log(count);
  };
}

const testA = test();
testA();
