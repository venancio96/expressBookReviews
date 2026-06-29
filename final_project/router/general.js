const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  let user = users[username];

  if(user){
    res.send("username taken");
}
else if(username == "" || password == ""){

    res.send("username/passowrd must be filled");

}else if(req.body.username && req.body.password){ 

        users.push({
            "username": username,
            "password": password
        })
        res.send(`added user ${username}`);
    }
  else{
  return res.status(300).json({message: "Yet to be implemented"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
  res.send(books[isbn]);
  }else{
  return res.status(300).json({message: "no book found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  if(author)
  {
    let booksByAuthor = Object.values(books).filter((book) => book.author === author);
    res.send(booksByAuthor);
  }else{
  return res.status(300).json({message: "FAILED"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  if(title){
    let booksByTitle = Object.values(books).filter((book)=> book.title === title);
    res.send(booksByTitle);
  }else{
  return res.status(300).json({message: "failed"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
    res.send(books[isbn].review);
}else{
  return res.status(300).json({message: "Yet to be implemented"});
}
});

module.exports.general = public_users;
