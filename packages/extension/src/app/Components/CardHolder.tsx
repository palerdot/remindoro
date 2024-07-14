import React from 'react'
import styled from '@emotion/styled'
import { Card as MCard } from '@mui/material'

const Holder = styled.div`
  margin: 0 16px;

  cursor: pointer;
  border: ${props => `thin solid ${props.theme.palette.grey[100]}`};
  box-shadow: ${props => `0 1px 1px ${props.theme.palette.grey[200]}`};
  background: ${props => props.theme.palette.grey[900]};

  &:hover {
    border: ${props => `thin solid ${props.theme.palette.grey[500]}`};
  }
`

type Props = {
  onClick: () => void
  children: React.ReactElement
}

function CardHolder({ onClick, children }: Props) {
  return (
    <MCard
      onClick={onClick}
      raised={true}
      sx={{
        background: theme => theme.palette.background.paper,
        marginBottom: theme => theme.spacing(3),
        boxShadow: theme => `0 1px 3px ${theme.palette.grey.A100}`,
      }}
    >
      <Holder>{children}</Holder>
    </MCard>
  )
}

export default CardHolder
