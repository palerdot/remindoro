import type React from 'react'
import styled from '@emotion/styled'

type Props = {
  children: React.ReactNode
}

const Disclaimer = styled.div`
  display: flex;
  align-items: center;

  border: ${props => `thin solid ${props.theme.palette.grey[300]}`};
  background: ${props => props.theme.palette.background.default};
  color: ${props => props.theme.palette.primary.main};

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
