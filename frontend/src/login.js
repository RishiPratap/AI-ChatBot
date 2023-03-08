import React from 'react';
import {auth, provider,signInWithPopup} from './firebase';
import ReCaptcha from 'react-google-recaptcha';
import { useRef } from 'react';
import axios from 'axios';
import './App.css'
  
const Login = () => {

    const captchaRef = useRef(null)
  
    // Sign in with google
    const signin = async() => {
        const token = captchaRef.current.getValue();
        console.log(token);
        captchaRef.current.reset();
        if(token === null || token === "" || token === undefined){
            alert("Please verify that you are not a robot");
            return;
        }
        await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=6LdaPeUkAAAAAOhwINmyahYEm-8TEoxrmhS9q0Qq&response=${token}`).then((res) => {
            console.log(res);
            if(res.data.success === false || res.data.score < 0.5){
                alert("Please verify that you are not a robot");
                return;
            }
        }).catch((err) => {
            console.log(err);
        })
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
                <ReCaptcha sitekey='6LdaPeUkAAAAANMeYfCSFQaTYCOa6z38gVAGAUe-' ref={captchaRef}/>
                </div>
            </div>
        </div>
    );
}
  
export default Login;