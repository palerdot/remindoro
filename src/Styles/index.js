import styled from 'styled-components'

export const colors = {
  $remindoro_color: '#FF3000',

  $theme_color: '#263238',
  $theme_shade_1: '#546e7a',
  $theme_shade_2: '#455a64',
  $theme_shade_3: '#37474f',
  $theme_shade_4: '#263238',

  // $theme_color: #282828;
  $text_color: 'white',
  // $border_color: #555;
  $border_color: '#455a64',
  // $input_highlight_color: #9e9e9e;
  $input_highlight_color: '#cfd8dc',

  // $bg_color: #282828;
  $bg_color: '#263238',
  // $bg_color: #3e2723;

  // $modal_bg: #424242;
  $modal_bg: '#263238',
  $modal_text_color: 'white',

  // $placeholder_color: #555;
  $placeholder_color: '#455a64',
}

export const ModalWrapper = styled.div`
  & .modal {
    background: transparent !important;

    i.left {
      margin-right: 5px;
    }

    label {
      i {
        font-size: 1.5em !important;
      }

      span {
        font-size: 1.3em !important;
        margin-left: 5px;
        vertical-align: text-bottom !important;
      }
    }

    &.bottom-sheet {
      height: auto;
      max-height: none !important;
      overflow: none;

      .modal-content {
        height: auto;
        max-height: 250px; // half the height
        overflow-y: auto;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }

    .modal-content,
    .modal-footer {
      background: ${colors.$modal_bg} !important;
      color: ${colors.$modal_text_color} !important;
    }

    .modal-footer {
      border-top: thin solid ${colors.$border_color} !important;
    }

    .form-group {
      border: thin solid ${colors.$border_color} !important;
      padding: 10px 5px;

      div.col {
        height: 3rem;
      }

      input {
        margin-bottom: none !important;
        color: #9e9e9e;
      }
    }

    .disabled {
      color: ${colors.$theme_shade_3} !important;
    }

    // classes to disable inside range field
    .range-field {
      :disabled {
        &::-webkit-slider-runnable-track {
          background: ${colors.$theme_shade_3} !important;
        }

        &::-webkit-slider-thumb {
          display: none;
        }
      }
    }

    // classes to disable inside flatpickr
    .flatpickr {
      :disabled {
        &::-webkit-input-placeholder {
          color: ${colors.$theme_shade_3} !important;
        }
      }

      // for the reminder state to be shown in disabled state
      .disabled {
        background: transparent !important;
        i {
          color: ${colors.$theme_shade_3} !important;
        }
      }
    }

    // repeat time info showing time before slider
    .repeat-time-info {
      font-size: 16px;
      margin-left: 10px;
      padding: 5px;
      border-radius: 50px;
      border: thin solid ${colors.$theme_shade_2};
    }
  }
`

export const NavigatorWrapper = styled.div`
  .navigator {
    height: 50px;
    overflow: none;

    // border-bottom: thin solid ${colors.$border_color};
    padding: 7px 0;
    margin-bottom: 0px !important;
    text-align: center;

    i {
      // font-size: 1.5em !important;
    }

    .btn {
      background: none;
      box-shadow: none;

      &.current {
        // background-color: rgba(255,0,0,0.75) !important;
        background-color: ${colors.$remindoro_color} !important;
      }
    }
  }

  .tabs {
    background: inherit;

    .tab {
      a {
        color: ${colors.$theme_color};
        &:hover {
          color: ${colors.$theme_color};
          opacity: 0.5;
        }
      }
    }
  }
`

export const RemindorosWrapper = styled.div`
  #remindoros {
    max-height: 475px;
    overflow-y: auto;
  }

  .remindoro {
    .remindoro-title {
      font-size: 1.59em;

      div[contenteditable] {
        padding: 3px;
        line-height: 1.5em;
        border-bottom: thin solid rgba(160, 160, 160, 0.2);

        &:focus {
          // border: thin solid rgba(160,160,160,0.2);
          border: thin solid ${colors.$input_highlight_color};
        }
      }
    }

    .remindoro-content {
      font-size: 1.19em;

      div[contenteditable] {
        max-height: 200px;
        overflow-y: auto;
        padding: 4px;
        line-height: 1.5em;

        &:focus {
          border: thin solid ${colors.$input_highlight_color};
        }
      }
    }
    .remindoro-footer {
      padding: 5px;
    }
  }
`
