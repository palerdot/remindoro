import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { Card as MCard } from '@mui/material'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { getRemindoroUrl } from '@app/Util/'
import ScheduleInfo from '@app/Components/Remindoros/Remindoro/ScheduleInfo'
import TodoBadge from '@app/Components/TodoBadge'
import LiveNote from '@app/Components/LiveNote/'

const Holder = styled.div`
  margin: 0 16px;

  cursor: pointer;
  border: ${props => `thin solid ${props.theme.palette.divider}`};
  box-shadow: ${props => `0 1px 1px ${props.theme.palette.grey.A200}`};
  background: ${props => props.theme.palette.background.default};

  &:hover {
    border: ${props => `thin solid ${props.theme.palette.primary.main}`};
    background: ${props => props.theme.palette.background.paper};
  }

  & .status-bar {
    display: flex;
    flex-direction: row;
    align-items: center;

    & .todo-status {
      margin-left: auto;
    }
  }

  & .title-holder {
    padding: 8px;
    font-size: 18px;

    border-bottom: ${props => `thin solid ${props.theme.palette.divider}`};
  }

  & .note-holder {
    padding: 8px;
    height: 123px;
    pointer-events: none;
    overflow-y: auto;
  }
`

function Card(remindoro: Remindoro) {
  const navigate = useNavigate()

  const { id, title, note, reminder, isTodo } = remindoro
  const url = getRemindoroUrl(id)

  return (
    <MCard
      onClick={() => {
        navigate(url)
      }}
      raised={true}
      sx={{
        background: theme => theme.palette.background.paper,
        marginBottom: theme => theme.spacing(3),
        boxShadow: theme => `0 1px 3px ${theme.palette.grey.A100}`,
      }}
    >
      <Holder>
        <div className="status-bar">
          <ScheduleInfo reminder={reminder} />
          {isTodo && (
            <div className="todo-status">
              <TodoBadge />
            </div>
          )}
        </div>
        {title && <div className={'title-holder'}>{title}</div>}
        <div className={'note-holder'}>
          <LiveNote id={id} note={note} readOnly={true} />
        </div>
      </Holder>
    </MCard>
  )
}

export default Card
