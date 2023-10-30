import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { handleApiError } from '../../../reactToastify';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'
import baseUrl from '../../../baseUrl';

// Define Dashboard component
const Dashboard = () => {
    const userToken = localStorage.getItem('userToken');
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stock: '',
        price: '',
        brand: '',
        imageUrl: '',
        gender: '',
        collectionName: ''
    });

    // Fetch product data from the server
    useEffect(() => {
        axios.get(`${baseUrl}/product/getall?page=${page}`)
            .then((response) => {
                const { products: fetchedProducts, meta: { totalPages: totalPageCount } } = response.data;

                // If this is the first page, set the products directly
                // Else, append the new products to the existing ones
                if (page === 1) {
                    setProducts(fetchedProducts);
                } else {
                    setProducts(prevProducts => [...prevProducts, ...fetchedProducts]);
                }

                setTotalPages(totalPageCount);
            })
            .catch((error) => {
                handleApiError(error);
            });
    }, [page, setProducts]);

    const handleLoadMore = () => {
        // Only increment the page if we haven't reached the total number of pages.
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Function to open the Add Product dialog
    const handleOpenAddProductDialog = () => {
        setOpenAddProductDialog(true);
    };

    // Function to close the Add Product dialog
    const handleCloseAddProductDialog = () => {
        setOpenAddProductDialog(false);
    };

    // Function to handle form input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageUpload = (event) => {
        const imageFile = event.target.files[0];
        const ImageData = new FormData();
        ImageData.append('image', imageFile);

        // Send a POST request to your image upload endpoint
        axios.post(`${baseUrl}/product/upload`, ImageData)
            .then((response) => {
                // Handle the response, which should contain the uploaded image URL
                const imageUrl = response.data.imageUrl;

                // Set the image URL in your component state or form data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    imageUrl: imageUrl,
                }));

            })
            .catch((error) => {
                handleApiError(error)
            });
    };

    // Function to handle form submission for adding a new product
    const handleAddProductSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        // Create a new product object based on the formData
        const newProduct = {
            name: formData.name,
            description: formData.description,
            stock: formData.stock,
            price: formData.price,
            brand: formData.brand,
            imageUrl: formData.imageUrl,
            gender: formData.gender,
            collectionName: formData.collectionName,
        };

        // Perform an axios POST request to add the new product
        axios.post(`${baseUrl}/product/create`, newProduct, {
            headers: {
                Authorization: userToken,
            }
        })
            .then((response) => {
                // Update the Recoil product state with the new product
                setProducts([...products, newProduct]);

                // Close the Add Product dialog
                handleCloseAddProductDialog();

                // Clear the form data
                setFormData({
                    name: '',
                    description: '',
                    stock: '',
                    price: '',
                    brand: '',
                    imageUrl: '',
                    gender: '',
                    collectionName: '',
                });
            })
            .catch((error) => {
                handleApiError(error)
            });
    };

    // Function to open the Edit Product dialog
    const handleOpenEditProductDialog = (product) => {
        setSelectedProduct(product);
        // Populate the form data with the selected product's data
        setFormData({
            name: product.name,
            description: product.description,
            stock: product.stock,
            price: product.price,
            brand: product.brand,
            imageUrl: product.imageUrl,
            gender: product.gender,
            collectionName: product.collectionName,
        });
        setOpenEditProductDialog(true);
    };

    // Function to close the Edit Product dialog
    const handleCloseEditProductDialog = () => {
        setOpenEditProductDialog(false);
        setSelectedProduct({});
    };

    // Function to handle form submission for editing a product
    const handleEditProductSubmit = (e) => {
        e.preventDefault()
        // Create a new product object based on the formData with updated values
        const updatedProduct = {
            name: formData.name,
            description: formData.description,
            stock: formData.stock,
            price: formData.price,
            brand: formData.brand,
            imageUrl: formData.imageUrl,
            gender: formData.gender,
            collectionName: formData.collectionName,
        };

        // Perform an axios PUT request to update the selected product
        axios.put(`${baseUrl}/product/update/${selectedProduct._id}`, updatedProduct, {
            headers: {
                Authorization: userToken, // Include the user token for authentication
            },
        })
            .then((response) => {
                // Update the products state with the updated product
                const updatedProducts = products.map((product) => {
                    if (product._id === selectedProduct._id) {
                        return {
                            ...product,
                            ...updatedProduct,
                        };
                    }
                    return product;
                });

                setProducts(updatedProducts);

                // Close the Edit Product dialog
                handleCloseEditProductDialog();

                // Clear the form data
                setFormData({
                    name: '',
                    description: '',
                    stock: '',
                    price: '',
                    brand: '',
                    imageUrl: '',
                    gender: '',
                    collectionName: '',
                });
            })
            .catch((error) => {
                handleApiError(error);
            });
    };

    // Function to handle deleting a product
    const handleDeleteProduct = (productId) => {
        axios
            .delete(`${baseUrl}/product/delete/${productId}`, {
                headers: {
                    Authorization: userToken,
                },
            })
            .then((response) => {
                // Remove the deleted product from the products state
                const updatedProducts = products.filter((product) => product._id !== productId);
                setProducts(updatedProducts);
            })
            .catch((error) => {
                handleApiError(error);
            });
    };

    return (
        <section style={{ paddingTop: '1rem', minHeight: '85vh', color: 'white' }}>
            <h1 style={{ color: 'white' }}>Dashboard</h1>

            {/* Button to open Add Product dialog */}
            <button onClick={handleOpenAddProductDialog} style={{ marginTop: '1rem', marginBottom: '1rem', marginRight: '10px' }} className='dashboardbtn'>
                Add Product
            </button>
            {/* Button to open Add Product dialog */}
            <button onClick={() => { navigate('/allorders') }} style={{ marginTop: '1rem', marginBottom: '1rem' }} className='dashboardbtn'>
                See Orders
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '.7rem', marginBottom: '1rem' }}>
                        <h5 style={{ textTransform: 'capitalize' }}>{product.name}</h5>
                        <p style={{ textTransform: 'capitalize' }}>{product.description.split(' ').slice(0, 5).join(' ') + '...'}</p>
                        <p>Price: ${product.price}</p>
                        <img src={product.imageUrl} alt="" style={{ height: '100px', width: '100px', marginTop: '.5rem', objectFit: 'cover' }} />
                        <button onClick={() => handleOpenEditProductDialog(product)} className='dashboardbtn' style={{ padding: '5px' }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} style={{ marginLeft: '.7rem', color: 'red', padding: '5px' }} className='dashboardbtn'>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleLoadMore} className='dashboardbtn' disabled={page >= totalPages}>Load More</button>

            {openAddProductDialog && (
                <div style={{ position: 'fixed', top: '10%', left: '10%', width: '80%', height: '80%', background: 'white', overflowY: 'scroll', padding: '10px' }}>
                    <h2 style={{ color: 'black' }}>Add Product</h2>
                    <button onClick={handleCloseAddProductDialog} className='dashboardbtn closebtn'>Close</button>
                    <form onSubmit={handleAddProductSubmit} className="add-product-form">
                        <h5 style={{ marginBottom: '10px', color: 'black' }}>Upload Image</h5>
                        {/* Image Upload */}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            required
                        />
                        <br />
                        <br />

                        {/* Name */}
                        <input
                            placeholder="Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Description */}
                        <textarea
                            placeholder="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="10"
                            cols="50"
                        ></textarea>

                        <br />
                        <br />

                        {/* Stock */}
                        <input
                            placeholder="Stock"
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Brand */}
                        <input
                            placeholder="Brand"
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Gender */}
                        <input
                            placeholder="Gender"
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Collection Name */}
                        <input
                            placeholder="Collection Name"
                            type="text"
                            name="collectionName"
                            value={formData.collectionName}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Price */}
                        <input
                            placeholder="Price"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        <button type='submit' className='dashboardbtn closebtn'>Add Product</button>
                    </form>

                </div>
            )}

            {openEditProductDialog && (
                <div style={{ position: 'fixed', top: '10%', left: '10%', width: '80%', height: '80%', background: 'white', overflowY: 'scroll', padding: '10px' }}>
                    <h2 style={{ color: 'black' }}>Edit Product</h2>
                    <button onClick={handleCloseEditProductDialog} className='dashboardbtn closebtn'>Close</button>
                    {/* Your Edit Product Form here */}
                    <form onSubmit={handleEditProductSubmit} className='add-product-form'>
                        <h5 style={{ color: 'black' }}>Upload Image</h5>
                        {/* Image Upload */}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                        // required
                        />
                        <br />
                        <br />

                        {/* Name */}
                        <input
                            placeholder="Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Description */}
                        <textarea
                            placeholder="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="10"
                            cols="50"
                        ></textarea>
                        <br />
                        <br />

                        {/* Stock */}
                        <input
                            placeholder="Stock"
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Brand */}
                        <input
                            placeholder="Brand"
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Gender */}
                        <input
                            placeholder="Gender"
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Collection Name */}
                        <input
                            placeholder="Collection Name"
                            type="text"
                            name="collectionName"
                            value={formData.collectionName}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <br />

                        {/* Price */}
                        <input
                            placeholder="Price"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        {/* Add other form fields as needed */}
                        <button type='submit' className='dashboardbtn closebtn'>Edit Product</button>
                    </form>
                </div>
            )}
        </section>
    );
};

export default Dashboard;