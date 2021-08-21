import React, { Component, ErrorInfo } from 'react'
import styled from 'styled-components'
import { DebouncedFunc } from '@lodash'
// ref: https://reactjs.org/docs/error-boundaries.html

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

const Holder = styled.div`
  background: red;
  color: white;

  textarea {
    width: 100%;
    height: 314px;
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

  // ref: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
  componentDidCatch(_error: Error, _info: ErrorInfo) {}

  render() {
    const { note, readOnly, onChange } = this.props

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Holder>
          <div>
            {
              'Problem showing Rich Text Editor. Please report this issue if you encounter this frequently.'
            }
          </div>
          <textarea
            disabled={readOnly}
            defaultValue={note || ''}
            onChange={e => {
              onChange(e.target.value)
            }}
          ></textarea>
        </Holder>
      )
    }

    return this.props.children
  }
}

export default BackupEditor
