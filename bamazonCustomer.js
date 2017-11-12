var inquirer = require("inquirer");
var fs = require("fs");
var mysql = require("mysql");
//Creating the mysql connection to the database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "james",
    // Your password
    password: "password",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});
//Reads the items from the database and displays them on the screen
function readItems() {
    console.log("I'm a barbie girl");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //For loop to display all the items and their corresponding properties
        for(i=0;i < res.length;i++){
            console.log("-----------------------------");
            console.log("Product name: "+res[i].product_name+"\nPrice: $"+ res[i].price+ "\nQTY: " +res[i].stock_quantity+"\nItem Id: "+res[i].item_id);
            console.log("-----------------------------");
        }
        //Prompts the user with questions
        inquirer.prompt([{
            name: "name",
            message: "Which item would you like to purchase?"
        },
        {
            name:"name2",
            message: "How much do you want to buy?",
            when: function(answers){
                return answers.name
            },
            //Makes sure the user enters in number values only
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0) {
                    return true;
                }
                return false;
            }
        },
        {
            name:"name3",
            message:"Are you sure you'd like to place this order?",
            when: function(answers){
                return answers.name2
            }
        }
    ]).then(function (answers) {
        //Displays the user's answers 
            console.log("You Chose: " + answers.name);
            console.log("Your quantity: " + answers.name2);
            console.log("Checking to see if there is sufficient quantity.....");
            var userQuantity = answers.name2;
            //Cals the check quantity funciton to make sure there is enough inventory
            checkQuantity(userQuantity,answers);
        })
    });
}
readItems();
function checkQuantity(userQuantity,answers){
    console.log("Check is complete!");
    //Query that selects the stock quantity from the item the user chose
    connection.query("SELECT stock_quantity,price FROM products WHERE ?",[{
        product_name: answers.name,
    }
], function (err, res) {
//Total price of the user's order
console.log("This is the price of the item the user chose: "+res[0].price);
console.log("This is the quantity that they are purchasing: "+userQuantity);
        var totalPrice = res[0].price * userQuantity;
        console.log(totalPrice);
        //Stock quantity that gets updated to the database
        var updatedQuantity = res[0].stock_quantity-userQuantity;

        if (err) throw err;
        console.log("$"+totalPrice);
        //then checks to see if there is enough
        if(userQuantity > res[0].stock_quantity){
            console.log("Not enough stock! Try Again Later!");
            //If there is enough quanitty then....
        }else{
            //Updates the user quantity into the sql database
            console.log("There's Plenty!");
            console.log("This is the new total quantity: "+ updatedQuantity);
                //Updates the user quantity into the sql database
            var query=connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: updatedQuantity,
            },
            {
                product_name: answers.name
            }
        ], function (err, res) {
            console.log("Your Order Is Complete!");
            console.log("Order Total " +"$"+totalPrice);
        });
        }
    });
}


