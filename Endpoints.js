const {readDatabase , writeDatabase} = require('./ModulesToImport.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const LoginFile = './Functions/Database/LoginDetails.json';
const ProductFile = './Functions/Database/ProductDetails.json'
const secret_key = "qwertyuiopkjhgf987654g[;,mhgdxcvbnl;jhtrdcvbnkl;lkjhg"

const SignUp = function (req,res){
    const login_database = readDatabase(LoginFile);
    const product_database = readDatabase(ProductFile);
    let id ;
    if(login_database.length==0){
        id = 1 ;
    }else{
        id = login_database[login_database.length-1].UserId + 1 ;
        for(let i = 0  ; i < login_database.length ; i++){
            if(login_database[i].Email==req.body.Email){
                return res.status(400).json({
                    msg : "Email already Registered"
                })
            }
        }
    }
    const Crypted_Password = bcrypt.hashSync(req.body.Password,8);
    const newSignUp = {
        UserId : id,
        Email : req.body.Email,
        Name : req.body.Name,
        Password : Crypted_Password,
        Contact : req.body.Contact
    }
    login_database.push(newSignUp);
    writeDatabase(LoginFile,login_database);

    const products = {
        UserId : id,
        Products : []
    }
    product_database.push(products);
    writeDatabase(ProductFile,product_database);
    const token = jwt.sign({UserId:id},secret_key)
    return res.status(202).json({
        msg : "Login Successfull",
        token : token
    })
}


const Login = function(req,res){
    const login_database = readDatabase(LoginFile);
    for(let i = 0 ; i < login_database.length ; i++ ){
        if(login_database[i].Email == req.body.Email ){
            if(bcrypt.compareSync(req.body.Password,login_database[i].Password)){
                const token = jwt.sign({UserId:login_database[i].UserId},secret_key,{ expiresIn: '1h' })
                return res.status(202).json({
                    msg : "Login Successfull",
                    token : token
                })
            }else{
                res.status(400).json({
                    msg : "Incorrect Password..."
                })
            }
        }
    }
    res.status(401).json({
        msg : "Recheck Your Email ID "
    })
}

const UpdateProfile = function(req,res){
    const login_database = readDatabase(LoginFile);
    for(let i = 0; i< login_database.length;i++){
        if(req.user.UserId==login_database[i].UserId){
            login_database[i].Name = req.body.Name;
            login_database[i].Contact = req.body.Contact;
            login_database[i].Email = req.body.Email;
            writeDatabase(LoginFile,login_database);
            res.status(202).json({
                msg : "Updated Data "
            });
        }
    }
    res.status(401).json({
        msg : "Email Lost",
    })
}

const ChangePassword = function(req,res){
    const login_database = readDatabase(LoginFile);
    for(let i = 0; i< login_database.length;i++){
        if(req.user.UserId==login_database[i].UserId){
            if(bcrypt.compareSync(req.body.oldPassword,login_database[i].Password)){
                login_database[i].Password = bcrypt.hashSync(req.body.newPassword,8);
                writeDatabase(LoginFile,login_database);
                return res.status(200).json({
                    msg : "Updated Successfuly"
                })
            }else{
                return res.status(402).json({
                    msg : "Old Password is Incorrect"
                })
            }
        }
    }
    res.status(401).json({
        msg : "Email Lost",
    })
}


const AccountDelete = function(req,res){
    const login_database = readDatabase(LoginFile);
    const product_database = readDatabase(ProductFile);
    for(let i = 0 ; i < login_database.length ; i++ ){
        if(login_database[i].Email == req.body.Email ){
            if(bcrypt.compareSync(req.body.Password,login_database[i].Password)){
                login_database.splice(i,1); 
                writeDatabase(LoginFile,login_database);
                product_database.splice(i,1);
                writeDatabase(ProductFile,product_database);
                return res.status(200).json({
                    msg : "Account Deleted"
                })
            }else{ 
                return res.status(400).json({
                    msg : "Incorrect Password..."
                })
            }
        }
    }
    return res.status(401).status({
        msg : "Recheck Your Email ID "
    })
}

const AddProduct = function(req,res){
    const product_database = readDatabase(ProductFile);
    for(let i = 0 ; i < product_database.length ; i++ ){
        if(req.user.UserId==product_database[i].UserId){
            let productId ;
            if(product_database[i].Products == 0){
                productId = 1;
            }else{
                productId = product_database[i].Products[product_database[i].Products.length-1].productId +1 ;
            }
            const timeInIST = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });
            const newProduct = {
                productId : productId,
                uniqueId : req.user.UserId +"."+productId,
                ProductName : req.body.ProductName,
                Quantity : req.body.Quantity,
                Price : req.body.Price,
                NightCharge : req.body.NightCharge,
                Extra : req.body.Extra,
                DateTime : timeInIST
            }
            product_database[i].Products.push(newProduct);
            writeDatabase(ProductFile,product_database);
            res.status(200).json({
                msg : "Product Added Successfull"
            });
        }
    }
}

