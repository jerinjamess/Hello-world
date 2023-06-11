var nodemailer = require('nodemailer');
var sid = "AC4c2fdf899f01572dd080b7b25d863d1c";
var auth_token = "b8e85e11265835bf1542845aae355023";

var twilio = require("twilio")(sid, auth_token);
//mongo
const { MongoClient, ObjectId } = require('mongodb')
var objectId=require('mongodb').ObjectId
const exphbs = require('express-handlebars');

const axios = require('axios');
const { response, json } = require('express');
// Create Instance of MongoClient for mongodb
const client = new MongoClient('mongodb://127.0.0.1:27017')

// Connect to database
client.connect()
    .then(() => console.log('Connected Successfully'))
    .catch(error => console.log('Failed to connect', error))
   //client.close()
module.exports={
    message:async(info,user)=>{
        let product=await client.db('project').collection('product').findOne({_id:new objectId(info)})
        console.log("heeeeeeeeeeeee",user)
        let merchantId=product.m_id
        let merchant=await client.db('project').collection('merchantLogin').findOne({_id:new objectId(merchantId)})
        let merchantMail=merchant.email
        let userInfo={name:user.fname,
                    email:user.emal,
                    address:user.address,
                    picode:user.pincode,
                    mobile:user.mobile,
                    payment:user['payment-method']
        }
        let productInfo={name:product.Name,
            Category:product.Category,
            price:product.price,
        Description:product.Description    }
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jerinjames672@gmail.com',
    pass: 'pzdnytsdfqhupith'
  }
});

var mailOptions = {
  from: 'jerinjames672@gmail.com',
  to: merchantMail,
  subject: 'Congradulation You have been recieved a order',
  text: `Congradulation you have been recieved an a order for the product: ${productInfo.name}\nprice:${productInfo.price}\nDescription:${productInfo.Description}\n\n\nBy the user:${userInfo.name}
Delivery address: ${userInfo.address}\n\n\ncontact Informations:\nGmail: ${userInfo.email}\nmobile:${userInfo.mobile}\n\n\nPayment Method:${userInfo.payment}
\n\nFor more informations about the order visit your Merchant Account in N-mart throug this link:http://localhost:3000/merchant-login `
};

 await transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
})

},
passwordSent:async(user)=>{
  
 
  let userInfo={name:user.Name,
              email:user.emal,
             password:user.pw
              
             
         
  }
  mailId=user.email;
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'jerinjames672@gmail.com',
pass: 'pzdnytsdfqhupith'
}
});

var mailOptions = {
from: 'jerinjames672@gmail.com',
to: mailId,
subject: 'Password Recovery',
text: `Hello ${userInfo.name}  your password is ${userInfo.password} `
};

await transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
})

},
addRejected:async(addId)=>{
  return new Promise(async (resolve, reject) => {
  let add=await client.db('project').collection('addApplication').findOne({_id:new objectId(addId)})
 //console.log("heeeeeeeeeeeee",add)
  let merchantId=add.m_id
  let merchant=await client.db('project').collection('merchantLogin').findOne({_id:new objectId(merchantId)})
  let merchantMail=merchant.email
 
  mailId=merchantMail;
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'jerinjames672@gmail.com',
pass: 'pzdnytsdfqhupith'
}
});

var mailOptions = {
from: 'jerinjames672@gmail.com',
to: mailId,
subject: 'Application Rejected',
text: `Hello ${merchant.name}  your advertisement application has been rejected by the panel  `
};

await transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
})
resolve()
  })
},
productEnquiry:async(proId,message,user)=>{
  return new Promise(async (resolve, reject) => {
  let product=await client.db('project').collection('product').findOne({_id:new objectId(proId)})
 //console.log("heeeeeeeeeeeee",add)
  let merchantId=product.m_id
  let merchant=await client.db('project').collection('merchantLogin').findOne({_id:new objectId(merchantId)})
  let merchantMail=merchant.email
 
  mailId=merchantMail;
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'jerinjames672@gmail.com',
pass: 'pzdnytsdfqhupith'
}
});

var mailOptions = {
from: 'jerinjames672@gmail.com',
to: mailId,
subject: 'Product Enquiry',
text: `Hello ${merchant.Name}  a user named ${user.Name} have a qustion about your product ${product.Name} 



      message:${message.message}
      
      reply to this qustion through now through mail: ${user.email}  or mobile: ${user.email}  `


};

await transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
})
resolve()
  })
}
,
merchantVerify:async(mobile)=>{
  return new Promise(async (resolve, reject) => {
  function generateOTP() {
    const digits = '0123456789';
    let otp = '';
  
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
  
    return otp;
  }
  
  // Example usage
  let otp = generateOTP();
mailId="jerinjames672@gmail.com"

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'jerinjames672@gmail.com',
pass: 'pzdnytsdfqhupith'
}
});

var mailOptions = {
from: 'jerinjames672@gmail.com',
to: mailId,
subject: 'Verification',
text: `Your One Time Password is ${otp}  `
};

await transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
})
resolve(otp)
  })

},


productDelivered:async(ordId)=>{
  //otp generation
  return new Promise(async (resolve, reject) => {
  function generateOTP() {
    const digits = '0123456789';
    let otp = '';
  
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
  
    return otp;
  }
  
  // Example usage
  let otp = generateOTP();
  
  
let orderDetails=await client.db("project").collection('singleOrder').findOne({_id:new objectId(ordId)})



mailId=orderDetails.delivery.email;
user=await client.db("project").collection('userLogin').findOne({_id:new objectId(orderDetails.userId)})

let userMail=user.email
console.log(userMail,mailId)
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'jerinjames672@gmail.com',
pass: 'pzdnytsdfqhupith'
}
});

var mailOptions = {
from: 'jerinjames672@gmail.com',
to: mailId,userMail,
subject: 'Verification',
text: `Your One Time Password is ${otp}  `
};

await transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
})
resolve(otp)
  })
},



addApproved:async(addId)=>{
  return new Promise(async (resolve, reject) => {
  let add=await client.db('project').collection('addApplication').findOne({_id:new objectId(addId)})
 //console.log("heeeeeeeeeeeee",add)
  let merchantId=add.m_id
  let merchant=await client.db('project').collection('merchantLogin').findOne({_id:new objectId(merchantId)})
  let merchantMail=merchant.email
 
  mailId=merchantMail;
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'jerinjames672@gmail.com',
pass: 'pzdnytsdfqhupith'
}
});

var mailOptions = {
from: 'jerinjames672@gmail.com',
to: mailId,
subject: 'Application Approved',
text: `Hello ${merchant.name}  your advertisement application has been rejected by the panel  `
};

await transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
})
resolve()
  })
}

}
