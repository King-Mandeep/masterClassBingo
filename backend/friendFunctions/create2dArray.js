export const make2dArray=()=>{
const rows = 5;
const cols = 5;

let arr = [];

for (let i = 0; i < rows; i++) {
  arr[i] = [];
  for (let j = 0; j < cols; j++) {
    arr[i][j] = 0;
  }
}
return arr;
// console.log(numbers);
}