import { useState, useEffect, useRef } from "react";
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
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  Paper,
  // IconButton,
  // CircularProgress,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import {
  Send,
  Image,
  EmojiEmotions,
  Mic,
  Stop,
  ArrowBack,
} from "@mui/icons-material";

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
  const [zoomedImage, setZoomedImage] = useState(null);
  const currentUser = auth.currentUser;
  const messagesEndRef = useRef(null);

  // Fetch participant's name
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

  // Scroll to bottom on new messages
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

  const handleAudioUpload = async (docId) => {
    const audioRef = ref(
      storage,
      `audio/${conversationId}/${Date.now()}_audio.wav`
    );

    await uploadBytes(audioRef, audioFile);
    const audioURL = await getDownloadURL(audioRef);

    const messageRef = doc(
      db,
      `conversations/${conversationId}/messages`,
      docId
    );
    await updateDoc(messageRef, { audioUrl: audioURL });
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f4f6f8, #ffffff)",
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          background: "#6a11cb",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <Button
          onClick={() => navigate("/messages/conversation-list")}
          variant="contained"
          sx={{
            background: "#6a11cb",
            "&:hover": {
              background: "#4a0f9a",
            },
          }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h6" sx={{ ml: 2 }}>
          {friendName}
        </Typography>
      </Box>

      {/* Messages Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          marginTop: "64px",
          padding: 2,
        }}
      >
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent:
                  message.senderId === currentUser.uid
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 1,
                  maxWidth: "70%",
                  background:
                    message.senderId === currentUser.uid
                      ? "#6a11cb"
                      : "#f1f1f1",
                  color:
                    message.senderId === currentUser.uid ? "white" : "black",
                }}
              >
                <Typography>{message.text}</Typography>
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="uploaded"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "300px",
                      width: "100%",
                      cursor: "pointer",
                      marginTop: 5,
                    }}
                    onClick={() => setZoomedImage(message.imageUrl)}
                  />
                )}
                {message.audioUrl && (
                  <audio controls>
                    <source src={message.audioUrl} type="audio/wav" />
                  </audio>
                )}
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={sendMessage}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          background: "#f1f1f1",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderTop: "2px solid #6a11cb",
        }}
      >
        <Button
          component="label"
          variant="contained"
          sx={{
            background: "#6a11cb",
            color: "white",
            "&:hover": {
              background: "#4a0f9a",
            },
            marginRight: 1,
          }}
        >
          <Image />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </Button>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderColor: "#6a11cb",
              "&:hover fieldset": {
                borderColor: "#6a11cb",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6a11cb",
              },
            },
            "& .MuiInputBase-input": {
              color: "black",
            },
            marginRight: 1,
          }}
        />
        <Button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          variant="contained"
          sx={{
            background: "#6a11cb",
            color: "white",
            "&:hover": {
              background: "#4a0f9a",
            },
            marginRight: 1,
          }}
        >
          <EmojiEmotions />
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant="contained"
          sx={{
            background: "#6a11cb",
            color: "white",
            "&:hover": {
              background: "#4a0f9a",
            },
            marginRight: 1,
          }}
        >
          {isRecording ? <Stop /> : <Mic />}
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "#6a11cb",
            color: "white",
            "&:hover": {
              background: "#4a0f9a",
            },
          }}
        >
          <Send />
        </Button>
      </Box>

      {showEmojiPicker && (
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            left: 20,
            zIndex: 10,
            background: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}

      {/* Image Zoom Dialog */}
      <Dialog open={!!zoomedImage} onClose={() => setZoomedImage(null)}>
        <DialogContent>
          <img
            src={zoomedImage}
            alt="Zoomed"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Messages;
