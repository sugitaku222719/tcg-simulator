import { auth, db } from '@/lib/Firebase'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Container, Box, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, Paper } from '@mui/material';
import styles from '@/styles/_RoomCreate.module.css';

function _RoomCreate() {
  const [deckDocId, setDeckDocId] = useState("");
  const [sideDeckDocId, setSideDeckDocId] = useState("");
  const [decks, setDecks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const [opponentUid, setOpponentUid] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const myUsersDataBaseRef = db
    .collection("usersDataBase")
    .doc(auth.currentUser.uid)
    .collection("rooms")

  useEffect(() => {
    const fetchDecks = async () => {
      const cardsRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .orderBy("name", "asc");

      const snapshot = await cardsRef.get();
      const _decks = snapshot.docs.map(doc => ({
        deckId: doc.id,
        ...doc.data(),
      }));
      setDecks(_decks);
    };

    const unsubscribeHostRooms = myUsersDataBaseRef.doc("hostRooms").onSnapshot(snapshot => {
      const hostRooms = snapshot.data() || {};
      updateRooms(hostRooms, true);
    });

    const unsubscribeGuestRooms = myUsersDataBaseRef.doc("guestRooms").onSnapshot(snapshot => {
      const guestRooms = snapshot.data() || {};
      updateRooms(guestRooms, false);
    });

    const updateRooms = (newRooms, isHost) => {
      setRooms(prevRooms => {
        const updatedRooms = prevRooms.filter(room => room.isHost !== isHost);
        const newRoomsList = Object.entries(newRooms).map(([roomId, room]) => ({
          ...room,
          roomId,
          isHost
        }));
        return [...updatedRooms, ...newRoomsList];
      });
    };

    fetchDecks();

    return () => {
      unsubscribeHostRooms();
      unsubscribeGuestRooms();
    };
  }, []);

  const roomCreateOrEnterFunction = async () => {
    const existingHostRoom = rooms.find(room => room.hostUserId === opponentUid);
    const existingGuestRoom = rooms.find(room => room.guestUserId === opponentUid);

    if (existingHostRoom) {
      // 既存の部屋に入室（ゲストとして）
      await roomFunction(opponentUid, auth.currentUser.uid, false, existingHostRoom.roomId);
    } else if (existingGuestRoom) {
      // 既存の部屋に入室（ホストとして）
      await roomFunction(auth.currentUser.uid, opponentUid, true, existingGuestRoom.roomId);
    } else {
      // 新しい部屋を作成（ホストとして）
      await roomFunction(auth.currentUser.uid, opponentUid, true);
    }
  };

  const roomFunction = async (hostUid, guestUid, isHost, existingRoomId = null) => {
    const roomId = existingRoomId || `${hostUid}-${guestUid}`;
    try {
      const roomRef = db.collection("roomsDataBase").doc(roomId);
      const roomData = {
        hostUserId: hostUid,
        guestUserId: guestUid,
        [isHost ? 'hostDeckDocId' : 'guestDeckDocId']: deckDocId,
        [isHost ? 'hostSideDeckDocId' : 'guestSideDeckDocId']: sideDeckDocId,
        createdAt: new Date(),
      };

      await roomRef.set(roomData, { merge: true });

      const userRoomRef = myUsersDataBaseRef.doc(isHost ? "hostRooms" : "guestRooms");
      await userRoomRef.set({ [roomId]: roomData }, { merge: true });

      const opponentRoomRef = db
        .collection("usersDataBase")
        .doc(isHost ? guestUid : hostUid)
        .collection("rooms")
        .doc(isHost ? "guestRooms" : "hostRooms");
      await opponentRoomRef.set({ [roomId]: roomData }, { merge: true });
  
      const deckRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckDocId)
        .collection("cards");
      const snapshot = await deckRef.get();
      const deck = await Promise.all(snapshot.docs.map(async (doc) => {
        const cardRef = doc.data().cardRef;
        const cardDoc = await cardRef.get();
        return {
          cardDocId: cardDoc.id,
          uuid: doc.id,
          ...cardDoc.data(),
          position: { row: 3, col: 3 }
        };
      }));
  
      const roomDeckRef = db
        .collection("roomsDataBase")
        .doc(roomId)
        .collection(auth.currentUser.uid)
        .doc("deck");
      await roomDeckRef.set({ cards: deck });
  
      if (sideDeckDocId){
        const sideDeckRef = db
          .collection('cardsDataBase')
          .doc(auth.currentUser.uid)
          .collection('userDeckList')
          .doc(sideDeckDocId)
          .collection("cards");
        const sideSnapshot = await sideDeckRef.get();
        const sideDeck = await Promise.all(sideSnapshot.docs.map(async (doc) => {
          const cardRef = doc.data().cardRef;
          const cardDoc = await cardRef.get();
          return {
            cardDocId: cardDoc.id,
            uuid: doc.id,
            ...cardDoc.data(),
            position: { row: 3, col: 3 }
          };
        }));
        const roomSideDeckRef = db
          .collection("roomsDataBase")
          .doc(roomId)
          .collection(auth.currentUser.uid)
          .doc("sideDeck");
        await roomSideDeckRef.set({ cards: sideDeck });
      } else {
        const roomSideDeckRef = db
          .collection("roomsDataBase")
          .doc(roomId)
          .collection(auth.currentUser.uid)
          .doc("sideDeck");
        await roomSideDeckRef.set({ cards: [] });
      }
  
      alert(existingRoomId ? "部屋に入室しました" : "部屋が作成されました");
      router.push(`/playRoom/${roomId}`);
    } catch (error) {
      alert("エラーが発生しました");
      console.error('エラーが発生しました: ', error);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setDeckDocId(room.isHost ? room.hostDeckDocId : room.guestDeckDocId);
    setSideDeckDocId(room.isHost ? room.hostSideDeckDocId : room.guestSideDeckDocId);
  };
  
  const handleJoinRoom = () => {
    if (selectedRoom && selectedRoom.hostDeckDocId && selectedRoom.guestDeckDocId) {
      router.push(`/playRoom/${selectedRoom.roomId}`);
    } else {
      alert("両プレイヤーがデッキを選択するまで部屋に入室できません。");
    }
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        ルーム作成/入室
      </Typography>
      <Typography variant="h6" gutterBottom>
        あなたのUID: {auth.currentUser.uid}
      </Typography>
      <Box className={styles.formContainer}>
        <TextField
          fullWidth
          label="対戦相手のUID"
          variant="outlined"
          value={opponentUid}
          onChange={(event) => setOpponentUid(event.target.value)}
          className={styles.input}
        />
        <FormControl fullWidth variant="outlined" className={styles.input}>
          <InputLabel>デッキ選択</InputLabel>
          <Select
            value={deckDocId}
            onChange={(event) => setDeckDocId(event.target.value)}
            label="デッキ選択"
          >
            {decks.map((deck) => (
              <MenuItem key={deck.deckId} value={deck.deckId}>
                {deck.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" className={styles.input}>
          <InputLabel>サイドデッキ選択</InputLabel>
          <Select
            value={sideDeckDocId}
            onChange={(event) => setSideDeckDocId(event.target.value)}
            label="サイドデッキ選択"
          >
            <MenuItem value="">
              <em>なし</em>
            </MenuItem>
            {decks.map((deck) => (
              <MenuItem key={deck.deckId} value={deck.deckId}>
                {deck.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className={styles.buttonContainer}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={roomCreateOrEnterFunction}
            className={styles.button}
          >
            部屋作成/入室
          </Button>
        </Box>
      </Box>
      <Typography variant="h5" gutterBottom>
        ルーム一覧
      </Typography>
      <List>
        {rooms.map((room) => (
          <Paper 
            key={room.roomId} 
            elevation={3} 
            className={`${styles.roomItem} ${selectedRoom && selectedRoom.roomId == room.roomId ? styles.selectedRoom : ''}`}
            onClick={() => handleRoomClick(room)}
          >
            <ListItem>
              <ListItemText
                primary={`Room ID: ${room.roomId}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" display="block">
                      Opponent User ID: {room.isHost ? room.guestUserId : room.hostUserId}
                    </Typography>
                    <Typography component="span" variant="body2" display="block">
                      My Deck ID: {room.isHost ? room.hostDeckDocId : room.guestDeckDocId}
                    </Typography>
                    <Typography component="span" variant="body2" display="block">
                      My Side Deck ID: {room.isHost ? room.hostSideDeckDocId : room.guestSideDeckDocId}
                    </Typography>
                    <Typography component="span" variant="body2" display="block">
                      Opponent Deck ID: {room.isHost ? room.guestDeckDocId : room.hostDeckDocId}
                    </Typography>
                    <Typography component="span" variant="body2" display="block">
                      Opponent Side Deck ID: {room.isHost ? room.guestSideDeckDocId : room.hostSideDeckDocId}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={handleJoinRoom}
        disabled={!selectedRoom || !selectedRoom.hostDeckDocId || !selectedRoom.guestDeckDocId}
        className={styles.joinButton}
      >
        選択した部屋に入室
      </Button>
    </Container>
  );
};

export default _RoomCreate