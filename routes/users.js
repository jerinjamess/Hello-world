var express = require('express');
var objectId=require('mongodb').ObjectId
var router = express.Router();
var productHelpers=require('../helpers/product-helpers');
var communicationHelpers=require('../helpers/communication');
const session = require('express-session');
//middle vair for user vloged in or logged out
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
    next();

  }
  else{
    res.redirect('/')
  }

 }
/* GET users listing. */
router.get('/', function(req, res, next) {

  

 req.session.login=false;
  res.render("loginpage",{starting:true,"loginError":req.session.loginError});
  req.session.loginError=false;
});


router.get('/signup',function(req,res){
  res.render('signup',{starting:true})
 })

 router.post('/signup',function(req,res){
  productHelpers.userLogin(req.body);
  res.redirect('/')
 })

 router.post('/login',function(req,res){
  productHelpers.userVerify(req.body).then((respose)=>
  {
    if(respose.status)
    {
      req.session.loggedIn=true
      req.session.user=respose.user;
      productHelpers.getAllproducts(req.session.user.pincode,30000).then((products)=>
      {
        //console.log(products);
       // res.render("index",{admin:true,products});
     // })
     let user=req.session.user
     console.log(user)
      
      //res.render("index",{products,user});
    
    productHelpers.getAllAdds().then((adds)=>
    {
      //console.log(products);
     // res.render("index",{admin:true,products});
   // })
   let user=req.session.user
   console.log("hello world ")
   console.log(adds)
    
    res.render("index",{adds,user,products});
  })
})
    }
    else{
      req.session.loginError=true;
      res.redirect("/");

    }
  })
  
 })
  
 router.get('/login', function(req, res, next) {
 let user=req.session.user
 productHelpers.getAllproducts(req.session.user.pincode,30000).then((products)=>
 {
   //console.log(products);
  // res.render("index",{admin:true,products});
// })
let user=req.session.user
console.log(user)
 
 //res.render("index",{products,user});

productHelpers.getAllAdds().then((adds)=>
{
 //console.log(products);
// res.render("index",{admin:true,products});
// })
let user=req.session.user
console.log("hello world ")
console.log(adds)

res.render("index",{adds,user,products});
})
})
});
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/')
})

//merchant login
router.get('/merchant-login', function(req, res, next) {
  res.render('merchant-login',{starting:true})

 
})
router.post('/merchant-login',(req,res)=>{
  //console.log(req.body)
  productHelpers.merchantVerify(req.body).then((response)=>
  {
    if(response.status)
    {
      req.session.loggedIn=true
     // console.log(response.merchant)
     req.session.merchant=response.merchant;
     
     //console.log("helloxsxxxxw world")
     let merchant=req.session.merchant;
     
     productHelpers.getAllMerchantProducts(merchant._id).then((products)=>
     {
      // console.log(products);
     ////  console.log("line here")
       res.render("admin/view-products",{merchant,admin:true,products});
     })
      
    // console.log(user)
      

      //res.render("admin/view-products",{merchant,products});
   // })
    }
    else{
      console.log("login failed");
      req.session.loginError=true;
      res.redirect("/merchant-login");

    }
  })
  
})



router.get('/merchantLogout', function(req, res, next) {
  delete req.session.merchant;
  req.session.save();
  res.redirect('/login')
})


router.get('/merchantProfile', function(req, res, next) {
let merchant=req.session.merchant
  res.render('merchantProfile',{merchant,admin:true})
})

router.get('/updateMerchantProfile', function(req, res, next) {
  let merchant=req.session.merchant
    res.render('updateMerchantProfile',{merchant,admin:true})
  })

  router.post('/updateMerchantProfile', function(req, res, next) {
    let merchant=req.session.merchant
      productHelpers.updateMerchantProfile(merchant._id,req.body).then((merchant)=>{
    
    
      //req.session.loggedIn=true
     // console.log(response.merchant)
     delete req.session.merchant;
  req.session.save();
     
     //console.log("helloxsxxxxw world")
     req.session.merchant=merchant;
     
     productHelpers.getAllMerchantProducts(merchant._id).then((products)=>
     {
      // console.log(products);
     ////  console.log("line here")
       res.render("admin/view-products",{merchant,admin:true,products});
     })
        
      })
    })