const UpdateProduct = function(req,res){
    const product_database = readDatabase(ProductFile);
    for(let i = 0 ; i < product_database.length ; i++ ){
        if(req.user.UserId==product_database[i].UserId){
            for(let j = 0 ; j < product_database[i].Products.length;j++){
                if(req.body.ProductName == product_database[i].Products[j].ProductName){
                    product_database[i].Products[j].Quantity = req.body.Quantity
                    product_database[i].Products[j].Price = req.body.Price
                    product_database[i].Products[j].NightCharge = req.body.NightCharge
                    product_database[i].Products[j].Extra = req.body.Extra
                    writeDatabase(ProductFile,product_database);
                    res.status(200).json({
                        msg : "Prodct Update SuccessFull"
                    })
                }
            }
        }
    }
    res.status(400).json({
        msg : "Some Error Try to Input valid values" 
    })
}

const DeleteProduct = function(req,res){
    const product_database = readDatabase(ProductFile);
    for(let i = 0 ; i < product_database.length ; i++ ){
        if(req.user.UserId==product_database[i].UserId){
            for(let j = 0 ; j < product_database[i].Products.length;j++){
                if(req.body.ProductName == product_database[i].Products[j].ProductName){
                    product_database[i].Products.splice(j,1);
                    writeDatabase(ProductFile,product_database);
                    res.status(201).json({
                        msg : "Deletion of Product Successful"
                    })
                }
            }
        }
    }
    res.status(400).json({
        msg : "Some Error Try to Input valid values" 
    })
}

const AllProducts = function(req,res){
    const product_database = readDatabase(ProductFile);
    let arr = []
    for(let i = 0 ; i < product_database.length;i++){
        for(let j = 0 ; j < product_database[i].Products.length;j++){
            if(product_database[i].Products[j].Quantity>0 && (product_database[i].UserId !=req.user.UserId)){
                arr.push(product_database[i].Products[j]);
            }
        }
    }
    return res.status(200).json(arr);
}

const YourProducts = function(req,res){
    const product_database = readDatabase(ProductFile);
    for(let i = 0 ; i < product_database.length;i++){
        if((product_database[i].UserId == req.user.UserId)){
            return res.status(200).json(product_database[i].Products); 
        }
    }
}

const ProductBuying = function(req,res){
    const login_database = readDatabase(LoginFile);
    const product_database = readDatabase(ProductFile);
    for(let i = 0 ; i < product_database.length;i++){
        for(let j = 0 ; j < product_database[i].Products.length;j++){
            if(product_database[i].Products[j].uniqueId===req.body.uniqueId){

                product_database[i].Products[j].Quantity -= 1;
                writeDatabase(ProductFile,product_database);
                const contact = login_database[i].Email;
                res.status(200).json({
                    msg : "Contact : "+contact+" For futher query."
                })
            }
        }
    }
    res.status(400).json({
        msg : "Error in back "
    }) 
}






module.exports = {Login,SignUp,UpdateProfile,ChangePassword,AccountDelete,AddProduct,UpdateProduct,DeleteProduct,AllProducts,YourProducts,ProductBuying};
