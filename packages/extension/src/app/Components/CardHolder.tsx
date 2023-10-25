import React from 'react'
import styled from '@emotion/styled'
import { Card as MCard } from '@mui/material'

const Holder = styled.div`
  margin: 0 16px;

  cursor: pointer;
  border: ${props => `thin solid ${props.theme.borderDark}`};
  box-shadow: ${props => `0 1px 1px ${props.theme.border}`};
  background: ${props => props.theme.borderDark};

  &:hover {
    border: ${props => `thin solid ${props.theme.primaryLight}`};
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
        background: theme => theme.colors.background,
        marginBottom: theme => theme.spacing(3),
        boxShadow: theme => `0 1px 3px ${theme.colors.border}`,
      }}
    >
      <Holder>{children}</Holder>
    </MCard>
  )
}

export default CardHolder
