// INSERTING A DOCUMENT
const mongoose = require('mongoose')

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

const Customer = mongoose.model("Customer",customerSchema);


const c1 = new Customer({
    customerID:1,
    name:"Greeshwar",
    age: 20,
    email:"greeshwar@gmail.com",
    accountBalance:50000
 });
 const c2 = new Customer({
     customerID:2,
     name:"RajKumar",
     age: 42,
     email:"Raja@gmail.com",
     accountBalance:150000
  });
  const c3 = new Customer({
     customerID:3,
     name:"Mahesh",
     age: 33,
     email:"Mahesh@yahoo.com",
     accountBalance:20000
  });
  const c4 = new Customer({
     customerID:4,
     name:"Bala",
     age: 20,
     email:"Bala@gmail.com",
     accountBalance:350000
  });
  const c5 = new Customer({
     customerID:5,
     name:"Suresh",
     age: 32,
     email:"suresh02@gmail.com",
     accountBalance:650000
  });
  const c6 = new Customer({
     customerID:6,
     name:"Swetha",
     age: 36,
     email:"swetha24@gmail.com",
     accountBalance:40000
  });
  const c7 = new Customer({
     customerID:7,
     name:"Latha Krishnan",
     age: 42,
     email:"Latha08@gmail.com",
     accountBalance:200000
  });
  const c8 = new Customer({
     customerID:8,
     name:"Kishore",
     age: 15,
     email:"kishore13@gmail.com",
     accountBalance:3000
  });
  const c9 = new Customer({
     customerID:9,
     name:"Sujatha",
     age: 36,
     email:"sujatha43@gmail.com",
     accountBalance:20000
  });
  const c10 = new Customer({
     customerID:10,
     name:"Mohan",
     age: 52,
     email:"Mohan@gmail.com",
     accountBalance:500000
  });

  mongoose.connect("mongodb+srv://greeshwar:greeshwar@cluster0.fhm9b.mongodb.net/bankDB?retryWrites=true&w=majority").then((_) => {
   Customer.insertMany([c1,c2,c3,c4,c5,c6,c7,c8,c9,c10],function(err){
      if(err){
          console.log(err);
      }
      else{
          console.log("Successfull saved");
      }
  });
  })
 
 