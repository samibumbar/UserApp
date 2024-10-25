import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";

function FriendsList() {
  const [friends, setFriends] = useState([]);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

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
      // Căutarea conversațiilor existente
      const existingConversationQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", currentUser.uid)
      );

      const existingConversations = await getDocs(existingConversationQuery);
      let conversationId;

      // Verificăm dacă există o conversație deja cu prietenul
      const existingConversation = existingConversations.docs.find((doc) =>
        doc.data().participants.includes(friendId)
      );

      if (existingConversation) {
        // Conversația deja există, navigăm la ea
        conversationId = existingConversation.id;
      } else {
        // Nu există conversație, o creăm
        const docRef = await addDoc(collection(db, "conversations"), {
          participants: [currentUser.uid, friendId], // Asigură-te că ambii participanți sunt incluși
          createdAt: new Date(),
        });
        conversationId = docRef.id;
      }

      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error("Error starting conversation: ", error.message);
    }
  };

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.name} - {friend.email}
            {friend.id !== currentUser.uid && (
              <button onClick={() => startConversation(friend.id)}>
                Message
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
