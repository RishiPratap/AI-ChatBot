import { auth } from "./firebase";
import { GrSend, GrAttachment } from 'react-icons/gr';
import { useState } from 'react';
import axios from "axios";

import './App.css'

function Profile() {
    // Signout function
    const logout = () => {
        auth.signOut();
    }

    const [message, setMessage] = useState("");

    const sendApiRequest = async (message) => {
        const msgObj = {
            "prompt": message,
        }
        await axios.post("http://localhost:3000/application/ask", msgObj).then((res) => {
            console.log(res.data);
            document.getElementById("Message-Container").innerHTML += `
        <div class="bot-msg">
        <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
        <p>${res.data}</p></div>`;

        })
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        setMessage("");
        document.getElementById("chatbot-input").value = "";
        document.getElementById("Message-Container").innerHTML += `
        <div class="user-msg">
        <p>${message}</p><img src=${auth.currentUser.photoURL} alt="profile" class="userimg"/></div>`;
        await sendApiRequest(message);
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
                    <div className="Message-Container" id="Message-Container">
                        <div className="user-msg">
                            <p>Hii</p>
                            <img src={auth.currentUser.photoURL} alt="profile" className="userimg" />
                        </div>
                        <div className="bot-msg">
                            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" className="userimg" />
                            <p>Heyy</p>
                        </div>
                        <div className="user-msg">
                            <p>Tell me a joke</p>
                            <img src={auth.currentUser.photoURL} alt="profile" className="userimg" />
                        </div>
                        <div className="bot-msg">
                            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" className="userimg" />
                            <p>How many seconds are in a year?<br />12. January 2nd, February 2nd, March 2nd, April 2nd.... etc</p>
                        </div>
                    </div>
                    <div className="chatbot-body-bottom">
                        <input type="text" placeholder="Type a message" className="chatbot-input" id="chatbot-input" onChange={
                            (e) => {
                                if (e.keyCode === 13) {
                                    sendMessage(e);
                                }
                                setMessage(e.target.value);
                                console.log(message);
                            }
                        } />
                        <div className="Button-Container">
                            <GrAttachment className="chatbot-attach-btn" onClick={() => { alert("Attach") }} />
                            <GrSend className="chatbot-send-btn" onClick={
                                (e) => {
                                    sendMessage(e);
                                }
                            } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;