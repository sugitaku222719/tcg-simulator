import { Button } from '@mui/material';
import React from 'react';
import { auth } from "../firebase.js";
import CallIcon from "@mui/icons-material/Call"

function SignOut() {
  return (
    <div className="header">
      <Button 
      style = {{ color: "white", fontsize: "15px" }} 
      onClick={() => auth.signOut()}
      >
      サインアウト
      </Button>
      <h3>
        {auth.currentUser.displayName}
        <CallIcon />
      </h3>
    </div>
  )
}

export default SignOut
