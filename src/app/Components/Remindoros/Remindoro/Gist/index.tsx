import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { Screens } from '@app/Routes/'
import NotePreview from '@app/Components/Remindoros/Remindoro/Gist/NotePreview'

const Holder = styled.div`
  cursor: pointer;

  border: thin solid grey;

  & .note-holder {
    height: 100px;
    pointer-events: none;
  }
`

// `/remindoro/:id` => '/remindoro/<ID>'
function getRemindoroUrl(id: string) {
  return Screens.RemindoroInfo.replace(':id', id)
}

function Card(remindoro: Remindoro) {
  const history = useHistory()

  const { id, title, note } = remindoro
  const url = getRemindoroUrl(id)

  return (
    <Holder
      onClick={() => {
        history.push(url)
      }}
    >
      <div>{id}</div>
      <div>{title}</div>
      <div className={'note-holder'}>
        <NotePreview id={id} note={note} />
      </div>
    </Holder>
  )
}

export default Card
