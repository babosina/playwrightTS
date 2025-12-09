let customer = {
    firstName: "Biba",
    lastName: "Golov"
};

console.log(customer);
console.log(customer.lastName);
console.log(customer["firstName"])

customer.firstName = "Lala";
customer.lastName = "Falova";

console.log(`Customer name is ${customer.firstName} ${customer.lastName}`);


let books = ["Mist", "Tits", "1984"];
console.log(books[1]);
books[0] = "The Gunslinger";
console.log(books);

customer["books"] = books;
console.log(customer.books[1]);