import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { Screens } from '@app/Routes/'
import Note from '@app/Components/Remindoros/Remindoro/Info/Note'

const Holder = styled.div`
  cursor: pointer;

  border: thin solid grey;

  & .note-holder {
    height: 100px;
  }
`

function Card(remindoro: Remindoro) {
  const history = useHistory()

  const { id, title, note } = remindoro

  return (
    <Holder
      onClick={() => {
        history.push(Screens.RemindoroInfo, {
          remindoro,
        })
      }}
    >
      <div>{id}</div>
      <div>{title}</div>
      <div className={'note-holder'}>
        <Note id={id} note={note} readOnly />
      </div>
    </Holder>
  )
}

export default Card
