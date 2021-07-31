import React from 'react'
import styled from 'styled-components'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Edit from '@app/Components/Remindoros/Remindoro/EditFab'
import Title from './Title'
import Note from './Note'

const Holder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-self: flex-start;

  & .title-holder {
    height: 40px;

    border: thin solid red;

    & input {
      width: 100%;
      height: 100%;

      background: transparent;
      color: white;
      padding: 4px;
    }
  }

  & .note-holder {
    height: 400px;

    overflow-y: auto;
    border: thin solid green;
  }

  & .schedule-holder {
    height: 40px;

    border: thin solid yellow;
  }
`

interface Props extends Remindoro {}

function Info({ id, title, note }: Props) {
  return (
    <Holder>
      <div className={'title-holder'}>
        <Title id={id} title={title} />
      </div>
      <div className={'note-holder'}>
        <Note id={id} note={note} readOnly={false} />
      </div>
      <div className={'schedule-holder'}>schedule holder</div>

      {/* Edit Fab */}
      <Edit onClick={() => {}} />
    </Holder>
  )
}

export default Info
