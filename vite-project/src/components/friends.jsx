import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Chat, Person, Delete } from "@mui/icons-material";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";

function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null); 
  const [deleteConfirm, setDeleteConfirm] = useState(null); 
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const fetchFriends = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "users"));
    setFriends(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setLoading(false);
  };

  useEffect(() => {
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

  const viewProfile = async (friendId) => {
    try {
      const friendDoc = await getDoc(doc(db, "users", friendId));
      if (friendDoc.exists()) {
        setSelectedFriend(friendDoc.data());
      }
    } catch (error) {
      console.error("Error fetching friend's profile: ", error.message);
    }
  };

  const deleteFriend = async (friendId) => {
    try {
      await deleteDoc(doc(db, "users", friendId));
      setFriends(friends.filter((friend) => friend.id !== friendId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting friend: ", error.message);
    }
  };

  const handleCloseProfile = () => {
    setSelectedFriend(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      }}
    >
  
      <AppBar position="sticky" sx={{ background: "#6a11cb" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Friends
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            background: "white",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#6a11cb",
              },
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
          }}
        />
      </Box>

    
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          background: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: "0px -2px 8px rgba(0,0,0,0.1)",
          padding: 2,
        }}
      >
        {loading ? (
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
          <List>
            {filteredFriends.map((friend) => (
              <ListItem key={friend.id} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#6a11cb", color: "white" }}>
                      {friend.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.name}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => startConversation(friend.id)}
                  >
                    <Chat />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => viewProfile(friend.id)}
                  >
                    <Person />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteConfirm(friend.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Dialog open={!!selectedFriend} onClose={handleCloseProfile}>
        <DialogTitle>{selectedFriend?.name}</DialogTitle>
        <DialogContent>
          <Typography>Email: {selectedFriend?.email}</Typography>
          <Typography>Date of Birth: {selectedFriend?.birthdate}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

     
      <Dialog open={!!deleteConfirm} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this friend?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => deleteFriend(deleteConfirm)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FriendsList;
