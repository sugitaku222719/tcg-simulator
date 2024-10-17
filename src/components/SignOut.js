import { Button } from '@mui/material';
import React from 'react';
import { auth } from '@/lib/Firebase';

function SignOut() {
  return (
    <div className="header">
      <Button 
      style = {{ color: "red", fontsize: "15px" }} 
      onClick={() => auth.signOut()}
      >
      サインアウト
      </Button>
      <h3>
        {auth.currentUser.displayName}
      </h3>
    </div>
  )
}

export default SignOut
