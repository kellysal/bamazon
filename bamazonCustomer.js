// Create a Node application
// Require node modules
const mysql = require("mysql");
const inquirer = require("inquirer");

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
let displayProducts = function () {
    let query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`Product ID: ${res[i].item_id}`);
            console.log(`Product Name: ${res[i].product_name}`);
            console.log(`Price: ${res[i].price}`);
            console.log(`Stock Quantity: ${res[i].stock_quantity}`);
        }
        requestProduct();
    });
};

// Prompt users with two messages:
// Ask them the ID of the product they would like to buy
// Ask how many units of the product they would like to buy
let requestProduct = function () {
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
            console.log(input);

            let query = "SELECT * FROM products WHERE ?";

            connection.query(query, { item_id: input.productID }, function (err, res) {
                if (err) throw err;

                let available_stock = res.stock_quantity;
                let price_per_unit = res.price;
                let productSales = res.product_sales;
                let productDepartment = res.department_name;

                if (available_stock >= input.productUnits) {

                    console.log(input);
                    completePurchase();

                } else {

                    console.log("Not enough stock left!");
                }
            });
        });
};

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request

// If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through

// If your store _does_ have enough of the product, you should fulfill the customer's order
let completePurchase = function (availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {
    let price_per_unit = res.price;
    let productSales = res.product_sales;
    let productDepartment = res.department_name;

    let updatedStockQuantity = availableStock - selectedProductUnits;

    let totalPrice = price * selectedProductUnits;

    let updatedProductSales = parseInt(productSales) + parseInt(totalPrice);

    let query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{
        stock_quantity: updatedStockQuantity,
        product_sales: updatedProductSales
    }, {
        item_id: selectedProductID
    }], function (err, res) {
        if (err) throw err;
        console.log("Your purchase is complete!");

        console.log("Payment has been received: " + totalPrice);

        updateDepartmentRevenue(updatedProductSales, productDepartment);
    });
};

// Update the SQL database to reflect the remaining quantity
let updateDepartmentRevenue = function (updatedProductSales, productDepartment) {
    let query = "SELECT total_sales FROM departments WHERE ?";
    connection.query(query, { department_name: productDepartment }, function (err, res) {
        if (err) throw err;

        let departmentSales = res.total_sales;

        let updatedDepartmentSales = parseInt(departmentSales) + parseInt(updatedProductSales);

        completeDepartmentSalesUpdate(updatedDepartmentSales, productDepartment);
    });
};

// Once the update goes through, show the customer the total cost of their purchase

let completeDepartmentSalesUpdate = function (updatedDepartment, productDepartment) {
    let query = "UPDATE departments SET ? WHERE ?";
    connection.query(query, [{
        total_sales: updatedDepartment
    }, {
        department_name: productDepartment
    }], function (err, res) {
        if (err) throw err;

        displayProducts();

    });
};