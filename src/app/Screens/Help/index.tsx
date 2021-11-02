import React from 'react'
import styled from 'styled-components'

import RichTextHelp from '@app/Components/LiveNote/Help/HelpInfo'

const Wrapper = styled.div`
  padding: 16px;
`

const Subtitle = styled.div`
  font-size: 0.95rem;
`

function Help() {
  return (
    <Wrapper>
      <h3>FAQ</h3>
      <Subtitle>{'This section covers some FAQs.'}</Subtitle>
      <RichTextHelp />
    </Wrapper>
  )
}

export default Help
