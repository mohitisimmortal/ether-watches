import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios'; // Import Axios
import baseUrl from '../../../baseUrl';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    function formatTimestamp(timestamp) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(timestamp).toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        axios.get(`${baseUrl}/order/getorders`, {
            headers: {
                Authorization: localStorage.getItem('userToken'),
            },
        })
            .then((response) => {
                // Calculate the total amount for each order and update the orders array
                const updatedOrders = response.data.map((order) => ({
                    ...order,
                    totalAmount: order.items.reduce((total, item) => {
                        if (item.product) {
                            return total + (item.price * item.quantity);
                        } else {
                            return total;
                        }
                    }, 0),
                }));
                setOrders(updatedOrders);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    return (
        <section style={{ paddingTop: '1rem', minHeight: '100vh' }}>
            <Typography variant="h4" align="center" gutterBottom color="white">
                All Orders
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>
                                    <ul>
                                        {order.items.map((item) => (
                                            <li key={item._id}>
                                                {item.name} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>{formatTimestamp(order.orderDate)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <p style={{ color: 'white', marginTop: '10px' }}>Note: Please monitor orders regularly.</p>
        </section>
    );
};

export default AllOrders;