const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { createProduct, getAllProducts, getProductById, uploadImage, updateProductById, deleteProductById, updateStock, getProductsByCollection, addReview } = require('../controllers/productController');
const upload = require('../config/multer');
const authorizeRole = require('../middlewares/authorizeRole');

router.route('/getall').get(getAllProducts);
router.route('/getsingle/:id').get(getProductById);
router.route('/collection/:collectionname').get(getProductsByCollection);
router.route('/create').post(authenticateToken, authorizeRole('admin'), createProduct);
router.route('/update/:id').put(authenticateToken, authorizeRole('admin'), updateProductById);
router.route('/delete/:id').delete(authenticateToken, authorizeRole('admin'), deleteProductById);
router.route('/updatestock/:id').put(authenticateToken, updateStock);
router.route('/addreview/:id').post(authenticateToken, addReview);

// upload image
router.route('/upload').post(upload.single('image'), uploadImage)
module.exports = router;