import firebase from "firebase/app";
import "firebase/auth";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { UserContext } from "../../App";
import { firebaseConfig } from "./firebase.config";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


function LogIn() {
    const [newUser, setNewUser] = useState(false)
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: ''
    });

    const [loggedInUSer, setLoggedInUser] = useContext(UserContext);
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const provider = new firebase.auth.GoogleAuthProvider();
    const ghProvider = new firebase.auth.GithubAuthProvider();
    const fbProvider = new firebase.auth.FacebookAuthProvider();

    const handleSignIn = () => {
        firebase.auth()
            .signInWithPopup(provider)
            .then(res => {
                const { displayName, email, photoURL } = res.user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(signedInUser);
                setLoggedInUser(signedInUser);
                history.replace(from);
            })
            .catch(err => {
                console.log(err);
                console.log(err.message);
            })
    }

    const ghSignIn = () => {
        firebase
            .auth()
            .signInWithPopup(ghProvider)
            .then((result) => {
                const credential = result.credential;
                var token = credential.accessToken;
                var user = result.user;
                console.log(token, user);
                const { displayName, email, photoURL } = result.user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(signedInUser);
                setLoggedInUser(signedInUser);
                history.replace(from);
            }).catch((error) => {
                const newUser = { ...user }
                newUser.error = error.message;
                newUser.success = false;
                
            });
    }

    const fbSignIn = () => {
        firebase.auth().signInWithPopup(fbProvider)
            .then((result) => {
                const credential = result.credential;
                const user = result.user;
                var accessToken = credential.accessToken;
                console.log(user, accessToken)
                const { displayName, email, photoURL } = result.user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(signedInUser);
                setLoggedInUser(signedInUser);
                history.replace(from);
            })
            .catch((error) => {
                const newUser = { ...user }
                newUser.error = error.message;
                newUser.success = false;
                setUser(newUser);
            });
    }
    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(() => {
                const signedOutUser = {
                    isSignedIn: false,
                    name: '',
                    email: '',
                    photoURL: '',
                    error: '',
                    success: true
                }
                setUser(signedOutUser);
            })

            .catch((error) => {
                console.log('err.message')
            });
    }
    const handleSubmit = (e) => {
        console.log(user.email, user.password)
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUser = { ...user }
                    newUser.error = '';
                    newUser.success = true;
                    console.log(res);
                })
                .catch((error) => {
                    const newUser = { ...user }
                    newUser.error = error.message;
                    newUser.success = false;
                    setUser(newUser);
                });


        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUser = { ...user }
                    newUser.error = '';
                    newUser.success = true;
                    setUser(newUser);
                    setLoggedInUser(newUser);
                    history.replace(from);
                })
                .catch((error) => {
                    const newUser = { ...user }
                    newUser.error = error.message;
                    newUser.success = false;
                    setUser(newUser);
                });
        }
        e.preventDefault();
    };
    const handleBlur = (e) => {

        let isFieldValid = true;
        if (e.target.name === "email") {
            isFieldValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value);
        }
        if (e.target.name === "password") {
            isFieldValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(e.target.value);
        }
        if (isFieldValid) {
            const newUser = { ...user };
            newUser[e.target.name] = e.target.value;
            setUser(newUser);
        }
    };
    return (
        <div style={{ textAlign: 'center' }}>

            {
                user.isSignedIn ?
                    <button style={{ border: '5px solid red', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={handleSignOut} > Sign Out</button> :
                    <button style={{ border: '1px solid slateBlue', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={handleSignIn} > Sign In with Google</button>
            }
            <br />
            {
                user.isSignedIn ?
                    <button style={{ border: '1px solid slateBlue', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={handleSignOut} > Sign Out</button> :
                    <button style={{ border: '1px solid slateBlue', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={fbSignIn} > Sign In With Facebook</button>
            }
            <br />
            {
                user.isSignedIn ?
                    <button style={{ border: '1px solid slateBlue', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={handleSignOut} > Sign Out</button> :
                    <button style={{ border: '1px solid slateBlue', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={ghSignIn} > Sign In With GitHub</button>
            }

            {
                user.isSignedIn && <div>
                    <p>Welcome {user.name}</p>
                    <p>Email: {user.email} </p>
                    <img src={user.photo} alt=""></img>
                </div>
            }
            <h1>Log in/Sign Up Here</h1>
            <hr />
            <input type="checkbox" id="" onChange={() => setNewUser(!newUser)} />
            <label htmlFor="newUser">Sign Up</label>
            <form onSubmit={handleSubmit}>
                {newUser && <input type="text" name="name" placeholder="Name" onBlur={handleBlur} required />}<br />
                <input type="text" name="email" placeholder="email" onBlur={handleBlur} required /><br />
                <input type="text" name="password" placeholder="password" onBlur={handleBlur} required /><br />
                <input style={{ border: '1px solid slateBlue', padding: '10px', borderRadius: '5px', marginTop: '10px' }} type="submit" value="Submit" />
            </form>

            <p style={{ color: 'red' }} >{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>
            }
        </div>
    );
}

export default LogIn;
