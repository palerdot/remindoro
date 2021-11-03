import React, { Component, ErrorInfo } from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { AutoFixHigh } from '@mui/icons-material'

const MessageHolder = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  & .recover-button {
    &:hover {
      background: ${props => props.theme.highlight};
      opacity: 0.89;
    }
  }
`

const Message = styled.div`
  display: flex;
  align-items: center;

  background: ${props => props.theme.primaryLight};
  color: ${props => props.theme.textColor};

  margin: 32px;
  padding: 16px;
`

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  // ref: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  fixError = () => {
    this.setState({
      hasError: false,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <MessageHolder>
          <Message>
            {
              'Something unexpected occurred. Please click the button below for recovery. If the issue persists close the extension and try again.'
            }
          </Message>
          <Button
            variant="contained"
            className={'recover-button'}
            startIcon={<AutoFixHigh />}
            onClick={() => {
              this.fixError()
            }}
          >
            Click here to Recover
          </Button>
        </MessageHolder>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
