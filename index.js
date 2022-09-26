const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const path = require('path')

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

// mongoose.connect("mongodb://localhost:27017/bankDB");
mongoose.connect("mongodb+srv://greesh:greeshwar@cluster0.fhm9b.mongodb.net/bankDB?retryWrites=true&w=majority");
const customerSchema = {
    customerID:{
        type:Number,
        required:true
    },
    name:{
      type:String,
      required:true
    },
    age:{
        type:Number
    },
    email:{
        type:String
    },
    accountBalance:{
      type:Number,
      required:true
    }
}

const transactionSchema = {
    timeStamp :{
        type:Date,
        required:true
    },
    fromCustomerName:{
        type:String,
        required:true
    },
    toCustomerName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
   

}
// collection 
const Customer = mongoose.model("Customer",customerSchema);
const Transaction = mongoose.model("Transaction",transactionSchema);


const c1 = new Customer({
    customerID:1,
    name:"Greeshwar",
    age: 20,
    email:"greeshwar@gmail.com",
    accountBalance:50000
 });

 

app.get("/",function(req,res){
    res.render("Home");
})
app.get("/Customers",function(req,res){
    Customer.find({},function(err,customers){
        if(err){
            console.log(err);
        }
        else{
            

            res.render("Customers",{customers:customers});
        }
    });
    
});
app.get("/Customer/:custID",function(req,res){
    Customer.findOne({customerID : Number(req.params.custID.substring(1))},function(err,customer){
        if(!err){
            if(customer){
                res.render("SingleCustomer",{customer:customer});
            }
            else{
                console.log("No such customer");
            }
        }
        else{
            console.log(err);
        }
    });

});

app.get("/Transfer/:custID",function(req,res){

    Customer.find({},function(err,customers){
        if(err){
            console.log(err);
        }
        else{
            let curCustomer = {}
            function checkCustomer(customer){
                if(customer.customerID == Number(req.params.custID.substring(1))){
                    
                    curCustomer = customer;
                    return false;
                }
                // console.log(customer.name);
                return true;
            }
            customers = customers.filter(checkCustomer);
            res.render("MoneyTransfer",{Customers:customers,curCustomer:curCustomer});
        }
    });
});
app.get("/Transactions",function(req,res){
    Transaction.find({},function(err,found){
        if(err){
            console.log(err);
        }
        else{
            // console.log(found);
            Customer.find({},function(err,customers){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("TransactionHistory",{transactions:found,Customers:customers});
                }
            });
           
        }
    });
});

app.post("/Transactions",function(req,res){
    //req.body - contains js object with info returned from form in html
    console.log(req.body.ToAccountno);
    Transaction.find({ fromCustomerName:req.body.FromAccountno,toCustomerName:req.body.ToAccountno},function(err,found){
        if(err){
            console.log(err);
        }
        else{
            Customer.find({},function(err,customers){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("TransactionHistory",{transactions:found,Customers:customers});
                }
            });
           
        }
    });
});

app.post("/",function(req,res){
    console.log(req.body);
});

app.post("/Transfer",function(req,res){

    console.log(req.body);
    const amtTransfer = Number(req.body.transferAmount);
    const curAmount = Number(req.body.yourBalance);
    const senderAccNo = Number(req.body.yourAccountNo);
    const recieverAccNo = Number(req.body.recieverAccountno);
    const senderName = req.body.yourName;
    if(amtTransfer <= curAmount){
        // updating the balance of sender
        Customer.updateOne(
            {customerID:senderAccNo}, 
            {accountBalance: curAmount-amtTransfer}, function (err, docs) {
            if (err){
                res.render("PaymentFailure",{content:"Oops Transaction Failed Tryagain :("});
            }
        });
        // updating the balance of reciever
        Customer.updateOne(
            {customerID:recieverAccNo}, 
            {$inc:{accountBalance:amtTransfer}}, function (err, docs) {
            if (err){
                // reverting the transaction
                Customer.updateOne(
                    {customerID:senderAccNo}, 
                    {accountBalance: curAmount}, function (err, docs) {
                    if (err){
                        res.render("PaymentFailure",{content:"Oops Transaction Failed Tryagain :("});
                    }
                });
                res.render("PaymentFailure",{content:"Oops Transaction Failed Tryagain :("});
            }
        });
        // finding name of reciever
        Customer.findOne({customerID : recieverAccNo},function(err,customer){
            if(!err){
                if(customer){
                    let recieverName = customer.name;
                    // storing transaction informations
                    const t1 = new Transaction({
                    timeStamp: new Date(),
                    fromCustomerName:senderName,
                    toCustomerName:recieverName,
                    amount:amtTransfer,
                    });
                    console.log(t1);
                    t1.save();
                }
                else{
                    console.log("No such customer");
                }
            }
            else{
                console.log(err);
            }
        });

        res.render("PaymentSuccess");
    }
    else{
        res.render("PaymentFailure",{content:"Oops Transaction Failed due to insufficient balance :("});
    }
});



app.listen(PORT,function(){
    console.log("server up and running");
})