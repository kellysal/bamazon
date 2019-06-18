// Create a Node application
// Require node modules
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');

// Connect to the database
const connection = mysql.createConnection({
    host: "localhost",

    // Port
    port: 8889,

    // Username
    user: "root",

    // Password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;

    console.log("connected as id " + connection.threadId);

    displayProducts();
});

function validateInput(value) {
    let integer = Number.isInteger(parseFloat(value));
    let sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return "Enter a whole non-zero number!";
    };
};

// Display all of the items available for sale: Include the ids, names, and prices of products for sale
function displayProducts() {
    let query = "SELECT * FROM products";
    connection.query(query, function (err, res) {

        if (err) throw err;

        var table = new Table({
            head: ["Product ID", "Product Name", "Price", "Stock Available"],
            colWidths: [15, 25, 15, 25]
        });

        for (let i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);

        }

        console.log(table.toString());

        //console.log(`Product ID: ${res[i].item_id}`);
        //console.log(`Product Name: ${res[i].product_name}`);
        //console.log(`Price: ${res[i].price}`);
        //console.log(`Stock Quantity: ${res[i].stock_quantity}`);

        requestProduct();
    });
};

// Prompt users with two messages:
// Ask them the ID of the product they would like to buy
// Ask how many units of the product they would like to buy
function requestProduct() {
    inquirer.
        prompt([{
            name: "productID",
            type: "input",
            message: "What product would you like to buy?",
            validate: validateInput,
            filter: Number
        }, {
            name: "productUnits",
            type: "input",
            message: "How many units would you like to buy?",
            validate: validateInput,
            filter: Number

        }]).then(function (input) {
            completePurchase(input);

        });
};

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request

// If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through

// If your store _does_ have enough of the product, you should fulfill the customer's order
function completePurchase(input) {
    console.log(input);

    let query = "SELECT stock_quantity, price FROM products WHERE ?";
    connection.query(query, { item_id: input.productID }, function (err, res) {

        if (err) throw err;

        let stock = res[0].stock_quantity;
        let purchasePrice = res[0].price;

        if (input.productUnits >= stock) {
            console.log("Out of Stock!");
            requestProduct();

        } else {
            let newQuantity = stock - input.productUnits;

            let query = "UPDATE products SET ? WHERE ?"
            connection.query(query, [{ stock_quantity: newQuantity }, { item_id: input.productID }], function (err, res) {

                if (err) throw err;

                let totalPrice = input.productUnits * purchasePrice;

                console.log(`Transaction Complete! Total: $ ${totalPrice}`);

            });

            displayProducts();
        }
    });

};

// Update the SQL database to reflect the remaining quantity

// Once the update goes through, show the customer the total cost of their purchase
