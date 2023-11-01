import React from 'react'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { orderBy } from '@lodash'
import { Notes as NotesIcon } from '@mui/icons-material'

import type { RootState } from '@app/Store/'

import AddRemindoro from '@app/Components/AddRemindoro'
import Remindoros from '@app/Components/Remindoros/'
import CardHolder from '@app/Components/CardHolder'
import { Screens } from '@app/Util/Enums'

function RemindorosScreen() {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  // sort remindoros
  const sortedRemindoros = orderBy(remindoros, 'updated', 'desc')

  return (
    <div>
      <Remindoros remindoros={sortedRemindoros} />
      <AddRemindoro />
    </div>
  )
}

export default RemindorosScreen

const DashboardHolder = styled.div`
  & .title-holder {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 8px;

    & .title {
      font-size: 1.25rem;
      font-weight: 500;
      margin: auto 8px;
    }
  }

  & .content {
    padding: 8px;
  }

  & .subtitle {
    font-size: 0.75rem;
    font-style: italic;

    padding-bottom: 16px;
    margin-bottom: 8px;

    display: flex;
    justify-content: center;
  }
`

export function DashboardGist() {
  const history = useHistory()

  const remindoros = useSelector((state: RootState) => state.remindoros)
  const todos = remindoros.filter(r => r.isTodo === true)

  return (
    <CardHolder
      onClick={() => {
        history.push(Screens.Remindoros)
      }}
    >
      <DashboardHolder>
        <div className="title-holder">
          <NotesIcon fontSize="medium" />
          <div className="title">{'Reminders'}</div>
        </div>
        <div className="content">
          <div>{`Total Reminders - ${remindoros.length}`}</div>
          <div>{`Todos - ${todos.length}`}</div>
        </div>
        <div className="subtitle">
          {'Click on the card to go to Reminders screen.'}
        </div>
      </DashboardHolder>
    </CardHolder>
  )
}
