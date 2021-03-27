import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "./firebase.config";

export const initializeLogInFrameWork = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
} 
export const HandleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
        .then(res => {
            const { displayName, email, photoURL } = res.user;
            const signedInUser = {
                isSignedIn: true,
                name: displayName,
                email: email,
                photo: photoURL,
                success: true
            }
            return signedInUser;
        })
        .catch(err => {
            console.log(err);
            console.log(err.message);
        })
}


export const HandleGhSignIn = () => {
    const ghProvider = new firebase.auth.GithubAuthProvider();
    return firebase.auth().signInWithPopup(ghProvider)
        .then((result) => {
            const credential = result.credential;
            const token = credential.accessToken;
            const user = result.user;
            console.log(token, user);
            return user;
        }).catch((error) => {
            const newUser = {}
            newUser.error = error.message;
            newUser.success = false;
        });
}

export const HandleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider)
        .then((result) => {
            const credential = result.credential;
            const user = result.user;
            var accessToken = credential.accessToken;
            console.log(user, accessToken);
            user.isSignedIn= true;
            return user; 
        })
        .catch((error) => {
            const newUser = {}
            newUser.error = error.message;
            newUser.success = false;
        });
}

export const HandleSignOut = () => {
   return firebase.auth().signOut()
        .then(() => {
            const signedOutUser = {
                isSignedIn: false,
                name: '',
                email: '',
                photoURL: '',
                error: '',
                success: false
            }
            return signedOutUser;
        })

        .catch((error) => {
            console.log('err.message')
        });
}

export const CreateUserWithEmailAndPassword = (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
                const newUser = res.user;
                newUser.error = '';
                newUser.success = true;
                return newUser;
            })
            .catch((error) => {
                const newUser = {}
                newUser.error = error.message;
                newUser.success = false;
                return newUser;
            });
}

    export const SignInWithEmailAndPassword = (email, password) => {
        
           return firebase.auth().signInWithEmailAndPassword(email, password)
                .then(res => {
                    const newUser = res.user;
                    newUser.error = '';
                    newUser.success = true;
                    return newUser
                })
                .catch((error) => {
                    const newUser = {}
                    newUser.error = error.message;
                    newUser.success = false;
                    return newUser;
                });
        }
    