router.get('/merchant-signup',function(req,res){
  res.render('merchant-signup',{starting:true})
 })

router.post('/merchant-signup',async(req,res)=>{
  console.log(req.body)
 let merchant={
  merchant_id:req.body. merchant_id,
  Name:req.body.Name,
  
  email:req.body.email,
  pincode:req.body. pincode,
  gpay:req.body.gpay,
  pw:req.body.pw,
  pw_confirm:req.body.  pw_confirm,
  shop:req.body.shop

 }
 console.log("over over pver ",merchant)
  await  communicationHelpers.merchantVerify(req.body.gpay).then((response)=>{
    let otp=response

  res.render('otpVerification',{starting:true,otp,merchant});
  });

  })
  
 router.post('/Verification',(req,res)=>{
  let otp=req.query.otp;
  
console.log("over over pver ",otp)
console.log(req.body)
let merchantDetails={
  merchant_id:req.query. merchant_id,
  Name:req.query.Name,
  
  email:req.query.email,
  pincode:req.query. pincode,
  gpay:req.query.gpay,
  pw:req.query.pw,
 
  shop:req.query.shop
}
let merchant={
  merchant_id:req.query. merchant_id,
  Name:req.query.Name,
  
  email:req.query.email,
  pincode:req.query. pincode,
  gpay:req.query.gpay,
  pw:req.query.pw,
 
  shop:req.query.shop
}
let matchOtp=req.body.otp;
console.log("over oooooooooo over ",matchOtp,merchant,merchantDetails)

 
//let otp=otpd1+otpd2+otpd3+otpd4;
console.log("final",matchOtp,otp)
if(matchOtp==otp){
  productHelpers.merchantLogin(merchantDetails).then((response)=>{
    res.redirect('/merchant-login')
  })
}else{
  
  res.render('otpVerification',{merchant,otp,verification:false,starting:true})
}
 })     
 




//product
router.get('/admin/add-product',function(req,res){
  let merchant=req.session.merchant;

  res.render('admin/add-product',{admin:true,merchant})
 })
//report product


router.post('/productReport',async function(req, res, next) {
  let proId=req.query.proId

  let reason=req.body.message;
  let user=req.session.user;
  console.log("mnbcbsadjcbsdkjcb,",proId,reason,user)
  await productHelpers.productReport(proId,reason,user).then((response)=>{
    res.redirect('/product-details?proId=' + proId);
  })
   
  })
 
  router.get('/productComplaints',async function(req, res, next) {
    
   
    await productHelpers.getproductReport().then((response)=>{
      let report=response;
      res.render('productReports',{report,superAdminpage:true});
    })
     
    })
router.post('/add-product',function(req,res){
  //console.log("hel")
  let merchant=req.session.merchant;
  //console.log(merchant)
  productHelpers.addProduct(req.body,merchant._id).then((id)=>{
   let image=req.files.Image
  // console.log(id)
   image.mv('./public/images/'+id+'.jpg',(err,done)=>{
     if(err) {
       console.log(err)
 
     }else{
      productHelpers.getAllMerchantProducts(merchant._id).then((products)=>
      {
       // console.log(products);
       // console.log("line here")
        res.render("admin/view-products",{merchant,admin:true,products});
      })
     }
   })
 
 });
 })

 //display cart

 router.get('/views/cart',verifyLogin,async(req,res)=>{
  let products=await productHelpers.getCartProducts(req.session.user._id)
  let totalPrice = products.reduce((acc, products) => acc + parseInt(products.price), 0);
  //const totalPrice = i.reduce((acc, item) => acc + parseInt(item.price), 0);
  //console.log(products)
  //onsole.log(totalPrice)
  res.render('cart',{products,totalPrice})
 })

