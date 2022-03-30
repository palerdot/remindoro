import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

import { WHATS_NEW, WHATS_UP } from 'background'

const Holder = styled.div`
  cursor: pointer;
  color: ${props => props.theme.highlight};
  text-decoration: underline;
  font-style: italic;

  &:hover {
    opacity: 0.89;
  }
`

function WhatsNew() {
  const [isOpen, setStatus] = useState(false)

  return (
    <div>
      <Holder
        onClick={() => {
          setStatus(true)
        }}
      >{`What's New and What's coming up`}</Holder>
      <Dialog
        open={isOpen}
        onClose={() => setStatus(false)}
        fullWidth={true}
        maxWidth={'md'}
        scroll={'paper'}
      >
        <DialogTitle>{`What's New and What's Up!`}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText></DialogContentText>
          <div>
            <div>{`What's New`}</div>
            <ul>
              {WHATS_NEW.map((x, index) => (
                <li key={index}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <div>{`What's Coming Up`}</div>
            <ul>
              {WHATS_UP.map((x, index) => (
                <li key={index}>{x}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatus(false)}>{'Close'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default WhatsNew
