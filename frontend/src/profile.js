import { auth } from "./firebase";
import {GrSend,GrAttachment} from 'react-icons/gr';

import './App.css'

function Profile(){
    // Signout function
    const logout = () => {
        auth.signOut();
    }

   const userMsg = [
         {
                id:1,
                msg:"Hello",
                time:"12:00",
                sender:"user"
            },
            {
                id:2,
                msg:"How are you?",
                time:"12:00",
                sender:"user"
            },
            {
                id:3,
                msg:"I am fine, How are you?",
                time:"12:00",
                sender:"user"
            },
            {
                id:4,
                msg:"I am fine, How are you?",
                time:"12:00",
                sender:"user"
            },
            {
                id:5,
                msg:"I am fine, How are you?",
                time:"12:00",
                sender:"user"
            },
   ]

    const botMsg = [
        {
            id:1,
            msg:"Hello",
            time:"12:00",
            sender:"bot"
        },
        {
            id:2,
            msg:"I am fine, How are you?",
            time:"12:00",
            sender:"bot"
        },
        {
            id:3,
            msg:"I am fine, How are you?",
            time:"12:00",
            sender:"bot"
        },
        {
            id:4,
            msg:"I am fine, How are you?",
            time:"12:00",
            sender:"bot"
        },
        {
            id:5,
            msg:"I am fine, How are you?",
            time:"12:00",
            sender:"bot"
        },
    ]

    return(
        <div className="Profile">
        <div className="Navbar">
            <div className="NavLeft">
            {auth.currentUser.photoURL == null ? (<img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="logo" style={{padding:"5px", borderRadius:"50%",outline:"solid black"}} height="40px" width="40px"/>):(<img src={auth.currentUser.photoURL} alt="profile" height="50px" width="50px" style={{marginRight:"5px",marginBottom:"10px",borderRadius:"50%",outline:"solid black"}}/>)}
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
                <div className="Mesaage-Container">
                <div className="chatbot-body-left">
                {botMsg.map((msg,index) => (
                    <div className="bot-msg" key={index}>
                    <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="logo" className="botimg"/>
                    <p key={index}>{msg.msg}</p>
                    </div>
                ))}
                </div>
                <div className="chatbot-body-right">
                {userMsg.map((msg,index) => (
                    <div className="user-msg" key={index}>
                    <p key={index}>{msg.msg}</p>
                    <img src={auth.currentUser.photoURL} alt="profile" className="userimg"/>
                    </div>
                ))}
                </div>
                </div>
                <div className="chatbot-body-bottom">
                 <input type="text" placeholder="Type a message" className="chatbot-input"/>
                    <div className="Button-Container">
                    <GrAttachment className="chatbot-attach-btn" onClick={() => {alert("Attach")}}/>
                    <GrSend className="chatbot-send-btn" onClick={() => {alert("Send")}}/> 
                    </div>  
                </div>
                </div>
        </div>
        </div>
    )
}

export default Profile;