//remove cart product



 router.get('/views/forgotpassword',function(req,res){
  res.render('forgotpassword',{starting:true});
 });





 router.post('/views/getpassword',function(req,res){
  productHelpers.getPassword(req.body).then((result)=>{
    if(result.status){
       
      console.log(result)
      res.render("forgotpassword",{starting:true,result,emailprescent:true});
      communicationHelpers.passwordSent(result.user)
     
    }
    else{
      let emailprescent=false;
      res.render('getpassword',{starting:true,emailprescent,})
    }
  })
 })
 //remove product by the mechant
 router.get('/removeProduct',(req,res)=>{
  let merchant=req.session.merchant;
  let proId=req.query.id;
  console.log(proId)
  productHelpers.removeProduct(proId).then((response)=>{
    productHelpers.getAllMerchantProducts(merchant._id).then((products)=>
      {
       // console.log(products);
       // console.log("line here")
        res.render("admin/view-products",{merchant,admin:true,products});
      })
  }
  )
 
 })
 //add to cart
 router.get('/add-to-cart',(req,res)=>{
  let proId=req.query.proId;
  console.log(proId);
  productHelpers.addToCart(proId,req.session.user._id).then((response)=>{
    res.redirect('/login')
  })
 })
//product details

router.get('/product-details',function(req,res){
  let proId=req.query.proId;
  if(proId){
  let product=productHelpers.getProductDetails(proId).then((product)=>{
    productHelpers.getProductReview(proId).then((review)=>{
      let reviews=review
      console.log(review)
    let user=req.session.user
    res.render('product-details',{product,reviews,user})

    })
    
    
  })
}
else{
  let proId=proId
  let product=productHelpers.getProductDetails(proId).then((product)=>{
    console.log(product)
    let user=req.session.user
    res.render('product-details',{product,user})
    
  })

}
})

//merchant product details


router.get('/merchantViewProduct',function(req,res){
  let proId=req.query.proId;
  
  let product=productHelpers.getProductDetails(proId).then((product)=>{
    console.log(product)
    let merchant=req.session.merchant
    res.render('merchantViewProduct',{product,admin:true,merchant})
    
  })
})

//update product

router.get('/updateProduct', function(req, res, next) {
  let proId=req.query.proId
  console.log("mnbcbsadjcbsdkjcb,",proId)
  let merchant=req.session.merchant
    res.render('updateProduct',{merchant,admin:true,proId})
  })


  router.post('/updateProduct', function(req, res, next) {
    let merchant=req.session.merchant
    let proId=req.query.proId
      productHelpers.updateProduct(proId,req.body).then((product)=>{
    
    
      //req.session.loggedIn=true
     //adds
     
     productHelpers.getAllMerchantProducts(merchant._id).then((products)=>
     {
      // console.log(products);
     ////  console.log("line here")
       res.render("admin/view-products",{merchant,admin:true,products});
     })
        
      })
    })
    //order confirmed
    router.get('/orderConfirmed',function(req,res){
      let ordId=req.query.ordId
     productHelpers.orderConfirmed(ordId).then((response)=>{
    res.redirect('/merchant-orders')
     })
     });

     router.get('/productPacked',function(req,res){
      let ordId=req.query.ordId
     productHelpers.productPacked(ordId).then((response)=>{
    res.redirect('/merchant-orders')
     })
     });

     router.get('/outForDelivey',function(req,res){
      let ordId=req.query.ordId
     productHelpers.outForDelivey(ordId).then((response)=>{
    res.redirect('/merchant-orders')
     })
     });

     router.get('/delivered',async function(req,res){
      let ordId=req.query.ordId
     await communicationHelpers.productDelivered(ordId).then((result)=>{
      let otp=result;
     
    res.render('deliveryverification',{starting:true,otp,ordId})
     })
    })


    router.post('/finalDelivery',async function(req,res){
      let userotp=req.query.otp
      let ordId=req.query.ordId
     if(req.body.otp==userotp){
      productHelpers.finalDelivery(ordId).then((response)=>{
        res.redirect('/merchant-orders')
         })
     }else{
      let otp=userotp
      res.render('deliveryverification',{starting:true,otp,verification:false})
     
     }
     
    
     })
    
     
//product enquiry

