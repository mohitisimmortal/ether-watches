const productSchema = require("../models/productSchema");
const cloudinary = require('../config/cloudinary');
const userSchema = require("../models/userSchema");

// Example route for uploading an image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Get the Cloudinary URL of the uploaded image
        const imageUrl = result.secure_url;

        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, brand, imageUrl, gender, collectionName, stock } = req.body;

        // Check if a product with the same name already exists
        const existingProduct = await productSchema.findOne({ name });

        if (existingProduct) {
            return res.status(409).json({ error: 'Product with the same name already exists' });
        }

        // Extract the username (or another unique identifier) from req.user
        const { username } = req.user;

        // Fetch the user from the database based on the username
        const user = await userSchema.findOne({ username });

        // Create a new product
        const product = new productSchema({ name, description, price, brand, imageUrl, gender, collectionName, stock, user: user._id, });
        await product.save();

        res.status(201).json({ message: 'Product created successfully', product });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a list of all products with pagination
exports.getAllProducts = async (req, res) => {
    const { page, brand, priceRange, ratings, gender, searchTerm } = req.query;
    const cardsPerPage = 5;

    // Convert page from string to number
    const pageNumber = Number(page) || 1;

    // Construct your query based on filters
    let query = {};

    if (brand) {
        query.brand = brand;
    }

    if (gender) {
        query.gender = gender;
    }

    if (searchTerm) {
        query.name = { $regex: searchTerm, $options: 'i' }; // Case insensitive search
    }

    // Handle priceRange filter
    if (priceRange) {
        if (priceRange === 'under400') {
            query.price = { $lte: 400 };
        } else if (priceRange === 'above400') {
            query.price = { $gt: 400 };
        }
    }

    // Handle ratings filter
    if (ratings) {
        if (ratings === 'below4') {
            query.ratings = { $lt: 4 };
        } else if (ratings === 'above4') {
            query.ratings = { $gte: 4 };
        }
    }

    try {
        // Fetch data based on query and pagination
        const products = await productSchema.find(query)
            .skip((pageNumber - 1) * cardsPerPage)
            .limit(cardsPerPage);

        // Fetch total count for pagination meta-data
        const totalCount = await productSchema.countDocuments(query);

        res.json({
            products,
            meta: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / cardsPerPage),
                currentPage: pageNumber
            }
        });
    } catch (error) {
        res.status(500).send('Error fetching products: ' + error);
    }
};


// Get details of a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productSchema.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all products belonging to a specific collection
exports.getProductsByCollection = async (req, res) => {
    try {
        const collectionName = req.params.collectionname;

        // Find all products that match the given collection name
        const products = await productSchema.find({ collectionName: collectionName });

        // If there are no products for the given collection, return an appropriate response
        if (!products.length) {
            return res.status(404).json({ error: `No products found for collection ${collectionName}` });
        }
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateFields = req.body; // Fields to update

        // Check if a product with the given ID exists
        const existingProduct = await productSchema.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the updateFields include the 'name' field
        if (updateFields.name) {
            // Check if the new name already exists for other products
            const productWithSameName = await productSchema.findOne({ name: updateFields.name });

            if (productWithSameName && productWithSameName._id.toString() !== productId) {
                return res.status(409).json({ error: 'Product with the same name already exists' });
            }
        }

        // Update the product fields
        for (const key in updateFields) {
            if (updateFields.hasOwnProperty(key)) {
                existingProduct[key] = updateFields[key];
            }
        }

        // Save the updated product
        await existingProduct.save();

        res.status(200).json({ message: 'Product updated successfully', existingProduct });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Check if a product with the given ID exists
        const existingProduct = await productSchema.findByIdAndDelete(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const productId = req.params.id;
        const newStock = req.body.stock; // Assuming you send the new stock quantity in the request body

        const updatedProduct = await productSchema.findByIdAndUpdate(
            productId,
            { $set: { stock: newStock } },
            { new: true } // To return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        return res.json(updatedProduct);
    } catch (error) {
        console.error('Failed to update stock: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.addReview = async (req, res) => {
    const productId = req.params.id;
    const { rating, comment, user, name } = req.body;

    try {
        // Find the product by its ID
        const product = await productSchema.findById(productId);

        // If the product does not exist, send a 404 response
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user has already reviewed the product
        const existingReviewIndex = product.reviews.findIndex(r => r.user.toString() === user);

        if (existingReviewIndex !== -1) {
            // Update the existing review
            product.reviews[existingReviewIndex].rating = rating;
            product.reviews[existingReviewIndex].comment = comment;
        } else {
            // Add a new review
            product.reviews.push({
                user: user,
                name: name,
                rating: rating,
                comment: comment
            });
        }

        // Save the updated product
        await product.save();

        // Send a success response
        res.status(200).json({ message: 'Review added/updated successfully' });

    } catch (error) {
        console.error("Error adding/updating review:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
