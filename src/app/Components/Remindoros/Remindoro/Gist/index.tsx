import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { getRemindoroUrl } from '@app/Util/'
import ScheduleInfo from '@app/Components/Remindoros/Remindoro/ScheduleInfo'
import NotePreview from '@app/Components/Remindoros/Remindoro/Gist/NotePreview'

const Holder = styled.div`
  cursor: pointer;

  border: thin solid grey;

  & .note-holder {
    height: 100px;
    pointer-events: none;
  }
`

function Card(remindoro: Remindoro) {
  const history = useHistory()

  const { id, title, note, reminder } = remindoro
  const url = getRemindoroUrl(id)

  return (
    <Holder
      onClick={() => {
        history.push(url)
      }}
    >
      <ScheduleInfo reminder={reminder} />
      <div>{title}</div>
      <div className={'note-holder'}>
        <NotePreview id={id} note={note} />
      </div>
    </Holder>
  )
}

export default Card