router.post("/productenquiry",(req,res)=>{

  let proId=req.query.proId;
  communicationHelpers.productEnquiry(proId,req.body,req.session.user).then((response)=>{
    res.redirect('/product-details?proId=' + proId);
  })
})


 router.get('/remove-cart-product',function(req,res){
  proId=req.query.proId;
  //console.log("hello world")
  console.log(proId)
  productHelpers.remove_cart_item(proId,req.session.user._id).then((response)=>{
    res.redirect('/views/cart')
  })
  
  })
  //place order

 router.get('/cart-place-order',async(req,res)=>{
  let products=await productHelpers.getCartProducts(req.session.user._id)
  let total = products.reduce((acc, products) => acc + parseInt(products.price), 0);

  res.render('cart-order',{total})
 })

 router.get('/place-order-single',function(req,res){
  let proId=req.query.proId;
  let total=req.query.cost;  
  res.render('place-order',{total,proId,total})
 })


 router.post('/place-order',async(req,res)=>{
  console.log('hello world')
  let proId=new objectId(req.query.proId);
 // console.log("helllllllllllllllllllllllllllll",proId)
  let cost=req.query.cost;
  if(proId){
  //  console.log("hellllllll")
    let products=proId;
    let total=cost;
    
  productHelpers.placeOrder(req.body,products,total,req.session.user._id,{single:true}).then((response)=>{
    communicationHelpers.message(products,req.body)

  res.render('orderPlacedDone')
  } )

  }
  
})


router.post('/cart-order',async(req,res)=>{
  console.log('hello world')
  
 
    //console.log("hello world",proId)
    let product=await productHelpers.getCartProducts(req.session.user._id)
  let products=await productHelpers.getCartProductList(req.session.user._id)
  let total = product.reduce((acc, product) => acc + parseInt(product.price), 0);
  console.log('hello world',total)
  productHelpers.cartOrder(req.body,products,total,req.session.user._id).then((response)=>{
    res.render('orderPlacedDone')
  
  } )
})
  router.get('/cancel-order',async(req,res)=>{
    console.log('hello world')
    let ordId=new objectId(req.query.ordId);
   // console.log("helllllllllllllllllllllllllllll",proId)
    
    
    //  console.log("hellllllll")
     
      
    productHelpers.cancelOrder(ordId).then((response)=>{
      
  
    res.redirect('/view-orders')
    } )
  
    
    
  })
  
  
  

 router.get('/view-orders',async(req,res)=>{
  await productHelpers.orderDetails(req.session.user._id).then(async(products,delivered)=>{
    await productHelpers.deliveredOrder(req.session.user._id).then((delivered)=>{
      console.log("jsjsjsjs",products)
    res.render('view-orders',{products,delivered,user:req.session.user})

  })
})

 })


 //product rewiew adding
 router.get('/addReview',async(req,res)=>{
  let proId=req.query.proId
  console.log("cscsdsd",proId)
    res.render('addProductReview',{proId,starting:true,user:req.session.user})

  })

  router.post('/addProductRewiew',async(req,res)=>{

    let details=req.body
    let proId=req.query.proId
    let user=req.session.user;
   
    console.log(req.body,user)
    


     await productHelpers.addProductRewiew(proId,user,details).then((id)=>{
      console.log("iixixixixixixix",id)
      let image=req.files.Image
     // console.log(id)
      image.mv('./public/images/'+id+'.jpg',(err,done)=>{
        if(err) {
          console.log(err)
    
        }else{
          res.redirect('/view-orders')
        }
      })
    })
  })
 

 
 // console.log(req.body,products,)
 //}//)

//admin home page loading withoute verification
 router.get('/adminAllProducts',(req,res)=>{
 
  console.log("helloxsxxxxw world")
  let merchant=req.session.merchant;
  
  productHelpers.getAllMerchantProducts(merchant._id).then((products)=>
  {
   // console.log(products);
  ////  console.log("line here")
    res.render("admin/view-products",{merchant,admin:true,products});
  })
 })

 //Add application
 router.get("/adds",function(req,res){
  productHelpers.getMerchantAllAdds(req.session.merchant._id).then((adds)=>
    {
      //console.log(products);
     // res.render("index",{admin:true,products});
   // })
   let user=req.session.user
   console.log("hello world ")
   console.log(adds)
   let merchant=req.session.merchant;
    res.render("adds",{adds,admin:true,merchant});
  })
  //  res.render("admin/add-application",{admin:true});
 })

 router.get("/admin/add-application",(req,res)=>{
  let merchant=req.session.merchant;
  res.render("admin/add-application",{admin:true,merchant});
 })

 router.post('/add-application',function(req,res){
  //console.log("hel")
  let merchant=req.session.merchant;
  //console.log(merchant)
  productHelpers.addApplication(req.body,merchant._id).then((id)=>{
   let image=req.files.Image
   let add=id
  // console.log(id)
   image.mv('./public/images/'+id+'.jpg',(err,done)=>{
     if(err) {
       console.log(err)
 
     }else{
   res.render('addAddProducts',{add,admin:true})
     }
   })
   
 });
 })
