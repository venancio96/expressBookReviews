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
    return user.username === username && user.password === password;
});
return validuser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const username = req.body.username;
 const password = req.body.password;
 if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
 }
 if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: '1h' });

    req.session.authorization = {
        accessToken, username
    };
    return res.status(200).send("User successfully logged in" + accessToken);
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.query.username;
  const review = req.query.review;
  const isbn = req.params.isbn;
  let book = books[isbn];
  let reviewer = book.reviews[username];
  let boo = Object.keys(book.reviews).length;

  if(boo === 0 || reviewer != username){
        // Object.assign(book.reviews,{'username':username, 'review':review});
        book.reviews[username]=
        { 
            "review":review
        };
        //books = Object.values(books).filter((book) => book.isbn != book);  
        //let rev = Object.values(book.reviews)[0]; 
        //rev shows all the details of book reviews
        //books.push(book);
          res.send({message:"book review added"});
    }
    else if(reviewer){
        //Object.assign(book.reviews,{'username':username, 'review':review});
       // book.reviews = [username, review];
       if(review){
        reviewer["review"] = review;
       }
       book.reviews[username] = reviewer;
       //let rev = Object.values(book.reviews)[0]; 
        //books = Object.values(books).filter((book) => book.isbn != book);        
        //books.push(book);
        res.send({message:"review has been added"});
      
    }
    else{
        res.send("unable to find book review");
    }
    /*book["reviews"] = username + review;
    books[isbn]=book;
    res.send("updated review");*/
    
/* if(!username || !userreview || !isbn)
  {
    return res.status(400).json({message: "invalid information"});
  }else{
    if (isnbooks.put({
        "reviews": userreview
    })
*/
  
 // return res.status(300).json({message: "Yet to be implemented"});

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
const username = req.query.username;
let book = books[isbn];
if(username){
    delete book.reviews[username];
}
res.send({message:"Review ISBN "+ isbn +" deleted"});
});
//temp user check
regd_users.get('/auth/users',function(req,res){
res.send(JSON.stringify(users));
});

regd_users.get('/token/',function(req,res){
    token = req.header['authorization'];
    res.send(token);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
