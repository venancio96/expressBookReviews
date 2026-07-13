const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

if(username && password){
    if(!isValid(username)){ 

        users.push({
            "username": username,
            "password": password
        });
        res.status(200).json({message: "user succesfully registered"});
    }else{
        return res.status(404).json({ message: "User already exists!" });
    }
    
}
else if(username === "" || password === ""){
    return res.status(406).json({message: "username and/password must be filled"});
}
else{
    return res.status(500).json({message: "unkown error"});
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
/*without callbacks 
    res.send(JSON.stringify(books));
    res.status(300).json{message: "faied request"}
*/
  //with promise callbacks
let mypromise = new Promise((resolve,reject) =>{
    try{
        let sortedbook = JSON.stringify(books);
        resolve(sortedbook);
    }catch(err){
        reject(err);
    }
});
    mypromise.then(
        (sortedbook) => res.send(sortedbook),
        (err) => res.status(300).json({message: "failed reuqest"})
    );
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  /*const isbn = req.params.isbn;
  if(isbn){
  res.send(books[isbn]);
  }else{
  return res.status(300).json({message: "no book found"});
  }
*/
//with async-await
const isbn = req.params.isbn;
async function booknumber(){
    let numbook = books[isbn];
    if(numbook){
        return books[isbn];
    }else if(numbook != isbn){
        res.send("no book found");
    }
}
async function bookwaiter(){
    try{
        const result = await booknumber();
        res.send(result);
    }catch(error){
        res.send("no books found1");
    }
}

bookwaiter();

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
/*  const author = req.params.author;

  if(author)
  {
    let booksByAuthor = Object.values(books).filter((book) => book.author === author);
    res.send(booksByAuthor);
  }else{
  return res.status(300).json({message: "FAILED"});
  }*/
  //

const author = req.params.author;
if(author){
async function authorbook(){
    let booksByAuthor = Object.values(books).filter((book) => book.author === author);
        if(Object.keys(booksByAuthor).length === 0){
            res.send("no author found");
        }else{
        return booksByAuthor;
        }
    }

async function AuthorWait(){
    try{
        const result = await authorbook();
        res.send(result);
    }catch(error){
        res.send("no author found")
    }
}
AuthorWait();
}else{
    res.send("author must be included")
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  /*const title = req.params.title;
  if(title){
    let booksByTitle = Object.values(books).filter((book)=> book.title === title);
    res.send(booksByTitle);
  }else{
  return res.status(300).json({message: "failed"});
  }
  */
 //promise
  const title = req.params.title;
  if(title){
  let mypromise = new Promise((resolve,reject) =>{
    try{
        let booksByTitle = Object.values(books).filter((book) => book.title === title);
        if(Object.keys(booksByTitle).length === 0){
            res.send("no titles found");
        }else{
        resolve(booksByTitle);
        }
    }catch(err){
        reject(err);
    }
});
    mypromise.then(
        (booksByTitle) => res.send(booksByTitle),
        (err) => res.status(300).json({message: "failed reuqest"})
    );
  }else{
    res.send("please add the title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;
  if(isbn){
    if(Object.keys(review).length === 0){
        res.send({message:"no book reveiws have been made for this book yet"});
    }
    else{
        res.send(books[isbn].reviews);
    }
}else{
  return res.status(300).json({message: "faield to obtain review"});
}
});

module.exports.general = public_users;
