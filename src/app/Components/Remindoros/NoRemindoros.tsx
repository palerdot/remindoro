import React, { useEffect } from 'react'
import styled from 'styled-components'
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
      background: ${props => props.theme.highlight};
      opacity: 0.89;
    }
  }
`

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;

  background: ${props => props.theme.primaryLight};
  color: ${props => props.theme.textColor};

  margin: 32px;
  padding: 16px;
`

function NoRemindoros() {
  const addRemindoro = useAddRemindoro()
  const addDefaultRemindoro = useDefaultRemindoro()

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
