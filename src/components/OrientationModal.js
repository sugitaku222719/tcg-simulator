import React from 'react';
import { Modal } from '@mui/material';
import styles from "../styles/_PlayRoom.module.css";

const OrientationModal = ({ showModal, setShowModal, handleOrientationSelect }) => {
  return (
    <Modal open={showModal} onClose={() => setShowModal(false)} aria-labelledby="カードの向きを選択">
      <div className={styles.orientationModal}>
        <h2 id="カードの向きを選択">カードの向きを選択</h2>
        <div className={styles.orientationOptions}>
          <button onClick={() => handleOrientationSelect('vertical-up')}>縦（表）</button>
          <button onClick={() => handleOrientationSelect('vertical-down')}>縦（裏）</button>
          <button onClick={() => handleOrientationSelect('horizontal-up')}>横（表）</button>
          <button onClick={() => handleOrientationSelect('horizontal-down')}>横（裏）</button>
        </div>
        <button onClick={() => setShowModal(false)}>キャンセル</button>
      </div>
    </Modal>
  );
};

export default OrientationModal;