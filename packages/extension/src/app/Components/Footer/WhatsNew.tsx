import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'

import WhatsNewModal from '@app/Screens/Feedback/WhatsNew'

function WhatsNew() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        sx={{
          color: 'primary.main',
        }}
        onClick={() => {
          setOpen(true)
        }}
      >
        <InfoOutlined />
      </IconButton>
      <WhatsNewModal isOpen={open} closeModal={() => setOpen(false)} />
    </>
  )
}

export default WhatsNew
