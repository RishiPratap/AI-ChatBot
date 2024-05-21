import React from 'react';
import {auth, provider,signInWithPopup} from './firebase';
import { db } from './firebase';
import { doc, getDoc,setDoc} from 'firebase/firestore';
import './App.css'
  
const Login = () => {
    // Sign in with google
    const signin = async() => {        
        signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result);
            try {
                if (!auth.currentUser) {
                    console.error("User is not authenticated.");
                    return;
                }

                if (!db) {
                    console.error("Firestore is not initialized.");
                    return;
                }

                const user = auth.currentUser;
                const userRef = doc(db, 'users', user.uid);

                const createUserInfo = async () => {
                    const userInfo = (await getDoc(userRef)).data();
                    if (!userInfo) {
                        // User is new, create user info and chat history collection
                        await setDoc(userRef, {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            image_url: user.photoURL,
                            credits: 0,
                            upgaded: false,
                            payment_status: false,
                            Razorpay_Order_Id: "",
                            Payment_Id: "",
                            createdTimestamp: new Date()
                        });
                    }
                };
                createUserInfo();
            }catch (error) {
                // Handle the error...
                console.log(error.message);
                alert(error.message);
            }
        })
        .catch((error) => {
            console.log(error.message);
            alert(error.message);
        })
    }
      
    return (
        <div className='Login'>
            <h1>Sign In</h1>
            <div>
                <button style={{"marginTop" : "200px"}} className='google-btn'
                onClick={signin}>Sign In with Google</button>
                <div style={{"marginTop" : "20px"}}>
                </div>
            </div>
        </div>
    );
}
  
export default Login;