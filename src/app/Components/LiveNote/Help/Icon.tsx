import React, { useState } from 'react'
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import { Help } from '@mui/icons-material'

import Feedback from './FeedbackInfo'

function Icon() {
  const [isOpen, setStatus] = useState(false)
  return (
    <span>
      <IconButton
        component="span"
        sx={{
          color: theme => theme.colors.highlight,
          '&:hover': {
            opacity: 0.89,
          },
        }}
        onClick={() => setStatus(true)}
      >
        <Help />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={() => setStatus(false)}
        fullWidth={true}
        maxWidth={'md'}
        scroll={'paper'}
      >
        <DialogTitle>{'Rich Text Editor'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {'porumai ... wait and hope ...'}
            <Feedback />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatus(false)}>{'Close'}</Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}

export default Icon
