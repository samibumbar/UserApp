import React, { useState, useEffect } from "react";
import "./messages.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";

function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [participantNames, setParticipantNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const fetchParticipantName = async (participantId) => {
    const userDoc = await getDoc(doc(db, "users", participantId));
    return userDoc.exists() ? userDoc.data().name : "Unknown";
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "conversations"),
          where("participants", "array-contains", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const fetchedConversations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConversations(fetchedConversations);
        setFilteredConversations(fetchedConversations);

        const names = {};
        for (const conversation of fetchedConversations) {
          const otherParticipantId = conversation.participants.find(
            (id) => id !== currentUser.uid
          );
          if (!names[otherParticipantId]) {
            const name = await fetchParticipantName(otherParticipantId);
            names[otherParticipantId] = name;
          }
        }
        setParticipantNames(names);
      }
    };

    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    const filtered = conversations.filter((conversation) => {
      const otherParticipantId = conversation.participants.find(
        (id) => id !== currentUser.uid
      );
      const name = participantNames[otherParticipantId] || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredConversations(filtered);
  }, [searchTerm, conversations, participantNames, currentUser]);

  const goToConversation = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="conv-container">
      <h2>Chats</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
        />
      </div>
      <ul>
        {filteredConversations.map((conversation) => {
          const otherParticipantId = conversation.participants.find(
            (id) => id !== currentUser.uid
          );
          const name = participantNames[otherParticipantId] || "Loading...";

          return (
            <li key={conversation.id}>
              <button onClick={() => goToConversation(conversation.id)}>
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ConversationList;
