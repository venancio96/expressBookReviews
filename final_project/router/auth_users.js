const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');
const app = express();

let users = [];

const isValid = (username)=> { //returns boolean
    let username2 = users.filter((user)=> {
        return user.username === username;
  });
  return username2.length > 0;
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validuser = users.filter((user)=>{
    return user.username === username && user.paswword === password;
})
return validuser.length > 0;
}

app.use(session({ secret: "fingerpint", resave: true, saveUninitialized: true }));

app.use("/user", (req, res, next) => {
    // Check if user is authenticated
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        
        // Verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Set authenticated user data on the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
            }
        });
        
        // Return error if no access token is found in the session
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
//only registered users can login
regd_users.post("customer/login", (req,res) => {
  //Write your code here
 const username = req.body.username;
 const password = req.body.password;
 if(!username || !password)
 {
    return res.status(404).json({ message: "Error logging in" });
 }
 if(authenticatedUser(username,password))
 {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//temp user check
regd_users.get('/users',function(req,res){
res.send(JSON.stringify(users));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
