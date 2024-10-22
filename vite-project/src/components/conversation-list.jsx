import React, { useState, useEffect } from "react";
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
  const [participantEmails, setParticipantEmails] = useState({});
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const fetchParticipantEmail = async (participantId) => {
    const userDoc = await getDoc(doc(db, "users", participantId));
    if (userDoc.exists()) {
      return userDoc.data().email;
    } else {
      return "Unknown";
    }
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

        const emails = {};
        for (const conversation of fetchedConversations) {
          const otherParticipantId = conversation.participants.find(
            (id) => id !== currentUser.uid
          );
          if (!emails[otherParticipantId]) {
            const email = await fetchParticipantEmail(otherParticipantId);
            emails[otherParticipantId] = email;
          }
        }
        setParticipantEmails(emails);
      }
    };

    fetchConversations();
  }, [currentUser]);

  const goToConversation = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div>
      <h2>Your Conversations</h2>
      <ul>
        {conversations.map((conversation) => {
          const otherParticipantId = conversation.participants.find(
            (id) => id !== currentUser.uid
          );
          const email = participantEmails[otherParticipantId] || "Loading...";

          return (
            <li key={conversation.id}>
              <button onClick={() => goToConversation(conversation.id)}>
                Go to Conversation with {email}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ConversationList;
