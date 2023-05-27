import React from 'react'
import styled from '@emotion/styled'

import RichTextHelp from '@app/Components/LiveNote/Help/HelpInfo'

const Wrapper = styled.div`
  padding: 20px;
`

const Faq = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: thin solid ${props => props.theme.borderDark};
`

const Question = styled.div`
  font-size: 1.314rem;
  margin-bottom: 16px;
`

const Answer = styled.div`
  line-height: 1.5rem;
  font-size: 1rem;
`

const Subtitle = styled.div`
  font-size: 0.95rem;
  padding-bottom: 16px;
  border-bottom: thin solid ${props => props.theme.borderDark};
`

const Disclaimer = styled.div`
  display: flex;
  align-items: center;

  background: ${props => props.theme.highlight};
  color: ${props => props.theme.highlightTextColor};

  padding: 16px;
`

const FAQS = [
  {
    question: 'How to edit a note?',
    answer:
      'Click on the card in the home page. You will navigate to a dedicated screen to edit your note. In the dedicated screen, you can also make use of the new experimental rich text editor. To configure reminder/repeat settings, click on the button in the bottom right corner of the screen.',
  },
  {
    question: 'How to pause notifications temporarily?',
    answer:
      'You can pause/resume notifications from bottom left corner of the screen. You will see a green/red color bell icon. You can click on it to pause/resume notifications. You can also do this from the settings screen.',
  },
  {
    question: 'How to go to home screen after editing a note?',
    answer:
      'You can click on the home icon in the header (top right part of the screen) to get back to the home screen.',
  },
  {
    question: 'What is Rich Text Editor?',
    answer:
      'Rich Text editor allows you to edit your note content with rich text semantics like checklist items, bold, italic etc. Please refer to next section for more details. Please note this feature is currently experimental/beta. If you face any problems, please give feedback via - palerdot@gmail.com.',
  },
  {
    question: 'What is the count/badge shown on top of extension icon?',
    answer: `This is the count of notes marked as todo. You can mark a note as todo from the note settings screen. You can navigate to todo screen from the header or sidebar menu, where you can see all the notes marked as todo.`,
  },
  {
    question: 'What version of browsers are supported?',
    answer:
      'Starting v1.2.x, following browsers are supported - Chrome 58+, Firefox 53+, Edge 16+. IE not supported. For more info check ES2017 target here - https://webhint.io/docs/user-guide/hints/hint-typescript-config/target/',
  },
]

function Help() {
  return (
    <Wrapper>
      <Disclaimer>
        {'If you face any problems using new updated Remindoro'}
        {', please let me know via '}
        <strong className={'highlight'}>{'palerdot@gmail.com'}</strong>
      </Disclaimer>
      <h2>FAQ</h2>
      <Subtitle>{'This section covers some FAQs.'}</Subtitle>
      <div>
        {FAQS.map(({ question, answer }, index) => (
          <Faq key={index}>
            <Question>{question}</Question>
            <Answer>{answer}</Answer>
          </Faq>
        ))}
      </div>
      <RichTextHelp />
    </Wrapper>
  )
}

export default Help
