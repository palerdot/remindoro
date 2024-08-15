import React from 'react'
import styled from '@emotion/styled'
import { IndeterminateCheckBox } from '@mui/icons-material'

const Holder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border: ${props => `thin solid ${props.theme.palette.divider}`};
  background: ${props => props.theme.palette.background.paper};
  color: ${props => props.theme.palette.text.primary};

  font-size: 0.64rem;
  font-weight: 600;
  border-radius: 1px;
  padding: 0 2px;

  width: 58px;
  height: 28px;

  & .icon {
    display: flex;

    & svg {
      font-size: 1.314rem;
      fill: ${props => props.theme.palette.secondary.main};
    }
  }

  & .text {
    margin: 0 0.25rem;
  }
`

function TodoBadge() {
  return (
    <Holder>
      <div className="icon">
        <IndeterminateCheckBox />
      </div>
      <div className="text">{'TODO'}</div>
    </Holder>
  )
}

export default TodoBadge
