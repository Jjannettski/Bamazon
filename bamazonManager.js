var inquirer = require("inquirer");
var fs = require("fs");
var mysql = require("mysql");

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

//Initializes the manager view
function managerView() {
    console.log("I'm a barbie girl");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Prompts the user with questions
        inquirer.prompt([{
            name: "name",
            type: "list",
            message: "Select one of the options below to proceed?",
            choices: ["View Products for Sale","View Low Inventory", "Add to Inventory", "Add New Product"]
        },
    ]).then(function (answers) {
            console.log("You Chose to: "+ answers.name);
            switch(answers.name){
                case "View Products for Sale":
                console.log("Case1 worked!");
                viewProducts(err,res);
                break;
                case "View Low Inventory":
                console.log("Case2 worked!");
                viewLowInventory(err,res);
                break;
                case "Add to Inventory":
                console.log("Case3 worked!");
                addInventory(err,res);
                break;
                case "Add New Product":
                console.log("Case4 worked!");
                addProduct(err,res);
                break;
                default:
                console.log("This shit ain't working cuz");
            }
        })
    });
}
managerView();

function viewProducts(err,res){
      //For loop to display all the items and their corresponding properties
      for(i=0;i < res.length;i++){
        console.log("-----------------------------");
        console.log("Product name: "+res[i].product_name+"\nPrice: $"+ res[i].price+ "\nQTY: " +res[i].stock_quantity+"\nItem Id: "+res[i].item_id);
        console.log("-----------------------------");
    }
}
function viewLowInventory(err,res){
    //For loop to display all the items and their corresponding properties
    for(i=0;i < res.length;i++){
        if(res[i].stock_quantity < 10){
            console.log("-----------------------------");
            console.log("Product name: "+res[i].product_name+"\nPrice: $"+ res[i].price+ "\nQTY: " +res[i].stock_quantity+"\nItem Id: "+res[i].item_id);
            console.log("-----------------------------");
        }
    }
}
//adds inventory to the database
function addInventory(err,res){
    //creates an empty choices array
    var choices = [];
    //populates the choices array with each entry in the database
        for(i=0;i < res.length;i++){
            choices.push(res[i].product_name);
        }
        console.log(choices);
        //prompts the user which item would the like to update using the choices from the choices array
    inquirer.prompt([{
        name: "name4",
        type: "list",
        message: "Select which item you would like to update:",
        choices: choices,
        when: function(itemQuery){
            return itemQuery;
        }
    },{
        name: "name5",
        message: "How much do you want to add?",
        when: function(answers){
            return answers.name4
        }
    }
]).then(function (answers) {
    //grabs the quantity from the database where the item matches the user input
    connection.query("SELECT stock_quantity FROM products WHERE ?",[{
        product_name: answers.name4,
    }
], function (err, res) {
        if (err) throw err;
        var finalQuantity = parseInt(answers.name5)+res[0].stock_quantity;
    console.log(finalQuantity);
        console.log("You Chose to update: "+ answers.name4 + " ("+ answers.name5+")");
        console.log("Your update is complete! Have a great day!");
        connection.query("UPDATE products SET? WHERE?",[{
            stock_quantity: finalQuantity,
        },{
            product_name: answers.name4
        }
        ]), function(err,res){
            if (err) throw err;
            console.log("Your update is complete! Have a great day!");
        }
    });
    })
    
}
function addProduct(err,res){
    inquirer.prompt([{
        name: "name6",
        message: "Name of the product you'd like to add:"
    },
    {
        name: "name7",
        message: "What department does it belong to?",
        when: function(answers){
            return answers.name6;
        }   
    },
    {
        name: "name8",
        message: "What is the price?",
        when: function(answers){
            return answers.name7;
        }   
    },
    {
        name: "name9",
        message: "What is the new quantity for your product?",
        when: function(answers){
            return answers.name8;
        }   
    },
]).then(function (answers) {
    connection.query("INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ('"+answers.name6+"','"+answers.name7+"',"+answers.name8+","+answers.name9+")"
        // {
        //     product_name: answers.name6,
        //     department_name: answers.name7,
        //     price: parseInt(answers.name8),
        //     stock_quantity: parseInt(answers.name9)
        // }
    ), function(err,res){
        if (err) throw err;
        console.log("Your update is complete! Have a great day!");        
    }
});
};