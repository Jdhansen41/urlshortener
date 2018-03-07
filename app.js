//GET REQUIREMENTS
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var validUrl = require('valid-url');
var cors = require('cors'); //Helps with cross origin requests
var mongoose= require('mongoose');
var path = require("path");
const shorturl = require("./models/shorturl");

//MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname + "/public")));


//Connect to database on heroku or here locally
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shorturls');





app.get("/", function(req,res,next){
    res.render("index");
})

//Create databse entry
app.get('/new/:urlShort(*)', function(req,res,next){
    var test = req.params.urlShort;
    //regex for URL
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = expression;
    
    if(regex.test(test)===true){
        //create a random number to use as the shortened url
        var short = Math.floor(Math.random()*100000).toString();
        //Create object we'll push into database
        var data = new shorturl({
            originalUrl: test,
            shorterUrl: short
        });
        
        //Save object to database
        data.save(err=>{ if(err){ return res.send("err saving to db");}
        });
        
        //display object
        return res.json(data)
    }else{
        //Invalid Url, display failed
        var data = new shorturl({
            originalUrl: test,
            shorterUrl: "Invalid Url"
        });
        return res.json(data);
    }
    
  //  return res.json({url: test});
    
});


//Query databse and foward to original url
app.get('/:urlToForward', function(req,res,next){
    var shorterUrl = req.params.urlToForward;
    //Searching shorturl collection, see if the requested shorterUrl matches any shorterUrl in collection
    shorturl.findOne({'shorterUrl' : shorterUrl}, function(err,data){
        //findOne is a built in mongoose function
        console.log("found it");
        if(err){
            return res.send(err.message);
        }
        var re = new RegExp("^(http|https)://", "i");
        var strToCheck = data.originalUrl;
        //Checking URL
        if(re.test(strToCheck)){
            res.redirect(301, data.originalUrl);
        }
        else{
            res.redirect(301, 'http://'+data.originalUrl);
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function(){ //What actually sets up the server
    console.log("Server is running");
});