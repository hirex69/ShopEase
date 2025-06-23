import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Admindashboard.css'; // Importing the CSS
import Login from '../pages/customer/Login';
import { useAuth } from '../context/Authcontext';  // Import useAuth


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);  // Store products
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  // Fetch products when component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProducts(response.data.products);  // Update products state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [user]);

  // Handle file selection for product image
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle product upload (admin only)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);

    try {
      await axios.post('http://localhost:5000/api/admin/products/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      alert('Product uploaded successfully!');
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  // Handle product deletion (admin only)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  return (
    <div className="dashboard-container">
      {user?.role === 'admin' ? (
        <>
          <div className="dashboard-header">
            {user ? (
              <>
                <p>Welcome, {user.role}</p>
              </>
            ) : (
              <p>Loading user...</p>
            )}
            <button type="logout" onClick={logout}>Log Out</button>
          </div>
          <h1>Admin Dashboard</h1>
  
          <form onSubmit={handleSubmit} className="form-container">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Upload Product</button>
          </form>
        </>
      ) : (
        <div>
          <Login />
          <h1>Product List</h1>
        </div>
      )}
  
      <h2>Products</h2>
      <div className="products-list">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.title}
            />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <div className="product-price">
              <span>${product.price}</span>
              {user?.role === 'admin' && (
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )};
export default AdminDashboard;  