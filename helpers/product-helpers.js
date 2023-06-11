const { MongoClient } = require('mongodb')
var objectId=require('mongodb').ObjectId
const exphbs = require('express-handlebars');
var  nearestHelpers=require('../helpers/nearestPincodes');
const geolib = require('geolib');
const axios = require('axios');
const { response } = require('express');
const { promises } = require('nodemailer/lib/xoauth2');
// Create Instance of MongoClient for mongodb
const client = new MongoClient('mongodb://127.0.0.1:27017')

// Connect to database
client.connect()
    .then(() => console.log('Connected Successfully'))
    .catch(error => console.log('Failed to connect', error))
   //client.close()

   

   async function getCoordinatesFromPincode(pincode) {
     try {
       const response = await axios.get(
         `https://api.opencagedata.com/geocode/v1/json?key=a2ab0c6654fa4a708bf4369e8cfd1c0b&q=${pincode}`
       );
   
       if (
         response.data &&
         response.data.results &&
         response.data.results.length > 0
       ) {
         const latitude = response.data.results[0].geometry.lat;
         const longitude = response.data.results[0].geometry.lng;
         return { latitude, longitude };
       } else {
         throw new Error('Invalid pincode');
       }
     } catch (error) {
       throw new Error('Error retrieving coordinates');
     }
   }
   
   // Usage
   
   


