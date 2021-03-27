import React, { useEffect, useState } from 'react';
import { getDatabaseCart, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
import happyImage from '../../images/giphy.gif';
import { useHistory } from 'react-router';

const Review = () => {
    const [cart, setCart] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const history = useHistory();


    const handleProceedCheckOut = () =>{
        history.push('/shipment');
    }

    const removeProduct = (productKey) =>{
        const newCart = cart.filter(pd => pd.key !== productKey)
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }
    useEffect(() =>{
        //Cart
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);

        fetch('https://radiant-depths-78349.herokuapp.com/productsByKeys',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
    }, []);

    let thankYou;
     if(orderPlaced){
     thankYou = <img src={happyImage}alt=""/>
    }
    return (
        <div className = "twin-container">
            <div className = "product-container">
            {
                cart.map(pd => <ReviewItem 
                    key = {pd.key}
                    removeProduct = {removeProduct}
                    product={pd}></ReviewItem> )
            }
            {thankYou}
            </div>
            
            <div className = "cart-container">
                    <Cart cart = {cart}>
                        <button onClick = {handleProceedCheckOut} className = "main-button"> Proceed to CheckOut </button>
                    </Cart>
            </div>
        </div>

    );
};

export default Review;