import styled from '@emotion/styled'

export const Holder = styled.div`
  padding: 20px;

  textarea {
    width: 100%;
    resize: none;

    padding: 8px;

    background-color: ${props => props.theme.palette.background.default};
    border: ${props => `thin solid ${props.theme.palette.divider}`};
    color: ${props => props.theme.palette.text.primary};

    /* ref: https://stackoverflow.com/questions/16156594/how-to-change-border-color-of-textarea-on-focus */
    &:focus {
      outline: none;
      border: ${props =>
        `thin solid ${props.theme.palette.primary.contrastText}`};
    }
  }

  & .button-holder {
    display: flex;
    margin-top: 8px;

    & button {
      background-color: ${props => props.theme.palette.background.paper};
      color: ${props => props.theme.palette.secondary.main};
      margin-left: auto;
    }
  }
`

export const Header = styled.div`
  margin: 4px 0;

  .title {
    font-weight: bold;
    font-size: 1.25rem;
  }

  .subtitle {
    margin: 8px 0;
    font-size: 0.89rem;
  }
`
