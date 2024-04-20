import { useEffect, useState } from 'react';
import { db } from './firebase';
import { useParams } from 'react-router-dom';
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
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
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const ChatHistory = () => {
  const { id, msg_id } = useParams();
  console.log('Chat ID:', id);
  console.log('Message ID:', msg_id);

  const msgStyle = {
    border: '2px solid black',
    borderRadius: '10px',
    width: '90%',
    height: '90%',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1rem',
    padding: '5px',
    top: '30px'
};

  const [chatData, setChatData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [userImageUrl, setUserImageUrl] = useState(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const userDocRef = doc(db, 'users', id);
        const userInfo = (await getDoc(userDocRef)).data();
        console.log('User Info:', userInfo);
        setUserImageUrl(userInfo.image_url);
        console.log('User Image URL:', userImageUrl);
        const chatHistoryCollectionRef = collection(userDocRef, 'chatHistory');
        const querySnapshot = await getDocs(chatHistoryCollectionRef);
        querySnapshot.forEach(doc => {
          const chatData = doc.data();
          const messageId = msg_id; // Message ID you want to access
          const messageData = chatData[messageId];
          console.log('Message Data:', messageData);
          if (messageData) {
            setChatData(messageData);
            setLoading(false);
            console.log('Message found with ID:', messageId);
          } else {
            console.log('Message not found with ID:', messageId);
          }
        });

      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };
    fetchChatData();
  }, [id, msg_id,userImageUrl]); // Dependency array with id and msg_id

  return (
    <div className="chat-history">
      <div className="Profile">
        <h1>Chat Viewer</h1>
        <div className="ChatBot">
          <div className="chatbot-body">
            <div style={msgStyle}  id="msg-box">
              {Loading ? <div className='setCenter'><div className="spinner"></div></div> : chatData && (
                <>
                  <div className="user-msg">
                    <p>{chatData.messages[0].user_prompt}</p>
                    {userImageUrl != null ? <img src={userImageUrl} alt="profile" className="userimg" /> :
                    <img src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png" alt="profile" className="userimg" />
                    }
                  </div>
                  <div className="bot-msg">
                    <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" className="userimg" />
                    <div id={`generatedText_${msg_id}`} dangerouslySetInnerHTML={{ __html: md.render(chatData.messages[0].answer) }}></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
