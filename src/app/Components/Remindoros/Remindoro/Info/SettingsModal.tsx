import React from 'react'
import styled from 'styled-components'
import {
  Drawer,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Reminder from './Reminder/'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(0),
    },

    closeButton: {
      color: 'lightblue',
      borderColor: 'lightblue',
      '&:hover': {
        opacity: 0.89,
      },
    },
  })
)

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  height: 314px;
  background: ${props => props.theme.primary};
`

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: thin solid grey;

  margin-top: auto;
  padding: 16px;
`

type Props = {
  isModalOpen: boolean
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>

  remindoro: Remindoro
}

function SettingsModal({ isModalOpen, setModalStatus, remindoro }: Props) {
  const classes = useStyles()

  return (
    <div role="presentation">
      <Drawer
        open={isModalOpen}
        anchor={'bottom'}
        onClose={() => {
          setModalStatus(false)
        }}
      >
        <Holder>
          <Reminder id={remindoro.id} reminder={remindoro.reminder} />
          <ActionBar>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              className={classes.closeButton}
              onClick={() => {
                setModalStatus(false)
              }}
            >
              {'Close'}
            </Button>
          </ActionBar>
        </Holder>
      </Drawer>
    </div>
  )
}

export default SettingsModal
