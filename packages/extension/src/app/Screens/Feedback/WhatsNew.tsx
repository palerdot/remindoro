import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

import { WHATS_NEW, WHATS_UP } from '@background/utils/'

// const Holder = styled.div`
//   cursor: pointer;
//   color: ${props => props.theme.highlight};
//   text-decoration: underline;
//   font-style: italic;

//   &:hover {
//     opacity: 0.89;
//   }
// `

type Props = {
  isOpen: boolean
  closeModal: () => void
}

function WhatsNew({ isOpen, closeModal }: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
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
        <Button onClick={() => closeModal()}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default WhatsNew
