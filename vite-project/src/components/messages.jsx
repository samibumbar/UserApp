import React, { useState, useEffect, useRef } from "react";
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
import { auth, db, storage } from "./firebase"; // Importă și storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Messages() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendName, setFriendName] = useState("Friend");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchFriendName = async () => {
      const conversationDoc = await getDoc(
        doc(db, "conversations", conversationId)
      );
      if (conversationDoc.exists()) {
        const participants = conversationDoc.data().participants;
        const friendId = participants.find((id) => id !== currentUser.uid);
        const friendDoc = await getDoc(doc(db, "users", friendId));
        if (friendDoc.exists()) {
          setFriendName(friendDoc.data().name);
        }
      }
    };

    fetchFriendName();

    const q = query(
      collection(db, `conversations/${conversationId}/messages`),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
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
        console.error("Error sending message:", error);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      setIsRecording(true);
      const tempAudioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          tempAudioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (tempAudioChunks.length > 0) {
          await saveAudioMessage(tempAudioChunks);
        } else {
          console.error(
            "Audio chunks are empty! Înregistrarea nu a fost capturată corect."
          );
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Eroare la inițializarea înregistrării audio:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      setTimeout(() => {
        mediaRecorder.stop();
      }, 500);
    } else {
      console.error("MediaRecorder nu este inițializat.");
    }
  };

  const saveAudioMessage = async (audioChunks) => {
    if (audioChunks.length === 0) {
      console.error(
        "Audio chunks are empty! Înregistrarea nu a fost capturată corect."
      );
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioRef = ref(
      storage,
      `audioMessages/${conversationId}/${Date.now()}.wav`
    );

    try {
      await uploadBytes(audioRef, audioBlob);
      const audioURL = await getDownloadURL(audioRef);

      const messageData = {
        audioUrl: audioURL,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, `conversations/${conversationId}/messages`),
        messageData
      );
    } catch (error) {
      console.error("Error saving audio message:", error);
    }
  };

  return (
    <div className="messages-container">
      <div className="chating-with">
        <h2>{friendName}</h2>
      </div>

      <ul className="ul">
        {messages.map((message) => {
          const time = message.createdAt
            ? message.createdAt.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Sending...";

          return (
            <li
              key={message.id}
              className={
                message.senderId === currentUser.uid
                  ? "message you"
                  : "message friend"
              }
            >
              <div>
                <strong>
                  {message.senderId === currentUser.uid ? "You" : friendName}
                </strong>{" "}
                {message.text ||
                  (message.audioUrl && (
                    <audio controls>
                      <source src={message.audioUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  ))}
              </div>
              <small className="timestamp">{time}</small>
            </li>
          );
        })}
      </ul>

      <form className="form" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button className="send-message" type="submit">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
        <div className="voice-controls">
          <button
            className="send-message"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <i className="fa-solid fa-microphone-slash"></i>
            ) : (
              <i className="fa-solid fa-microphone"></i>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Messages;
