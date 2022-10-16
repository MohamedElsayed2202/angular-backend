//server packages imports
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');


//defined server consts
const app = express();
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const orderRouter = require('./routes/order');
const {v4: uuidv4} = require('uuid');
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images');
    },
    filename: (req, file, cb) =>{
        cb(null, uuidv4()); 
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }else{
        cb(null, false)
    }
};


//middlewares
//to read json data
app.use(bodyParser.json());
//to save images
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
//cors handler middleware
app.use(cors);
//to serve images folder
app.use('/images', express.static(path.join(__dirname, 'images')));


//routes

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoryRouter); 
app.use('/order', orderRouter);


//error handler middleware
app.use(error)


//connecting to db and starting servet
mongoose.connect(process.env.DB_NAME)
.then(() => {
    console.log('DB-connected');
    app.listen(process.env.PORT)
})
.catch(e => console.log(e.message))


