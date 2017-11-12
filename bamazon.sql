CREATE DATABASE bamazon_db;

CREATE TABLE products(

item_id INT (10) AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INT (10) NOT NULL,
stock_quantity INT (10) NOT NULL,
primary key(item_id)
);

INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("guitar","appliances", 400, 20);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("couch","furniture", 600, 5);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("coffee table","furniture", 120, 6);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("tv stand","furniture", 100, 10);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("midi keyboard","appliances", 80, 12);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("t-shirt","apparel", 20, 50);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("thermal long sleeve","apparel", 30, 20);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("bongos","appliances", 60, 8);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("fedora","apparel", 20, 10);
INSERT INTO products (product_name,department_name,price, stock_quantity)
VALUES ("leather jacket","apparel", 140, 6);

SELECT * FROM products;

SELECT stock_quantity,price FROM products WHERE product_name="guitar";