import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { Screens } from '@app/Routes/'

const Holder = styled.div`
  cursor: pointer;

  border: thin solid grey;
`

function Card(remindoro: Remindoro) {
  const history = useHistory()

  const { id, title } = remindoro

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
    </Holder>
  )
}

export default Card
