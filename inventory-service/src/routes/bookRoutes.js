// const express = require('express');
// const router = express.Router();
// const bookController = require('../controllers/bookController');

// // Define routes
// router.get('/books', bookController.getAllBooks);
// router.post('/admin/books', bookController.createBook);
// router.delete('/admin/books/:id', bookController.deleteBook);
// router.patch('/books/issue/:id', bookController.issueBook);
// router.patch('/books/return/:id', bookController.returnBook);
// // Export the router
// module.exports = router;


const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getAllBooks);
router.post('/admin/books', bookController.createBook);
router.delete('/admin/books/:id', bookController.deleteBook);
router.patch('/books/issue/:id', bookController.issueBook);
router.patch('/books/return/:id', bookController.returnBook); // This must be here

module.exports = router;