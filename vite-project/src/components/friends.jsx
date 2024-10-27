import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./friends.css";

function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  // Funcția pentru a genera o culoare bazată pe ID-ul prietenului
  const generateColorFromId = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
      (hash >> 16) &
      0xff
    )
      .toString(16)
      .padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;
    return color;
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setFriends(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchFriends();
  }, []);

  const startConversation = async (friendId) => {
    try {
      const existingConversationQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", currentUser.uid)
      );

      const existingConversations = await getDocs(existingConversationQuery);
      let conversationId;

      const existingConversation = existingConversations.docs.find((doc) =>
        doc.data().participants.includes(friendId)
      );

      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        const docRef = await addDoc(collection(db, "conversations"), {
          participants: [currentUser.uid, friendId],
          createdAt: new Date(),
        });
        conversationId = docRef.id;
      }

      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error("Error starting conversation: ", error.message);
    }
  };

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials =
      nameParts[0][0].toUpperCase() +
      (nameParts[1] ? nameParts[1][0].toUpperCase() : "");
    return initials;
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends-container">
      <h2>Contacts</h2>

      {/* Input pentru căutare */}
      <input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <ul>
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            onClick={() =>
              friend.id !== currentUser.uid && startConversation(friend.id)
            }
            className="friend-item"
          >
            <div
              className="friend-avatar"
              style={{ backgroundColor: generateColorFromId(friend.id) }}
            >
              {getInitials(friend.name)}
            </div>
            <span>{friend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
