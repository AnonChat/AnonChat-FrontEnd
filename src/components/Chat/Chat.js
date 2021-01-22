import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { Button, message } from "antd";
import {
    loggedInUser,
    chatActiveContact,
    chatMessages,
} from "./globalState";
import {
    getUsers,
    countNewMessages,
    findChatMessages,
    findChatMessage,
} from "./util";
import AuthService from "../../Authentication/services/auth.service";
import ScrollToBottom from "react-scroll-to-bottom";
import { useHistory } from "react-router-dom";
import './Chat.css';

var stompClient = null;
function Chat(props) {
    // const current = AuthService.getCurrentUser();
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
    const [messages, setMessages] = useRecoilState(chatMessages)
    let history = useHistory();
    
    useEffect(() => {
        connect();
        loadContacts();
    }, []);

    useEffect(() => {
        if (activeContact === undefined) return;
        setText("");
        findChatMessages(activeContact.id, currentUser.id).then((msgs) =>
          setMessages(msgs)
        );
        loadContacts();
      }, [activeContact]);

    const onConnected = () => {
        console.log("connected");
        console.log(currentUser);
        stompClient.subscribe(
            "/user/" + currentUser.id + "/queue/messages",
            onMessageReceived
        );
    };
    
    const onError = (err) => {
        console.log(err);
    };

    const connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS("http://localhost:8080/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        const active = JSON.parse(sessionStorage.getItem("recoil-persist"))
          .chatActiveContact;
    
        if (active.id === notification.senderId) {
          findChatMessage(notification.id).then((message) => {
            const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist"))
              .chatMessages;
            newMessages.push(message);
            setMessages(newMessages);
          });
        } else {
          message.info("Received a new message from " + notification.senderName);
        }
        loadContacts();
    };

    const sendMessage = (msg) => {
        if (msg.trim() !== "") {
          const message = {
            senderId: currentUser.id,
            recipientId: activeContact.id,
            senderName: currentUser.username,
            recipientName: activeContact.name,
            content: msg,
            timestamp: new Date(),
          };
          stompClient.send("/app/chat", {}, JSON.stringify(message));
    
          const newMessages = [...messages];
          newMessages.push(message);
          setMessages(newMessages);
        }
    };
    const loadContacts = () => {
        const promise = getUsers().then((users) =>
          users.map((contact) =>
            countNewMessages(contact.id, currentUser.id).then((count) => {
              contact.newMessages = count;
              return contact;
            })
          )
        );
    
        promise.then((promises) =>
          Promise.all(promises).then((users) => {
            setContacts(users);
            if (activeContact === undefined && users.length > 0) {
              setActiveContact(users[0]);
            }
          })
        );
    };
    const logout=()=>{
      AuthService.logout();
      history.push("/login");
    }
    const profile=()=>{
      history.push("/profile");
    }
    
    return (
      <div className="ChatWindow">
        <div className="Chat">
          <div className="LeftSide">
            <div className="User">
              <div className="image-cropper">
                <img className="image-to-cropp" src={currentUser && currentUser.profilePicture && currentUser.profilePicture !== "" && currentUser.profilePicture !== undefined ? currentUser.profilePicture : 'https://www.ctcmath.com/assets/images/placeholder-user.jpg'}></img>
              </div>
              <p className="Username">{currentUser.username}</p>
            </div>
            <div className="Line"></div>
            <ScrollToBottom className="Friends">
              <ul>
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    onClick={() => setActiveContact(contact)}
                    className={
                      (activeContact && (contact.id === activeContact.id))
                        ? "active"
                        : "contact"
                    }
                  >
                    <div className="wrap">
                      <div className="image-cropper">
                        <img className="image-to-cropp" src={contact.profilePicture && contact.profilePicture !== undefined && contact.profilePicture !== "" ? contact.profilePicture : 'https://www.ctcmath.com/assets/images/placeholder-user.jpg'}></img>
                      </div>
                      <p className="Username">{contact.username}</p>
                    </div>
                    <div className="MessegeAlert">
                      {contact.newMessages !== undefined && contact.newMessages > 0 && (
                            <p className="preview">{contact.newMessages} new messages</p>)}
                    </div>    
                  </li>
                ))}
              </ul>
            </ScrollToBottom>
            <div className="Bottom">
              <button className="AddContact" onClick={profile}>
                <span>Profile</span>
              </button>
              <button className="LogOut" onClick={logout}>
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="RightSide">
            <div className="CurrentFriend">
              <div className="image-cropper">
                <img className="image-to-cropp" src={activeContact && activeContact.profilePicture && activeContact.profilePicture !== undefined ? activeContact.profilePicture : 'https://www.ctcmath.com/assets/images/placeholder-user.jpg'}></img>
              </div>
              <p>{activeContact && activeContact.username}</p>
            </div>
            <ScrollToBottom className="MessegesArea">
                <ul>
                    {messages && messages.map((msg) => (
                        <li className={msg.senderId === currentUser.id ? "sent" : "replies"}>
                          <div className="wrap">
                            {msg.senderId === currentUser.id ? "" : (
                              <div className="image-cropper">
                                <img className="image-to-cropp" src={activeContact.profilePicture !== "" && activeContact.profilePicture !== null ? activeContact.profilePicture : 'https://www.ctcmath.com/assets/images/placeholder-user.jpg'}></img>
                            </div>
                            )}
                              <p>{msg.content}</p>
                          </div>
                        </li>
                    ))}
                </ul>
            </ScrollToBottom>
            <div className="WriteMessegePannel">
              <textarea 
                  name="user_input"
                  className="MessegesInput" 
                  placeholder="Type a messege..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      sendMessage(text);
                      setText("");
                    }
                  }}
              />
              <button className="ButtonSend" 
                  onClick={() => {
                    setText(" ");
                    console.log(text);
                    sendMessage(text);
                  }}>
                  Send
              </button>
            </div>
          </div>
        </div>
        <div className="Footer">
              <p>Powered proudly by</p>
              <img src={`${process.env.PUBLIC_URL}/img/fullLogo.png`}/>
          </div>
      </div>
  );
}

export default Chat;