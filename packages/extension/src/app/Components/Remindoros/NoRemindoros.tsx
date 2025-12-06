import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { PlaylistAdd } from '@mui/icons-material'

import {
  useAddRemindoro,
  useDefaultRemindoro,
} from '@app/Components/AddRemindoro/'

const EmptyMessageHolder = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  & .add-new-button {
    &:hover {
      background: ${props => props.theme.palette.secondary.main};
      opacity: 0.89;
    }
  }
`

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;

  background: ${props => props.theme.palette.primary.contrastText};
  color: ${props => props.theme.palette.text.primary};

  margin: 32px;
  padding: 16px;
`

function NoRemindoros() {
  const addRemindoro = useAddRemindoro()
  const addDefaultRemindoro = useDefaultRemindoro()

  // when component is mounted, adds default 'Take a Walk' remindoro
  useEffect(() => {
    addDefaultRemindoro()
  }, [addDefaultRemindoro])

  return (
    <EmptyMessageHolder>
      <EmptyMessage>{'No Notes found.'}</EmptyMessage>
      <Button
        variant="contained"
        className={'add-new-button'}
        startIcon={<PlaylistAdd />}
        onClick={() => {
          addRemindoro()
        }}
      >
        Add New
      </Button>
    </EmptyMessageHolder>
  )
}

export default NoRemindoros
