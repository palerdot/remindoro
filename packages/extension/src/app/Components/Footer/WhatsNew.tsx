import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'

import ChangelogModal from '@app/Screens/Feedback/Changelog/Modal'

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
      <ChangelogModal isOpen={open} closeModal={() => setOpen(false)} />
    </>
  )
}

export default WhatsNew
