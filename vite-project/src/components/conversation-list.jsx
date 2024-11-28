import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
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
  const listRef = useRef(null);

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

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [filteredConversations]);

  const goToConversation = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f6f8, #ffffff)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          background: "#6a11cb",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <IconButton
          onClick={() => navigate("/profile")}
          sx={{
            color: "white",
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
          Conversations
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          padding: 2,
          background: "#f1f1f1",
          borderBottom: "1px solid #ddd",
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "white",
              "&:hover fieldset": {
                borderColor: "#6a11cb",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6a11cb",
              },
            },
          }}
        />
      </Box>

      {/* Conversations List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        {filteredConversations.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <List ref={listRef}>
            {filteredConversations.map((conversation) => {
              const otherParticipantId = conversation.participants.find(
                (id) => id !== currentUser.uid
              );
              const name = participantNames[otherParticipantId] || "Loading...";

              return (
                <Box key={conversation.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => goToConversation(conversation.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        paddingY: 1,
                        "&:hover": {
                          background: "#f5f5f5",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: "#6a11cb",
                          color: "white",
                        }}
                      >
                        {name.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={name}
                        primaryTypographyProps={{
                          fontWeight: "bold",
                          color: "#333",
                        }}
                        secondary="Last message here..."
                        secondaryTypographyProps={{
                          color: "#555",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Box>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default ConversationList;