router.get('/add-productmore',function(req,res){
  //console.log("hel")
  let merchant=req.session.merchant;
  //console.log(merchant)
  
   
   let add=req.query.id
  // console.log(id)
   
   res.render('addAddProducts',{add,merchant,admin:true})
     
   
 
 
 })

 
router.post('/addaddproduct',function(req,res){
  //console.log("hel")
  let merchant=req.session.merchant;
  let add=req.query.add
  //console.log(merchant)
  productHelpers.addaddProduct(req.body,merchant._id,add).then((id)=>{
   let image=req.files.Image
  // console.log(id)
   image.mv('./public/images/'+id+'.jpg',(err,done)=>{
     if(err) {
       console.log(err)
 
     }else {
        res.render('addaddproductsucess',{superAdmin:true,merchant,add})
     }
   })
 
 });
 })
 //display add products for merchants

 router.get("/displayAddProducts",(req,res)=>{
  let merchant=req.session.merchant
  console.log("reched here")
  let addId=req.query.add
    productHelpers.getAddProducts(addId).then((products)=>{
      res.render('addProducts',{products,merchant,admin:true})
    })
   })

 router.get("/addItems",(req,res)=>{
let addId=req.query.addId
  productHelpers.getAddProducts(addId).then((products)=>{
    res.render('addProducts',{products,admin:true})
  })
 })

//ALL orders
router.get('/merchant-orders',(req,res)=>{
  productHelpers.getAllMerchantOrders(req.session.merchant._id).then((result)=>{
   // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhelo",result)
   let merchant=req.session.merchant;
    res.render('merchantAllOrders',{result,admin:true,merchant})
  })
})

 //Super Admin Page

 router.post('/superAdminLogin',(req,res)=>{
if(req.body.username=="superAdmin"){
  
  if(req.body.password=='password'){
  productHelpers.getAllAdds().then((adds)=>
  {
    //console.log(products);
   // res.render("index",{admin:true,products});
 // })
 //let user=req.session.user
 console.log("hello world ")
 //console.log(adds[0].res)/views/getpassword
  
  res.render("superAdminPage",{adds,superAdminpage:true});
})
  }else{
    res.render("superAdmin",{loginErr:true,superAdmin:true});
  }
}else{

    console.log("hello world ")
    
  res.render("superAdmin",{loginErr:true,superAdmin:true});
}
  
})


//Super admin controls
router.get('/AdvertisementApplication',(req,res)=>{
 
   // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhelo",result)
   productHelpers.getAllAddsget().then((adds)=>
  {
    //console.log(products);
   // res.render("index",{admin:true,products});
 // })
 //let user=req.session.user
 console.log("hello world ")
 //console.log(adds[0].res)/views/getpassword
  
  res.render("AdvertisementApplication",{adds,superAdminpage:true});
})

router.get('/addrejected',async(req,res)=>{
  addId=req.query.addId;
  //console.log("heeeeeeeeeeeee",addId)
   await communicationHelpers.addRejected(addId).then((response)=>{
  productHelpers.addRejected(addId).then((response)=>{
    res.redirect('/AdvertisementApplication')
   // communicationHelpers.addRejected(addId)
  })
})
});


router.get('/addapproved',async(req,res)=>{
  addId=req.query.addId;
  //console.log("heeeeeeeeeeeee",addId)
   await communicationHelpers.addApproved(addId).then((response)=>{
  productHelpers.addApproved(addId).then((response)=>{
    res.redirect('/AdvertisementApplication')
   // communicationHelpers.addRejected(addId)
  })
})
});
//get all adds
router.get("/approveedApplications",function(req,res){
  productHelpers.getAllAdds().then((adds)=>
    {
      //console.log(products);
     // res.render("index",{admin:true,products});
  
   console.log("hello world ")
   //console.log(adds)
   
    res.render("approvedApplcations",{adds,superAdminpage:true});
  })
  //  res.render("admin/add-application",{admin:true});
 })
 router.get("/superAdminHome",(req,res)=>{
  
  res.render("superAdminPage",{superAdminpage:true});
 })

})

module.exports = router;
//res.render('getpassword',{starting:true,result,emailPrescent,})