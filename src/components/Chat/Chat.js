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
import './Chat.css';

var stompClient = null;
function Chat(props) {
    const currentUser = AuthService.getCurrentUser();
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
    const [messages, setMessages] = useRecoilState(chatMessages);

    useEffect(() => {
        // if (localStorage.getItem("accessToken") === null) {
        //   props.history.push("/login");
        // }
        connect();
        loadContacts();
    }, []);

    useEffect(() => {
        if (activeContact === undefined) return;
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
            senderName: currentUser.name,
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

    return (
        <div className="chat-container">
            <ScrollToBottom className="messages">
                <ul>
                    {messages.map((msg) => (
                        <li class={msg.senderId === currentUser.id ? "sent" : "replies"}>
                            <p>{msg.content}</p>
                        </li>
                    ))}
                </ul>
            </ScrollToBottom>
            <div className="message-panel">
                <input
                    name="user_input"
                    className="message" 
                    placeholder="Type a message..." 
                    onChange={(event) => setText(event.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        sendMessage(text);
                        setText("");
                      }
                    }}
                />
                <button className="bSend" 
                    onClick={() => {
                    sendMessage(text);
                    setText("") 
                    }}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;