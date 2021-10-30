import React, { Component, ErrorInfo } from 'react'
import styled from 'styled-components'
import { DebouncedFunc } from '@lodash'
// ref: https://reactjs.org/docs/error-boundaries.html

import PlainTextEditor from '@app/Components/LiveNote/PlainTextEditor'

type Props = {
  id: string
  note?: string
  readOnly?: boolean
  children: React.ReactNode
  onChange: DebouncedFunc<(updatedNote: string) => void>
}

type State = {
  hasError: boolean
}

const Holder = styled.div``

const InfoText = styled.div`
  background: tomato;
  padding: 4px;

  color: white;

  & .fix-error {
    margin-left: 4px;
  }
`

class BackupEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  fixError = () => {
    this.setState({
      hasError: false,
    })
  }

  // ref: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
  componentDidCatch(_error: Error, _info: ErrorInfo) {}

  render() {
    const { id, note, readOnly, onChange } = this.props

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Holder>
          <InfoText>
            {'Unexpected problem with rich text editor.'}
            <button
              className={'fix-error'}
              onClick={() => {
                this.fixError()
              }}
            >
              {'Click here to rectify.'}
            </button>
          </InfoText>
          <PlainTextEditor
            id={id}
            note={note}
            readOnly={readOnly}
            onChange={onChange}
          />
        </Holder>
      )
    }

    return this.props.children
  }
}

export default BackupEditor
