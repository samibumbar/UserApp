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
  setDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

function Messages() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendName, setFriendName] = useState("Friend");
  const [isCallActive, setIsCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  );
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

  const startCall = async () => {
    setIsCallActive(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    await setDoc(doc(db, "calls", `${conversationId}-offer`), {
      offer,
      senderId: currentUser.uid,
      conversationId,
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "calls"),
      async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const data = change.doc.data();
          if (
            data.conversationId === conversationId &&
            data.senderId !== currentUser.uid
          ) {
            try {
              if (change.doc.id === `${conversationId}-offer` && data.offer) {
                if (peerConnection.current.signalingState === "stable") {
                  await peerConnection.current.setRemoteDescription(
                    new RTCSessionDescription(data.offer)
                  );
                  const answer = await peerConnection.current.createAnswer();
                  await peerConnection.current.setLocalDescription(answer);
                  await setDoc(doc(db, "calls", `${conversationId}-answer`), {
                    answer,
                    senderId: currentUser.uid,
                    conversationId,
                  });
                }
              } else if (
                change.doc.id === `${conversationId}-answer` &&
                data.answer
              ) {
                if (
                  peerConnection.current.signalingState === "have-local-offer"
                ) {
                  await peerConnection.current.setRemoteDescription(
                    new RTCSessionDescription(data.answer)
                  );
                }
              }
            } catch (error) {
              console.error("RTC Error:", error);
            }
          }
        });
      }
    );
    return () => unsubscribe();
  }, [conversationId, currentUser.uid]);

  return (
    <div className="messages-container">
      <div className="chating-with">
        <h2 className="friend-name-header">{friendName}</h2>
        <button onClick={startCall} className="call-button">
          Start Call
        </button>
      </div>
      {isCallActive && (
        <div className="video-call">
          <video ref={localVideoRef} autoPlay muted className="local-video" />
          <video ref={remoteVideoRef} autoPlay className="remote-video" />
          <button onClick={() => setIsCallActive(false)}>End Call</button>
        </div>
      )}
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
            <strong>
              {message.senderId === currentUser.uid ? "You" : friendName}
            </strong>{" "}
            {message.text}
          </li>
        ))}
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
      </form>
    </div>
  );
}

export default Messages;
