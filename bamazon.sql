CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (255) NOT NULL,
    department_name VARCHAR (255) NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
("Fire TV Stick", "Electronics", 29.99, 1000),
("Crest White Toothpaste", "Beauty", 9.97, 50),
("Velvet Scrunchies", "Beauty", 8.99, 200),
("Gillette Razor Blades", "Beauty", 13.98, 100),
("Dove White Soap", "Beauty", 13.55, 450),
("Echo", "Electronics", 64.99, 2000),
("Kindle", "Electronics", 99.99, 60),
("Roku Express", "Electronics", 29.88, 300),
("Vizio Sound Bar", "Electronics", 149.99, 75),
("CeraVe Moisturizing Cream", "Beauty", 14.42, 30);