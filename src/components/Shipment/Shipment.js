import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import './Shipment.css'

const Shipment = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => {
        const savedCart = getDatabaseCart();
        const orderDetails = {...loggedInUser, products: savedCart, shipment: data, oderTime: new Date()}

        fetch('https://radiant-depths-78349.herokuapp.com/addOrder', {
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                processOrder();
                alert('Order placed successfully')
            }
        })
    }

    const [loggedInUser, setLogedInUser] = useContext(UserContext);

    console.log(watch("example"));

    return (

        < form className= "ship-form" onSubmit={handleSubmit(onSubmit)} >
            < input name="name" defaultValue = {loggedInUser.name} ref={register({ required: true })} placeholder = "Your Name" />
            { errors.name && <span className= "error">Name is required</span>}

            < input email="email" defaultValue = {loggedInUser.email} ref={register({ required: true })} placeholder = "Your email"/>
            { errors.email && <span className= "error">email is required</span>}

            < input Address="Address" ref={register({ required: true })} placeholder = "Your address"/>
            { errors.Address && <span className= "error">Address is required</span>}

            < input Phone="phone" ref={register({ required: true })} placeholder = "Your phone Number"/>
            { errors.phone && <span className= "error">Phone Number is required</span>}

            <input type="submit" />
        </form >
    );
};

export default Shipment;