module.exports={
    addProduct:(product,merchantId)=>{
        return new Promise((resolve,reject)=>{
            async function getCoordinatesFromPincode(pincode) {
                try {
                  const response = await axios.get(
                    `https://api.opencagedata.com/geocode/v1/json?key=a2ab0c6654fa4a708bf4369e8cfd1c0b&q=${pincode}`
                  );
              
                  if (
                    response.data &&
                    response.data.results &&
                    response.data.results.length > 0
                  ) {
                    const latitude = response.data.results[0].geometry.lat;
                    const longitude = response.data.results[0].geometry.lng;
                    return { latitude, longitude };
                  } else {
                    throw new Error('Invalid pincode');
                  }
                } catch (error) {
                  throw new Error('Error retrieving coordinates');
                }
              }
      let pincode=product.Pincode;
      const apiKey = ' a2ab0c6654fa4a708bf4369e8cfd1c0b';      
            getCoordinatesFromPincode(pincode, apiKey)
            .then((coordinates) => {
              //console.log("hello world2")
              console.log(`Latitude: ${coordinates.latitude}`);
              console.log(`Longitude: ${coordinates.longitude}`);
         let productLocation={
            Pincode:product.Pincode,
            latitude:coordinates.latitude, // Replace with the actual latitude value
          longitude: coordinates.longitude 
         }
         
         console.log("product details",product)
            let proObj={

            
          m_id:new objectId(merchantId)
          ,Name:product.Name,
          Category:product.Category,
          price:product.Price,
          Description:product.Description,
          Highlight:product.Highlights,
          offer:product.Offer,
          Pincode:product.Pincode,
          latitude:coordinates.latitude, // Replace with the actual latitude value
          longitude: coordinates.longitude ,
          shopName:product.shopName
        }
        console.log(proObj)
        client.db('project').collection('productLocation').insertOne(productLocation)
        client.db('project').collection('product').insertOne(proObj).then(data=>{
            console.log(data)
            resolve(data.insertedId)
        })
    })
            
        })
    },

    //update peoduct

    updateProduct:(proId,details)=>{
      console.log("reached here",proId)
    return new Promise(async (resolve, reject) => {
      console.log("reached here2",proId)
      let filter = { _id: new objectId(proId) };
      let update = { $set: {Name : details.Name,Category:details.Category,price:details.price,Description:details.Description,Highlight:details.Highlight,offer:details.offer,shopName:details.shopName } };
    await client.db('project').collection("product").updateOne(filter,update).then(async(response)=>{
      console.log("reached here3",proId)
      let product= await client.db('project').collection("product").findOne({_id:new objectId(proId)})
      resolve()
    })
     
    // resolve()
  
  } )
  },
  getAllproducts: (pincode, range) => {
    return new Promise(async (resolve, reject) => {
      let locations = await client.db('project').collection('productLocation').find().toArray();

      function getPinCodesWithinRange(pincode) {
        const baseLocation = locations.find(loc => loc.Pincode === pincode);
      
        if (!baseLocation) {
          console.log('Pin code not found!');
          return [];
        }
      
        const { latitude, longitude } = baseLocation;
      
        const nearbyLocations = locations.filter(loc => {
          if (loc.Pincode !== pincode) {
            const distance = geolib.getDistance(
              { latitude, longitude },
              { latitude: loc.latitude, longitude: loc.longitude }
            );
            return distance <= range; // Distance in meters (30km)
          }
      
          return false;
        });
      
        return nearbyLocations.map(loc => loc.Pincode);
      }
      
      
      
      let basePincode = pincode;
      let nearbyPincodes =getPinCodesWithinRange(basePincode);
      nearbyPincodes.push(pincode);
      console.log('Nearby pincodes:', nearbyPincodes);
  
      let products = await client.db('project').collection('product').find({ Pincode: { $in: nearbyPincodes } }).toArray();
      resolve(products);
    });
  },
  
userLogin:(details,callback)=>
{
    console.log(details)
    //console.log("hellow world")
let user={};

    async function getCoordinatesFromPincode(pincode) {
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?key=a2ab0c6654fa4a708bf4369e8cfd1c0b&q=${pincode}`
          );
      
          if (
            response.data &&
            response.data.results &&
            response.data.results.length > 0
          ) {
            const latitude = response.data.results[0].geometry.lat;
            const longitude = response.data.results[0].geometry.lng;
            return { latitude, longitude };
          } else {
            throw new Error('Invalid pincode');
          }
        } catch (error) {
          throw new Error('Error retrieving coordinates');
        }
      }
      
    let pincode = details.pincode // Replace with the desired pincod
    const apiKey = ' a2ab0c6654fa4a708bf4369e8cfd1c0b'; // Replace with your OpenCage API key
    


    getCoordinatesFromPincode(pincode, apiKey)
      .then((coordinates) => {
        //console.log("hello world2")
        console.log(`Latitude: ${coordinates.latitude}`);
        console.log(`Longitude: ${coordinates.longitude}`);
        user = {
            name:details.Name,
            email:details.email,
            pincode:details.pincode,
            latitude:coordinates.latitude, // Replace with the actual latitude value
            longitude: coordinates.longitude ,// Replace with the actual longitude value
            pw:details.pw,
            pw_confirm:details.pw_confirm,
          
          };
          client.db('project').collection('userLogin').insertOne(user).then((data)=>{
            console.log(data);
            //callback(done)
        }) 
      })
      .catch((error) => {
        console.error(error.message);
      });
     console.log(user)
   

},
userVerify:(userData)=>{

    return new Promise(async(resolve,reject)=>{
        let loginStatus=false;
        respose={}
        let user=await client.db('project').collection('userLogin').findOne({email:userData.email})
        console.log("hello")
        console.log(user)
        if(user){
        if(user.pw==userData.password)
        {
            respose.user=user;
            respose.status=true;
            resolve(respose)
        }
        else{
            resolve({status:false})
        }
    }else{
        resolve({status:false})
    }
    })
},
getPassword:(userData)=>{

    return new Promise(async(resolve,reject)=>{
       
    respose={}
    let user=await  client.db('project').collection('userLogin').findOne({email:userData.email}) 
    if(user){
        respose.status=true;
        respose.user=user;
        resolve(respose)
    }
    else{
        resolve({status:false})
    }
    })
},
//remove product
removeProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
        client.db('project').collection('product').deleteOne({_id:new objectId(proId)}).then((response)=>{
            resolve(response)
        })
    })    

},
addToCart:(prodId,userId)=>{
    return new Promise(async(resolve,reject)=>{
        let userCart=await  client.db('project').collection('cart').findOne({user:new objectId(userId)})
            if(userCart){

                client.db('project').collection('cart').updateOne({user:new objectId(userId)},{
                    $push:{cartItems:new objectId(prodId)}
                }
                   
            ).then((response)=>{
                resolve()
            })
        }
            else{
                let cartObj={

                
                user:new objectId(userId),
                cartItems:[new objectId(prodId)]
            }
            client.db('project').collection('cart').insertOne(cartObj).then((respose)=>{
                resolve()
            })
        }
    })
},
//removing product from the cart
remove_cart_item: (prodId, userId) => {
    return new Promise(async (resolve, reject) => {
        let userCart = await client.db('project').collection('cart').findOne({ user: new objectId(userId) });
        if (userCart) {
            client.db('project').collection('cart').updateOne(
                { user: new objectId(userId) },
                { $pull: { cartItems: new objectId(prodId) } }
            ).then((response) => {
                resolve();
            });
        }
    });
}
,
//getCartProducts crtical section
getCartProducts:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        
        let cartItems=await client.db('project').collection('cart').aggregate([
            {
                $match:{user:new objectId(userId)}
            },
            {
                $lookup:{
                    from:'product',
                    let:{proList:'$cartItems'},
                    pipeline:[//condition writing
                        {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$proList"]
                                    }
                                }
                        }
                    ],
                    as:'cartItems'
                    
                }
            }
        ]).toArray()
        if(cartItems){
           // console.log(cartItems[0].cartItems)
        resolve(cartItems[0].cartItems)
        }else{
                resolve({status:false})
        }
    })
},
//cancel order

cancelOrder:(order)=>{
  return new Promise(async(resolve,reject)=>{
      await client.db('project').collection('singleOrder').deleteOne({_id:new objectId(order)}).then((response)=>{
        resolve()
      })
  //    console.log(product)

  })
},
//get product details

getProductDetails:(prodID)=>{
    return new Promise(async(resolve,reject)=>{
        let product=await client.db('project').collection('product').findOne({_id:new objectId(prodID)})
    //    console.log(product)
        resolve(product)
    })
},

getProductReview:(prodID)=>{
  return new Promise(async(resolve,reject)=>{
      let reviews=await client.db('project').collection('productReview').find({proId:new objectId(prodID)}).toArray()
  //    console.log(product)
      resolve(reviews)
  })
},
//merchant login

merchantLogin:(merchantId)=>{
  return new Promise(async(resolve,reject)=>{
    console.log(merchantId)
    client.db('project').collection('merchantLogin').insertOne(merchantId).then((data)=>{
        console.log(data);
        resolve()
    })
  })
},
//merchant verify
merchantVerify:(merchantData)=>{

    return new Promise(async(resolve,reject)=>{
        let loginStatus=false;
        respose={}
        let merchant=await client.db('project').collection('merchantLogin').findOne({email:merchantData.email})
        console.log("found");
        if(merchant){
            console.log(merchant)
        if(merchant.pw==merchantData.pw)
        {
            //consoloe.log("found2")
            respose.merchant=merchant;
            respose.status=true;
            resolve(respose)
        }
        else{
            console.log("found3")
            resolve({status:false})
        }
    }else{
        resolve({status:false})
    }
    })
},
//merchnat items picking
getAllMerchantProducts:(merchantId)=>{
    return new Promise(async(resolve,reject)=>{
       // console.log(merchantId)
        try {
            let products = await client.db("project").collection("product").find({ m_id:new objectId(merchantId) }).toArray();
            //console.log(products);
            resolve(products);
          } catch (err) {
            console.error(err);
            reject(err);
          }
          
    })
},

//add applications

addApplication:(details,merchant)=>{
    return new Promise((resolve,reject)=>{
        let add={
            m_id:new objectId(merchant),
            Name:details.Name,
            Category:details.Category,
            status:"pending"
            //price:product.Price,
            //Description:product.Description,
            //Pincode:product.Pincode
        }
        client.db('project').collection('addApplication').insertOne(add).then(data=>{
            resolve(data.insertedId)
        })
    })
},
addaddProduct:(product,merchantId,addId)=>{
    return new Promise((resolve,reject)=>{
    let proObj={

         addId:new objectId(addId),   
        m_id:new objectId(merchantId)
        ,Name:product.Name,
        Category:product.Category,
        price:product.Price,
        Description:product.Description,
        
        shopName:product.shopName
      }
      client.db('project').collection('addProducts').insertOne(proObj).then(data=>{
        console.log(data)
        resolve(data.insertedId)
    })
    })
},
getAllAdds: () => {
    return new Promise(async (resolve, reject) => {
      try {
       let result= await client
          .db('project')
          .collection('addApplication')
          .aggregate([
            {
              $lookup: {
                from: 'merchantLogin',
                localField: 'm_id',
                foreignField: '_id',
                as: 'res',
              },
            },
            {
              $match: {
                status:"Approved", // Assuming there's an 'approved' field in your 'addApplication' collection
              },
            },
          ])
          .toArray();
          console.log(result.res)
          result.forEach((document) => {
            console.log('Document:', document);
          
          });
  
        // Close the connection
        
  
        resolve(result);
      } catch (err) {
        console.error('Error occurred during aggregation:', err);
        reject(err);
      }
    });
  },

  
  getAllAddsget: () => {
    return new Promise(async (resolve, reject) => {
      try {
       let result= await client
          .db('project')
          .collection('addApplication')
          .aggregate([
            {
              $lookup: {
                from: 'merchantLogin',
                localField: 'm_id',
                foreignField: '_id',
                as: 'res',
              },
            },
            {
              $match: {
                status:"pending", // Assuming there's an 'approved' field in your 'addApplication' collection
              },
            },
          ])
          .toArray();
          console.log(result.res)
          result.forEach((document) => {
            console.log('Document:', document);
          
          });
  
        // Close the connection
        
  
        resolve(result);
      } catch (err) {
        console.error('Error occurred during aggregation:', err);
        reject(err);
      }
    });
  },


  updateMerchantProfile:(merchantId,details)=>{
    return new Promise(async (resolve, reject) => {
      let filter = { _id: new objectId(merchantId) };
      let update = { $set: {Name : details.Name,email:details.email,pincode:details.pincode,gpay:details.gpay,shop:details.shop } };
    await client.db('project').collection("merchantLogin").updateOne(filter,update).then(async(response)=>{
      let merchant= await client.db('project').collection("merchantLogin").findOne({_id:new objectId(merchantId)})
      resolve(merchant)
    })
     
    // resolve()
  
  } )
  },
  
getMerchantAllAdds:(merchant)=>{
    
        return new Promise(async(resolve,reject)=>{
            let adds=await client.db('project').collection('addApplication').find({m_id:new objectId(merchant)}).toArray()
            resolve(adds)
        })

},
getAddProducts:(addId)=>{
    return new Promise(async(resolve,reject)=>{

        let products=await client.db('project').collection('addProducts').find({addId:new objectId(addId)}).toArray()
        console.log(addId)
        resolve(products)
        console.log(products)
    })
},
getCartProductList:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        let cart=await client.db('project').collection('cart').findOne({user:new objectId(userId)})
        console.log(cart)
        resolve(cart.cartItems)
    })
},
placeOrder:(order,products,total,user,single)=>{
    if(single){
        return new Promise((resolve,reject)=>{
            console.log(order,products,total)
            let status=order['payment-method']==='COD'?'placed':'Placed'
            
            let orderObj={
                delivery:{
                    mobile:order.mobile,
                    address:order.address,
                    pincode:order.pincode,
                    email:order.emal,
                    city:order.city,
                    date:new Date()
    
                },
                userId:new objectId(user),
                PaymentMethod:order['payment-method'],
                product:products,
                status:status
            }
            client.db('project').collection('singleOrder').insertOne(orderObj).then((response)=>{
               
                resolve()
    
            })
        
        //client.db('project').collection('cart').deleteOne({user:new objectId(user)})
        })
    }
    
},
cartOrder:(order,products,total,user)=>{
  
  

  return new Promise((resolve,reject)=>{
      
      let status=order['payment-method']==='COD'?'placed':'placed'
      for(i=0;i<products.length;i++){
        let orderObj={
          delivery:{
              mobile:order.mobile,
              address:order.address,
              pincode:order.pincode,
              email:order.emal,
              city:order.city,
              date:new Date()

          },
          userId:new objectId(user),
          PaymentMethod:order['payment-method'],
          product:products[i],
          status:status
      }
      console.log("kjhkjhkjhkjh",orderObj)
      client.db('project').collection('singleOrder').insertOne(orderObj).then((response)=>{
         
          resolve()

      })
  }
  client.db('project').collection('cart').deleteOne({user:new objectId(user)})
  })

},

orderDetails: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("kkkkkkkkkkkk")
        let order = await client.db('project').collection('singleOrder').find({ userId: new objectId(user) ,status: { $ne: "Product Delivered" } }).toArray();
       // let deliveredOrders=await client.db('project').collection('singleOrder').find({ userId: new objectId(user) ,status: { $in: ["Product Delivered"] } }).toArray();
        console.log(order);
        console.log("kkkkkkkkkkkk")

        resolve(order);
      } catch (error) {
        reject(error);
      }
    });
  }
  ,
  deliveredOrder: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("kkkkkkkkkkkk")
        //let order = await client.db('project').collection('singleOrder').find({ userId: new objectId(user) ,status: { $ne: "Product Delivered" } }).toArray();
        let deliveredOrders=await client.db('project').collection('singleOrder').find({ userId: new objectId(user) ,status: { $in: ["Product Delivered"] } }).toArray();
       // console.log(order);
        console.log("kkkkkkkkkkkk")

        resolve(deliveredOrders);
      } catch (error) {
        reject(error);
      }
    });
  },

  //add product review


  addProductRewiew:(proId,user,details)=>{
    return new Promise(async(resolve,reject)=>{
    
     let review={
      proId:new objectId(proId),
      userId:new objectId(user._Id),
      Name:details.name,
       userName:user.Name,
         rating:details.rating,
       review:details.review,
        date:new Date()
     }
       await client.db('project').collection("productReview").insertOne(review).then((response)=>{
        console.log("Sxxmxm<xm",response)
         resolve(response.insertedId)
       })
      
    })
    },
    //product Report

    productReport:async(proId,reason,user)=>{
      return new Promise(async(resolve,reject)=>{
      let product= await client.db('project').collection("product").findOne({_id:new objectId(proId)})
       let report={
        proId:new objectId(proId),
        userId:new objectId(user._Id),
        productName:product.Name,
        userName:user.Name,
        why:reason,
         
          date:new Date()
       }
         await client.db('project').collection("productReport").insertOne(report).then((response)=>{
          console.log("Sxxmxm<xm",response)
           resolve()
         })
        
      })
      },

      getproductReport:async(proId,reason,user)=>{
        return new Promise(async(resolve,reject)=>{
        
           await client.db('project').collection("productReport").find().toArray().then((response)=>{
            console.log("Sxxmxm<xm",response)
             resolve(response)
           })
          
        })
        },
  //get all merchant orders
getAllMerchantOrders:(merchant)=>{
    return new Promise(async(resolve,reject)=>{
        let products=await client.db('project').collection('product').find({m_id:new objectId(merchant)}).toArray()
        
          
          // Create a new array with only the names
          let merchantProducts = products.map(product => product._id);
          
          console.log(merchantProducts);
         // resolve() 
          let myOrders=await client.db('project').collection('singleOrder').find({ product: { $in:merchantProducts },status: { $ne: "Product Delivered" }  }).toArray();
          resolve(myOrders)
    })
},
 //status change
 
 
 orderConfirmed:(order)=>{
 return new Promise(async(resolve,reject)=>{
  let filter = { _id: new objectId(order) };
    let update = { $set: { status: 'Order Confirmed' } };
    await client.db('project').collection("singleOrder").updateOne(filter,update),
    resolve()
 })
 },
 productPacked:(order)=>{
  return new Promise(async(resolve,reject)=>{
   let filter = { _id: new objectId(order) };
     let update = { $set: { status: 'Product Packed ' } };
     await client.db('project').collection("singleOrder").updateOne(filter,update),
     resolve()
  })
  },
  

  outForDelivey:(order)=>{
    return new Promise(async(resolve,reject)=>{
     let filter = { _id: new objectId(order) };
       let update = { $set: { status: 'Out For Delivey! ' } };
       await client.db('project').collection("singleOrder").updateOne(filter,update),
       resolve()
    })
    },
    finalDelivery:(order)=>{
      return new Promise(async(resolve,reject)=>{
       let filter = { _id: new objectId(order) };
         let update = { $set: { status: 'Product Delivered' } };
         await client.db('project').collection("singleOrder").updateOne(filter,update),
         resolve()
      })
      },
   
//superAdmin controls
addRejected:(addId)=>{
  return new Promise(async (resolve, reject) => {
    let filter = { _id: new objectId(addId) };
    let update = { $set: { status: 'Rejected' } };
  await client.db('project').collection("addApplication").updateOne(filter,update)
   
   resolve()

} )
},
addApproved:(addId)=>{
  return new Promise(async (resolve, reject) => {
    let filter = { _id: new objectId(addId) };
    let update = { $set: { status: 'Approved' } };
  await client.db('project').collection("addApplication").updateOne(filter,update),
   
   resolve()

} )
}
}


