import React from 'react'
import styled from 'styled-components'

const Holder = styled.div`
  display: flex;
  margin-top: auto;

  border-top: thin solid red;
  padding: 8px;
`

function Footer() {
  return (
    <Holder>{'porumai ... wait and hope !!! footer ... amaidhi !!! '}</Holder>
  )
}

export default Footer
