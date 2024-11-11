import React, { useState, useEffect } from 'react'
import 'firebase/compat/firestore';
import { auth, db, storage } from '@/lib/Firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { TextField, Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from "@/styles/_CardRegistrationForm.module.css"

function _CardRegistrationForm() {
  const [cardName, setCardName] = useState("");
  const [cardText, setCardText] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardStats, setCardStats] = useState("");
  const [cardImage, setCardImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sampleImageUrl, setSampleImageUrl] = useState("");

  useEffect(() => {
    const fetchSampleImageUrl = async () => {
      try {
        // サンプル画像のパスを修正
        const sampleImageRef = ref(storage, 'image/SampleImage/Sample.jpg');
        const url = await getDownloadURL(sampleImageRef);
        setSampleImageUrl(url);
      } catch (error) {
        console.error('サンプル画像URLの取得に失敗しました:', error);
        // フォールバック用のデフォルト画像URLを設定
        setSampleImageUrl('https://firebasestorage.googleapis.com/v0/b/tcg-simulator-2dfd2.appspot.com/o/image%2FSampleImage%2FSample.jpg?alt=media&token=e23f90e5-9145-46c4-be00-6ff91f19cc33');
      }
    };
  
    fetchSampleImageUrl();
  }, []);

  const cardRegistrationButton = async () => {
    if (!cardName) {
      alert("Card Nameは入力してください");
      return;
    }
  
    try {
      let url;
      let imageName;
  
      if (cardImage) {
        // ユーザー固有の画像パスを使用
        const storageRef = ref(storage, `image/${auth.currentUser.uid}/${cardImage.name}`);
        await uploadBytes(storageRef, cardImage);
        url = await getDownloadURL(storageRef);
        imageName = cardImage.name;
      } else {
        // サンプル画像を使用
        url = sampleImageUrl;
        imageName = 'Sample.jpg';
      }
  
      if (!url) {
        throw new Error('画像URLの取得に失敗しました');
      }
  
      await db.collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userCardList')
        .add({
          cardName: cardName,
          cardText: cardText || "",
          cardType: cardType || "",
          cardStats: cardStats || "",
          cardImage: imageName,
          cardImageUrl: url,
          createdAt: new Date()
        });
  
      alert("カードが登録されました");
      setCardName("");
      setCardText("");
      setCardType("");
      setCardStats("");
      setCardImage(null);
      setImagePreview(null);
    } catch (error) {
      alert('エラーが発生しました');
      console.error('エラーが発生しました: ', error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setCardImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Box component="form" noValidate autoComplete="off" sx={{ '& > :not(style)': { m: 1 } }}>
        <TextField
          label="Card Name"
          variant="outlined"
          fullWidth
          required
          value={cardName}
          onChange={(event) => setCardName(event.target.value)}
        />
        <TextField
          label="Card Text"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={cardText}
          onChange={(event) => setCardText(event.target.value)}
        />
        <TextField
          label="Card Type"
          variant="outlined"
          fullWidth
          value={cardType}
          onChange={(event) => setCardType(event.target.value)}
        />
        <TextField
          label="Card Stats"
          variant="outlined"
          fullWidth
          value={cardStats}
          onChange={(event) => setCardStats(event.target.value)}
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept=".png, .jpeg, .jpg"
            onChange={handleImageChange}
          />
        </Button>
        {imagePreview && (
          <Box mt={2}>
            <Typography variant="subtitle1">Image Preview:</Typography>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </Box>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={cardRegistrationButton}
          disabled={!cardName}
        >
          追加
        </Button>
        <p style={{color : "gray"}}>※最大200kbまで</p>
      </Box>
    </div>
  )
}

export default _CardRegistrationForm