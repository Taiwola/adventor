require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const mime = require('mime');
const path = require('path');



// import utils
const connectDB = require('./utils/dbconnect')

// define middlewares
const PORT = process.env.PORT || 4000;
const app = express();
connectDB();

// use middleware
app.use(cors({
    origin: '*'
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(expressLayout);


app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// acess static files
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public', {
  setHeaders: (res, path) => {
    const mimeType = mime.getType(path);
    if (mimeType === 'text/css') {
      res.set('Content-Type', 'text/css');
    } else if (mimeType === 'application/javascript') {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));


// import routes
const user = require('./routes/user.routes');
const auth = require('./routes/auth.routes');
const post = require('./routes/adventure.routes');
const page = require('./routes/page.routes')



// use routes

app.use('/', page);
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/post', post);









//invalid routes
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "public", "404.html"));
    } else if (req.accepts("json")) {
      console.log("json");
      res.json({ error: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });




// connect to DB
mongoose.connection.once('open', ()=> {
    console.log('DB Connected');
    app.listen(PORT, ()=>{
        console.log(`Server Running on Port ${PORT}`);
    })
})

