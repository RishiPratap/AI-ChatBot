import { auth,db } from "./firebase";
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { GrSend } from 'react-icons/gr';
import { ImBin } from 'react-icons/im';
import { useState } from 'react';
import { useEffect } from "react";
import axios from "axios";
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import Swal from 'sweetalert2';
import Sidebar from './components/sidebar/menu';
import { MdDoubleArrow } from "react-icons/md";
import Typewriter from 'typewriter-effect';
import './App.css';

const md = markdownit({
    html: true,
    linkify: true,
    breaks: true,
    langPrefix: 'language-',
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });  

function Profile() {
    const [message, setMessage] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [sample, setSample] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => {
        setIsOpen(!isOpen);
      };

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });

    const RemovePlaceholder = () => {
        document.getElementById("animeplaceholder").style.display = "none";
        document.getElementById("input-chat").focus();
    }

    useEffect(() => {
        hljs.highlightAll();
        const placeholdertext = document.getElementById("animeplaceholder") && document.getElementById("input-chat") && document.getElementById("chating");
        placeholdertext.addEventListener("click", RemovePlaceholder);

        return () => {
            // clean up function to remove the event listener
            placeholdertext.removeEventListener("click", RemovePlaceholder);
        };
    }, []);

    const sendApiRequest = async (message, count) => {
        const msgObj = {
            "prompt": message+" result in markdown format",
        }
        await axios.post("http://localhost:3001/application/ask", msgObj).then(async (res) => {
            setSpinner(false);
            console.log(res);
            console.log(res.data.content[0].text);
                var msg = res.data.content[0].text;
                var msg_id = res.data.id;
                console.log(msg_id);
                // Render markdown to HTML
                let result = md.render(msg);
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <div id="generatedText_${count}">${result}</div>
                </div>`;    

                try {
                    await writeUserData(message, msg, msg_id);
                } catch (error) {
                    console.error("Error invoking writeUserData: ", error);
                }
                
                const element = document.getElementById("msg-box");
                element.scrollTop = element.scrollHeight;
        }).catch((err) => {
            console.log(err);
            Toast.fire({
                icon: "warning",
                title: "Error in fetching data"
              });
            setSpinner(false);
        })
    }

    const writeUserData = async (message, msg, msg_id) => {
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
            const userInfo = (await getDoc(userRef)).data();
    
            const today = new Date();
            const chatHistoryRef = doc(collection(db, `users/${user.uid}/chatHistory`), today.toDateString());
            const chatHistoryDoc = await getDoc(chatHistoryRef);
    
            let data;
    
            if (!userInfo) {
                // User is new, create user info and chat history collection
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    createdTimestamp: new Date()
                });
    
                data = {
                    [msg_id]: {
                        timestamp: new Date(),
                        messages: [{
                            user_prompt: message,
                            answer: msg
                        }]
                    }
                };
    
                await setDoc(chatHistoryRef, data);
                console.log("New user and chat history created.");
            } else {
                // Chat history exists, update it with new message
                const chatData = chatHistoryDoc.exists() ? chatHistoryDoc.data() : {};
    
                const updatedMessages = [...(chatData[msg_id]?.messages || []), {
                    user_prompt: message,
                    answer: msg
                }];
    
                data = {
                    ...chatData,
                    [msg_id]: {
                        timestamp: new Date(),
                        messages: updatedMessages
                    }
                };
    
                await setDoc(chatHistoryRef, data);
                console.log("Chat history updated.");
            }
        } catch (error) {
            console.error("Error writing user data: ", error);
        }
    };

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
        const element = document.getElementById("msg-box");
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
     
    var prompts = [
        "Explain quantum computing in simple terms",
         "Got any creative ideas for a 10 year old’s birthday?",
         "How do I make an HTTP request in Javascript?", 
         "Explain quantum computing in simple terms",
         "Got any creative ideas for a 10 year old’s birthday?",
         "How do I make an HTTP request in Javascript?"
     ];

    const OnscreenQuestion = (e) => {
        if (e.target.value === "") document.getElementById("btn2").style.opacity = "0.5";
        else document.getElementById("btn2").style.opacity = "1";
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
    const openChat = (chat,userid) => {
        ClearHistory();
        let result = md.render(chat.answer);
        document.getElementById("msg-box").innerHTML += `
        <div class="user-msg">
        <p>${chat.user_prompt}</p>
        <img src=${auth.currentUser.photoURL} alt="profile" class="userimg"/>
        </div>`;
        document.getElementById("msg-box").innerHTML += `
        <div class="bot-msg">
        <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
        <div id="generatedText_${chat.id}">${result}</div>
        </div>`;
    }


    return (
        <div className="Profile">
            <div className="Navbar">
            <div style={{
                cursor: "pointer",
            }} onClick={() => setIsOpen(!isOpen)} ><MdDoubleArrow/></div>
            <h2 >ChatBot</h2>
            </div>
            <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)} ><MdDoubleArrow/></div>
            {isOpen ? <Sidebar className="sidebar" openChat={openChat} ClearHistory={ClearHistory} closeSidebar={closeSidebar}/> : <div></div>}
            <div className="ChatBot">
                <div className="chatbot-body">
                    <div className="Message-Container" id="msg-box">
                        <div className="bot-msg">
                            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" className="userimg" />
                            <p>Hi <strong>{auth.currentUser.displayName}</strong>. Enter prompt to get answers...</p>
                        </div>
                        {sample ? (
                            <div className="grid-container">
                                {prompts.map((item, index) => {
                                    return (
                                        <div className="grid-item" key={index} value={item} onClick={(e) => { OnscreenQuestion(e); }}>{item} →</div>
                                    )
                                })}
                            </div>
                        ) : (<div></div>)}
                    </div>
                    <div className="chatbot-body-bottom" id="chating">
                        <div id="animeplaceholder">
                        <Typewriter
                            options={{
                                strings: ['Enter your prompt here', 'Ask me anything'],
                                autoStart: true,
                                loop: true,
                            }}
                        />
                        </div>
                        <textarea placeholder="" className="chatbot-input" id="input-chat" onChange={
                            (e) => {
                                if (e.target.value === "") setSample(true);
                                else setSample(false);
                                if (e.target.value === "" || e.target.value.length === 0) document.getElementById("btn2").style.opacity = "0.5";
                                else document.getElementById("btn2").style.opacity = "1";
                                setMessage(e.target.value);
                                RemovePlaceholder();
                                console.log(message);
                            }
                        }>
                        </textarea>
                        <div className="Button-Container">
                            <ImBin className="chatbot-attach-btn" onClick={() => { ClearHistory() }} />
                            {spinner === true ? <div className="spinner"></div> : <GrSend id="btn2" style={{opacity:"0.5"}} className="chatbot-send-btn" onClick={
                                async (e) => {
                                    if(message.length === 0){
                                        Toast.fire({
                                            icon: "warning",
                                            title: "Please enter a prompt"
                                          });
                                          return;
                                    }
                                    else{
                                        await sendMessage(e);
                                        setSample(false);
                                        console.log("sample: " + sample);
                                    }
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
