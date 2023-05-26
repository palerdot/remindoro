import React from 'react'
import styled from '@emotion/styled'

type Props = {
  children: React.ReactNode
}

const Disclaimer = styled.div`
  display: flex;
  align-items: center;

  border: ${props => `thin solid ${props.theme.primaryDark}`};
  background: ${props => props.theme.background};
  color: ${props => props.theme.highlight};

  padding: 16px;
`

function InfoBanner({ children }: Props) {
  return (
    // <div
    //   style={{
    //     background: 'rgb(254, 249, 195)',
    //     borderColor: 'rgb(253, 224, 71)',
    //     color: 'rgb(31, 41, 55)',
    //     fontSize: '0.89rem',
    //     lineHeight: '1.314rem',
    //     padding: '0.5rem',
    //     borderRadius: '0.25rem',
    //   }}
    // >
    <Disclaimer>{children}</Disclaimer>
  )
}

export default InfoBanner
