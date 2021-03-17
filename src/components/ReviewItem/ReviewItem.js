import React from 'react';

const ReviewItem = (props) => {
    const {name, quantity, key, price} = props.product;
    return (
        <div style = {{borderBottom: '1px solid lightGray', margin: '10px', padding: '10px'}} className = "review-item">
            <h1 className = "product-name">{name}</h1>
            <p>Quantity: {quantity} </p>
            <small>Price: $ {price} </small>
            <br/>
            <button 
                className="main-button"
                onClick = { () => props.removeProduct(key)}
            >Remove Item
            </button>
        </div>
    );
};

export default ReviewItem;