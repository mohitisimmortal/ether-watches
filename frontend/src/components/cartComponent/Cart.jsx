import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { cartState } from "../../recoil/cartAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";

const Cart = () => {
    const cartItems = useRecoilValue(cartState);
    const [cart, setCart] = useRecoilState(cartState);

    // Add functions to handle quantity updates and item removal
    useEffect(() => {
        // Retrieve cart data from local storage and update the cart state
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const handleUpdateQuantity = (itemId, newQuantity) => {
        // Update the cart state
        const updatedCart = cart.map((item) => {
            if (item._id === itemId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCart(updatedCart);

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (itemId) => {
        // Remove the item from the cart state
        const updatedCart = cart.filter((item) => item._id !== itemId);
        setCart(updatedCart);

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };


    return (
        <div className="cart">
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <CartItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            quantity={item.quantity}
                            stock={item.stock}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                        />
                    ))}
                </div>
            )}
            {cartItems.length === 0 ? (
                <Link to='/' className=" globalbtn">Shop Now</Link>
            ) : (
                <Link to='/shippinginfo' className="checkout-button globalbtn">Proceed to buy</Link>
            )}
        </div>
    );
};

export default Cart;