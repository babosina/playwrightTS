// Concatenation and interpolation

let price = 10;
let itemName = "coffee";

let messageToPrint = "The price for " + itemName + " is " + price + " dollars";

console.log(messageToPrint);

let interMessage = `The price for ${itemName} is ${price} dollars`;
console.log(interMessage);