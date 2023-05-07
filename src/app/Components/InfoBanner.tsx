import React from 'react'

type Props = {
  children: React.ReactNode
}

function InfoBanner({ children }: Props) {
  return (
    <div
      style={{
        background: 'rgb(254, 249, 195)',
        borderColor: 'rgb(253, 224, 71)',
        color: 'rgb(31, 41, 55)',
        fontSize: '0.89rem',
        lineHeight: '1.314rem',
        padding: '0.5rem',
        borderRadius: '0.25rem',
      }}
    >
      {children}
    </div>
  )
}

export default InfoBanner
