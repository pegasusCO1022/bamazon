const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database

connection.connect(function (err) {
  // if (err) throw err;
  promptPurchase();
  // run the start function after the connection is made to prompt the user
});

let item = "";
let quantity;
// function to handle item inquiry and updating database
function promptPurchase() {
  const currentItemArr = [];

  connection.query("SELECT * FROM products", function (err, result) {
    if (err) throw err;

    console.log(result);
    console.log('~~~~~~~~~~Current Inventory~~~~~~~~~~~');
    for (var i = 0; i < result.length; i++) {
      console.log(`item number: ${result[i].id} name: ${result[i].product_name} price: ${result[i].price}`)
      currentItemArr.push(result[i].id);
    }
    console.log('~~~~~~~~~~Current Inventory~~~~~~~~~~~')
  })
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        message: "What is the ID of the product you would like to buy?",
        type: "input",
        name: "item_id",
        validate: function (value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        message: "How many units of the product would you like to purchase?",
        type: "input",
        name: "stock_quantity",
        validate: function (value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ]).then(function (input) {
      item = parseInt(input.item_id);
      quantity = input.stock_quantity;
      if (currentItemArr.indexOf(item) > -1) {
        checkInventory();
      } else {
        console.log("please enter valid item number")
        promptPurchase();
      }

    })
};


function checkInventory() {
  connection.query("SELECT product_name, price, stock_quantity FROM products WHERE ?", { id: item }, function (err, result) {
    if (err) throw err;
    console.log("check inventory", result);
    // if(quantity > stock_quantity){
    //   console.log("Insufficient quantity!");
    // }
  })

  //   // compare inventory to amount needed
  //   if(quantity > result[0].stock_quantity){
  //     console.log("Insufficient quantity!");
  //   } else{
  //     // updateInventory();
  //     console.log("You're order has been submitted");
  //   }

}


// function updateInventory(){
//  {
//     const purchasePrice = item.price * quantity;
//     console.log("You're order has been completed", "You're order total is: "+ purchasePrice +" ")
//     connection.query("UPDATE product SET ? WHERE ?",`${stock_quantity}, ${id_item}`)
//   }
// }