const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});
  
// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(
    book => book.author === author
  );
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const result = Object.values(books).filter(
    book => book.title === title
  );
  return res.status(200).json(result);
});

//  Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;

const axios = require("axios");
const BASE_URL = "http://localhost:5000";

// Get all books
async function getAllBooksAsync() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

// Get book by ISBN
async function getBookByISBNAsync(isbn) {
  const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
  return response.data;
}

// Get books by author
async function getBooksByAuthorAsync(author) {
  const response = await axios.get(`${BASE_URL}/author/${author}`);
  return response.data;
}

// Get books by title
async function getBooksByTitleAsync(title) {
  const response = await axios.get(`${BASE_URL}/title/${title}`);
  return response.data;
}

module.exports.asyncTasks = {
  getAllBooksAsync,
  getBookByISBNAsync,
  getBooksByAuthorAsync,
  getBooksByTitleAsync,
};