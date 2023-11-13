const array = [[0, 1, 3, 31], [4, 7, 5, 2], [9, 4, 7, 3], [9, 4, 7, 6]]

let rightSum = 0
let leftSum = 0

array.forEach((item, index) => {
    const a = array[index][array.length - index - 1];
    rightSum += a
});

array.reverse().forEach((item, index) => {
    const b = array[index][array.length - index - 1];
    leftSum += b
});

if (rightSum > leftSum)
    console.log(rightSum - leftSum);
else
    console.log(leftSum - rightSum);