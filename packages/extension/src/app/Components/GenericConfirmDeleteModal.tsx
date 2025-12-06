import { styled } from '@mui/material/styles'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

const PREFIX = 'ConfirmDelete'

const classes = {
  paper: `${PREFIX}-paper`,
  deleteButton: `${PREFIX}-deleteButton`,
  cancelButton: `${PREFIX}-cancelButton`,
}

const StyledDialog = styled('div')(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,

  '& .delete-dialog-description p': {
    color: theme.palette.text.primary,
  },

  '& .action-holder': {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 16px',
  },

  [`& .${classes.deleteButton}`]: {
    margin: theme.spacing(0),
    background: theme.palette.error.main,
    color: theme.palette.text.primary,

    '&:hover': {
      opacity: 0.89,
    },
  },

  [`& .${classes.cancelButton}`]: {
    margin: theme.spacing(0),

    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderColor: theme.palette.grey.A100,

    '&:hover': {
      opacity: 0.89,
    },
  },
}))

type Props = {
  isOpen: boolean

  closeModal: () => void
  onDelete: () => void

  title: string
  description: string
  deleteButtonText: string
}

function ConfirmDelete({
  isOpen,
  closeModal,
  onDelete,
  title,
  description,
  deleteButtonText,
}: Props) {
  return (
    <Dialog
      className={'delete-dialog'}
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <StyledDialog className={classes.paper}>
        <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
        <DialogContent className={'delete-dialog-description'}>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={'action-holder'}>
          <Button
            variant="contained"
            className={classes.deleteButton}
            startIcon={<DeleteIcon />}
            onClick={() => {
              onDelete()
            }}
          >
            {deleteButtonText}
          </Button>

          <Button onClick={closeModal} className={classes.cancelButton}>
            Cancel
          </Button>
        </DialogActions>
      </StyledDialog>
    </Dialog>
  )
}

export default ConfirmDelete
