import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import { collection, getDocs, doc, getDoc, onSnapshot,deleteDoc,setDoc } from 'firebase/firestore';
import { MdDoubleArrow } from 'react-icons/md';
import { MdChat } from "react-icons/md";
import './menu.css'; // Importing CSS file for styling
import { MdContentCopy } from "react-icons/md";
import { MdDoneAll } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { BsCashCoin } from "react-icons/bs";
import { SlBadge } from "react-icons/sl";
import { MdLogout } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { MdSunny } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { FaLanguage } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';

const Sidebar = ({ closeSidebar, openChat, ClearHistory, checkCredits, handlePayment }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState('');
  const [clickedStates, setClickedStates] = useState([]);
  const [credits, setCredits] = useState(0); // State to store user credits
  const [userUpgraded, setUserUpgraded] = useState(false); // State to store user upgrade status
  const [isDarkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Extracting the current URL from location object
  const currentURL = location.pathname;

  useEffect(() => {
    onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      const userInfo = doc.data();
      setUserUpgraded(userInfo.upgaded);
    });
    const fetchChatHistory = async () => {
      try {
        const userId = auth.currentUser.uid;
        setUserId(userId);
        const userDocRef = doc(db, 'users', userId);
        const userInfo = (await getDoc(userDocRef)).data();
        console.log('User Info:', userInfo);
        setCredits(userInfo.credits); // Set user credits in state
        console.log('User credits left:', credits);
        const chatHistoryCollectionRef = collection(userDocRef, 'chatHistory');
        const querySnapshot = await getDocs(chatHistoryCollectionRef);
        const mergedHistory = []; // Array to store merged date and chat data

        if(querySnapshot.empty) {
          console.log('No chat history found!');
          // Backup Chat History
          const backupChatHistoryRef = doc(db,'sampleChat', 'w53HqOYmGW77bTs8hztI');
          const backChatAccess = collection(backupChatHistoryRef, 'chatHistory');
          const backChatSnapshot = await getDocs(backChatAccess);
          backChatSnapshot.forEach((doc) => {
            const data = doc.data();
            const date = doc.id;
            mergedHistory.push({ date, data });
          });
          console.log('Backup chat history:', mergedHistory);
          mergedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
          const sortedHistory = []; // Array to store sorted chat history
          mergedHistory.forEach(item => {
            const date = item.date;
            const data = item.data;
            Object.entries(data).forEach(([msg_id, msgData]) => {
              msgData.messages.forEach(message => {
                sortedHistory.push({ date, id: msg_id, ...message });
              });
            });
          });
          sortedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
          console.log('Sorted chat history:', sortedHistory);
          setChatHistory(sortedHistory);
        }
        else {
        querySnapshot.forEach(doc => {
          const dateAtwhichChatWasCreated = doc.id;
          const chatData = doc.data();

          // Push merged date and chat data to mergedHistory array
          mergedHistory.push({ date: dateAtwhichChatWasCreated, data: chatData });
        });

        // Sort merged history based on chat dates in reverse order (latest first)
        mergedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        const sortedHistory = []; // Array to store sorted chat history

        // Extract chat data from merged history and store it in sortedHistory
        mergedHistory.forEach(item => {
          const date = item.date;
          const data = item.data;

          // Iterate over chat data and push it to sortedHistory
          Object.entries(data).forEach(([msg_id, msgData]) => {
            msgData.messages.forEach(message => {
              sortedHistory.push({ date, id: msg_id, ...message });
            });
          });
        });

        // Sort sorted history based on chat dates in reverse order (latest first)
        sortedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log('Sorted chat history:', sortedHistory);
        setChatHistory(sortedHistory);
      }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory(); // Fetch chat history when the sidebar mounts
  }, [credits]);

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

  const logout = () => {
    auth.signOut();
  };

  const contextMenu = () => {
    const contextMenu = document.querySelector('.context-menu');
    if (contextMenu.style.display === 'flex') {
      contextMenu.style.display = 'none';
    } else {
      contextMenu.style.display = 'flex';
    }
  };

// Function to backup user data before deleting the account
async function backupUserData() {
  const user = auth.currentUser;
  const userRef = doc(db, 'users', user.uid);
  const bacupRef = doc(db, 'backupData', user.uid);
  const userInfo = (await getDoc(userRef)).data();
  console.log('User Info:', userInfo);
  await setDoc(bacupRef, userInfo);
}

  // Function to delete a collection and all its documents
async function deleteCollection(collectionPath) {
  const query = collection(db, collectionPath);
  const querySnapshot = await getDocs(query);

  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
}
    const closeMenu = () => {
      const contextMenu = document.querySelector('.context-menuitems');
      const settingMenu = document.querySelector('.setting-menu');
      settingMenu.style.display = 'none';
      contextMenu.style.display = 'flex';
    };

    const deleteAccount = async () => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: true
      });
      swalWithBootstrapButtons.fire({
        title: "Delete User Account?",
        text: "You won't be able to revert this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          const deleteAccount = async () => {
            backupUserData();
            await deleteCollection(`users/${auth.currentUser.uid}/chatHistory`);
            await deleteDoc(doc(db, 'users', auth.currentUser.uid));
            Swal.fire({
              title: "Deleted! Your account has been deleted.",
              icon: "success",
              showConfirmButton: false, 
            });
            logout();
            window.location.reload();
          };
          deleteAccount();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your account is safe :)",
            icon: "info"
          });
        }
      });
    }

    const toggleDarkMode = () => {
      if(isDarkMode) {
        document.body.classList.remove('dark-mode');
        setDarkMode(false);
      } else {
        document.body.classList.add('dark-mode');
        setDarkMode(true);
      }
    };

    const openSettings = () => {
    const settingMenu = document.querySelector('.setting-menu');
    const contextMenu = document.querySelector('.context-menuitems');
    settingMenu.style.display = 'flex';
    contextMenu.style.display = 'none';
    };

  const copyToClipboard = (chat, index, userId) => {
    // Create a copy of clickedStates array
    const updatedClickedStates = [...clickedStates];
    updatedClickedStates[index] = true;
    setClickedStates(updatedClickedStates);
  
    const fullURL = `${window.location.origin}${currentURL}chat/${userId}/${chat.id}`;
  
    navigator.clipboard.writeText(fullURL)
      .then(() => {
        console.log('Text copied to clipboard:', fullURL);
        Toast.fire({
          icon: 'success',
          title: 'Link copied to share!'
        });
        setTimeout(() => {
          // Reset clicked state after 2 seconds
          updatedClickedStates[index] = false;
          setClickedStates(updatedClickedStates);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="new-chat">
          <MdChat />
          <p>ChatBot AI</p>
          <MdDoubleArrow
            onClick={closeSidebar}
            style={{
              transform: 'rotate(180deg)',
              color: 'black',
              cursor: 'pointer',
            }}
          />
        </div>
        <div className='chatHistory'>
          {chatHistory.length === 0 ? (
            <p className='loadingCenter'>Loading chat history...</p>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <React.Fragment key={index}>
                  {index === 0 || chat.date !== chatHistory[index - 1].date ? (
                    <div className="date-header">{chat.date}</div>
                  ) : null}
                  <div className="user-prompt"  onClick={() => { openChat(chat, userId) }}>
                    <p className='prompt-title' title={chat.user_prompt}>{chat.user_prompt}</p>
                    <div className='icon-Copy'>
                      {clickedStates[index] ? 
                        <MdDoneAll 
                          title="copied"
                          style={{
                            color: 'black',
                            cursor: 'pointer',
                          }} 
                        /> 
                        : 
                        <MdContentCopy 
                          title="copy"
                          style={{
                            color: 'black',
                            cursor: 'pointer',
                          }} 
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(chat,index,userId); }} 
                        />
                      }
                    </div> 
                  </div>
                </React.Fragment>
              ))}
            </>
          )}
        </div>
        <div className='context-menu'>
        <div className='setting-menu'>
        <div className='menu-item' onClick={() => closeMenu()}> <MdDoubleArrow
            style={{
              transform: 'rotate(180deg)',
              color: 'black',
              cursor: 'pointer',
            }}
          /></div> 
        <div className='menu-item' onClick={() => toggleDarkMode()}>{
          isDarkMode ? <MdSunny style={{
            color: 'black',
            marginRight: '5px'
          }} /> : <MdDarkMode style={{
            color: 'black',
            marginRight: '5px'
          }} />
        }Dark Mode</div>
        <div className='menu-item'><GoBell 
          style={{
            color: 'black',
            marginRight: '5px'
          }}
        /> Alerts</div>
        <div className='menu-item'><FaLanguage 
          style={{
            color: 'black',
            marginRight: '5px'
          }}
        /> Language</div>
        <div className='menu-item' onClick={() => deleteAccount()}><MdDelete 
          style={{
            color: 'black',
            marginRight: '5px'
          }}
        /> Delete Account</div> 
        </div>
        <div className='context-menuitems'>
        <div className='menu-item'><BsCashCoin style={{
          color: 'black',
          marginRight: '5px'
        }} />
        Credits Remaining{"  "}{checkCredits}</div>
        {userUpgraded ?<div className='menu-items'><SlBadge style={{
          color: 'black',
          marginRight: '5px'
        }}/>Upgraded to PRO</div>:<div className='menu-item' onClick={handlePayment}><SlBadge style={{
          color: 'black',
          marginRight: '5px'
        }}/>Upgrade</div>}
        <div className='menu-item' onClick={() => openSettings()}>
        <MdOutlineSettings style={{
          color: 'black',
          marginRight: '5px'
        }}/>
        Settings</div>
        <div className='menu-item' onClick={logout}><MdLogout
          style={{
            color: 'black',
            marginRight: '5px'
          }}
        />Logout</div>
        </div>
        </div>
        <div className="user-info" onClick={contextMenu}>
          {auth.currentUser.photoURL == null ? (
            <img
              src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png"
              alt="logo"
              height="40px"
              width="40px"
              style={{
                borderRadius: "50%",
              }}
            />
          ) : (
            <img
              src={auth.currentUser.photoURL}
              alt="profile"
              height="40px"
              width="40px"
              style={{
                borderRadius: "50%",
              }}
            />
          )}
          <h3 className="userName">{auth.currentUser.displayName}</h3>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
