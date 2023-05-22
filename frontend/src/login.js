import React from 'react';
import {auth, provider,signInWithPopup} from './firebase';
import './App.css'
  
const Login = () => {
  
    // Sign in with google
    const signin = async() => {        
        signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result);
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