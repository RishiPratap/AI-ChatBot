import { auth } from "./firebase";
import { GrSend } from 'react-icons/gr';
import { ImBin } from 'react-icons/im';
import { useState } from 'react';
import { useEffect } from "react";
import axios from "axios";
import Typewriter from 'typewriter-effect/dist/core';
import TextAnimation from "react-text-animations";
import './App.css'

var msg;

function Profile() {
    const [message, setMessage] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [sample, setSample] = useState(true);

    const logout = () => {
        auth.signOut();
    }

    const RemovePlaceholder = () => {
        document.getElementById("animeplaceholder").style.display = "none";
        document.getElementById("input-chat").focus();
    }

    useEffect(() => {
        const placeholdertext = document.getElementById("animeplaceholder") && document.getElementById("input-chat") && document.getElementById("chating");
        placeholdertext.addEventListener("click", RemovePlaceholder);

        return () => {
            // clean up function to remove the event listener
            placeholdertext.removeEventListener("click", RemovePlaceholder);
        };
    }, []);

    const sendApiRequest = async (message, count) => {
        const msgObj = {
            "prompt": message,
        }
        await axios.post("http://localhost:3000/application/ask", msgObj).then((res) => {

            setSpinner(false);
            console.log(res);
            console.log(res.data);
            if (res.data.image_requested) {
                document.getElementById("msg-box").innerHTML += `
            <div class="bot-msg">
            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
            <img src=${res.data.image_link} alt="profile" class="resImage"/>
            </div>`;
            }
            else {
                msg = res.data;
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p id="typewriter_${count}"></p>
                </div>`;
                new Typewriter(`#typewriter_${count}`, {
                    strings: msg,
                    autoStart: true,
                    loop: false,
                    delay: 50,
                });
                var element = document.getElementById("msg-box");
                element.scrollTop = element.scrollHeight;
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    function generateRandomString(length, characterSet) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            result += characterSet[randomIndex];
        }
        return result;
    }

    const sendMessage = async (e) => {
        setSpinner(true);
        e.preventDefault();
        console.log(message);
        document.getElementById("input-chat").value = "";
        document.getElementById("msg-box").innerHTML += `
        <div class="user-msg">
        <p>${message}</p>
        <img src=${auth.currentUser.photoURL} alt="profile" class="userimg"/>
        </div>`;
        const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomString = generateRandomString(10, characterSet);
        console.log(randomString);
        var element = document.getElementById("msg-box");
        element.scrollTop = element.scrollHeight;
        await sendApiRequest(message, randomString);
    }

    const ClearHistory = () => {
        console.log("clear");
        const divs = document.getElementById('msg-box');
        const ele = divs.getElementsByTagName('div');
        console.log(ele.length);
        while (divs.firstChild) {
            divs.removeChild(divs.firstChild);
        }
        console.log(ele.length);
        if (ele.length === 0) {
            console.log("empty");
            document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p>Hi <strong>${auth.currentUser.displayName}</strong>. Enter prompt to get answers...</p>
                </div>`;
        }
        setSample(false);
    }

    const OnscreenQuestion = (e) => {
        RemovePlaceholder();
        console.log(e.target.getAttribute("value"));
        var data = e.target.getAttribute("value");
        setMessage(data);
        document.getElementById("input-chat").value = data;
        const divs = document.getElementById('msg-box');
        const ele = divs.getElementsByTagName('div');
        console.log(ele.length);
        setSample(false);
    }


    return (
        <div className="Profile">
            <div className="Navbar">
                <div className="NavLeft">
                    {auth.currentUser.photoURL == null ? (<img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="logo" style={{ padding: "5px", borderRadius: "50%", outline: "solid black" }} height="40px" width="40px" />) : (<img src={auth.currentUser.photoURL} alt="profile" height="50px" width="50px" style={{ marginRight: "5px", marginBottom: "10px", borderRadius: "50%", outline: "solid black" }} />)}
                    <h3 className="username">{auth.currentUser.displayName}</h3>
                </div>
                <div className="NavRight">
                    <button className="logout-btn"
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
            <hr></hr>
            <div className="ChatBot">
                <div className="ChatBot-Header">
                    <h3>ChatBot</h3>
                </div>
                <div className="chatbot-body">
                    <div className="Message-Container" id="msg-box">
                        <div className="bot-msg">
                            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" className="userimg" />
                            <p>Hi <strong>{auth.currentUser.displayName}</strong>. Enter prompt to get answers...</p>
                        </div>
                        {sample ? (
                            <div className="grid-container">
                                <div className="grid-item" value="Explain quantum computing in simple terms" onClick={(e) => { OnscreenQuestion(e); }}>"Explain quantum computing in simple terms" →</div>
                                <div className="grid-item" value="Got any creative ideas for a 10 year old’s birthday?" onClick={(e) => { OnscreenQuestion(e); }}>"Got any creative ideas for a 10 year old’s birthday?" →</div>
                                <div className="grid-item" value="How do I make an HTTP request in Javascript?" onClick={(e) => { OnscreenQuestion(e); }}>"How do I make an HTTP request in Javascript?" →</div>
                                <div className="grid-item" value="Explain quantum computing in simple terms" onClick={(e) => { OnscreenQuestion(e); }}>"Explain quantum computing in simple terms" →</div>
                                <div className="grid-item" value="Got any creative ideas for a 10 year old’s birthday?" onClick={(e) => { OnscreenQuestion(e); }}>"Got any creative ideas for a 10 year old’s birthday?" →</div>
                                <div className="grid-item" value="How do I make an HTTP request in Javascript?" onClick={(e) => { OnscreenQuestion(e); }}>"How do I make an HTTP request in Javascript?" →</div>
                            </div>
                        ) : (<div></div>)}
                    </div>
                    <div className="chatbot-body-bottom" id="chating">
                        <TextAnimation.Slide target="prompt" id="animeplaceholder" text={['Day', 'Questions', 'Answers']}>
                            Search for a prompt
                        </TextAnimation.Slide>
                        <textarea placeholder="" className="chatbot-input" id="input-chat" onChange={
                            (e) => {
                                if (e.keyCode === 13) {
                                    sendMessage(e);
                                }
                                setMessage(e.target.value);
                                RemovePlaceholder();
                                console.log(message);
                            }
                        } >
                        </textarea>
                        <div className="Button-Container">
                            <ImBin className="chatbot-attach-btn" onClick={() => { ClearHistory() }} />
                            {spinner === true ? <div className="spinner"></div> : <GrSend className="chatbot-send-btn" onClick={
                                async (e) => {
                                    await setSample(false);
                                    console.log("sample: " + sample);
                                    sendMessage(e);
                                }
                            } />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;