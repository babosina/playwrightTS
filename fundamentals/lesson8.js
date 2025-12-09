// Functions

// Declarative function
helloOne();

function helloOne() {
    console.log("Hello One");
}


// Anonymous function
let helloTwo = function () {
    console.log("Hello Two");
}

helloTwo();

// ES6 arrow function
let helloThree = () => console.log("Hello Three");

helloThree();

// Function with arguments
function printName(name="Lala") {
    console.log(name);
}
printName("Bib");

// Return value
function multyByTwo(num) {
    return num * 2;
}

let byTwo = multyByTwo(6);
console.log(byTwo);


import { CustomerDetails } from "./lesson9.js";

let customerDetails = new CustomerDetails();
customerDetails.printFirstName("CACA");