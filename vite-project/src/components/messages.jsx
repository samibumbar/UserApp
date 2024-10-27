import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { useParams, useNavigate } from "react-router-dom";
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
import { auth, db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendName, setFriendName] = useState("Friend");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const currentUser = auth.currentUser;
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() || selectedImage || audioFile) {
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      try {
        const docRef = await addDoc(
          collection(db, `conversations/${conversationId}/messages`),
          messageData
        );

        if (selectedImage) await handleImageUpload(docRef.id);
        if (audioFile) await handleAudioUpload(docRef.id);

        setNewMessage("");
        setSelectedImage(null);
        setAudioFile(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleImageUpload = async (docId) => {
    const imageRef = ref(
      storage,
      `images/${conversationId}/${Date.now()}_${selectedImage.name}`
    );

    await uploadBytes(imageRef, selectedImage);
    const imageURL = await getDownloadURL(imageRef);

    const messageRef = doc(
      db,
      `conversations/${conversationId}/messages`,
      docId
    );
    await updateDoc(messageRef, { imageUrl: imageURL });
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setIsRecording(true);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setAudioFile(audioBlob);
        setIsRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Audio recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
  };

  return (
    <div className="messages-container">
      <div className="chating-with">
        <button
          onClick={() => navigate("/messages/conversation-list")}
          className="back-button"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2>{friendName}</h2>
      </div>

      <ul className="ul">
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.senderId === currentUser.uid
                ? "message you"
                : "message friend"
            }
          >
            <div className="message-content">
              <strong>
                {message.senderId === currentUser.uid ? "You" : friendName}
              </strong>{" "}
              {message.text}
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="uploaded"
                  className="message-image"
                />
              )}
              {message.audioUrl && (
                <audio controls className="message-audio">
                  <source src={message.audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      {showEmojiPicker && (
        <div className="emoji-picker-modal">
          <button
            className="close-emoji-picker"
            onClick={() => setShowEmojiPicker(false)}
          >
            X
          </button>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{
              width: "300px", // se adaptează la dimensiunea părintelui
              maxHeight: "300px", // sau orice valoare dorești pentru a limita înălțimea
              overflowY: "auto",
              // pentru a permite scroll în cazul în care este nevoie
            }}
          />
        </div>
      )}

      <form className="form" onSubmit={sendMessage}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          style={{ display: "none" }}
          id="imageUpload"
        />
        <label htmlFor="imageUpload" className="image-upload-label">
          <i className="fa-solid fa-image"></i>
        </label>

        <div className="input-container">
          <input
            className="message-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker((val) => !val)}
            className="emoji-button"
          >
            <i className="fa-solid fa-icons"></i>
          </button>
        </div>

        <div className="voice-controls">
          {isRecording ? (
            <button onClick={stopRecording} className="send-message">
              <i className="fa-solid fa-stop"></i>
            </button>
          ) : (
            <button onClick={startRecording} className="send-message">
              <i className="fa-solid fa-microphone"></i>
            </button>
          )}
        </div>
        <button className="send-message" type="submit">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default Messages;
