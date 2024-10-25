import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

function Messages() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendName, setFriendName] = useState("Friend"); // Inițial "Friend"
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchFriendName = async () => {
      // Obține detaliile conversației pentru a afla cine este prietenul
      const conversationDoc = await getDoc(
        doc(db, "conversations", conversationId)
      );
      if (conversationDoc.exists()) {
        const participants = conversationDoc.data().participants;
        const friendId = participants.find((id) => id !== currentUser.uid); // Identifică prietenul

        // Obține numele prietenului pe baza ID-ului
        const friendDoc = await getDoc(doc(db, "users", friendId));
        if (friendDoc.exists()) {
          setFriendName(friendDoc.data().name); // Setează numele prietenului
        }
      }
    };

    fetchFriendName();

    if (conversationId) {
      const q = query(
        collection(db, `conversations/${conversationId}/messages`),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [conversationId, currentUser.uid]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      try {
        await addDoc(
          collection(db, `conversations/${conversationId}/messages`),
          messageData
        );
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div className="messages-container">
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>
              {message.senderId === currentUser.uid ? "You" : friendName}:
            </strong>{" "}
            {message.text}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Messages;
