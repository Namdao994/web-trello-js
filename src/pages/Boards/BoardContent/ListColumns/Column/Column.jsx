import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useState } from 'react'
import Cloud from '@mui/icons-material/Cloud'
import ContentCut from '@mui/icons-material/ContentCut'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ListCards from './ListCards/ListCards'
import Box from '@mui/material/Box'
import { useSortable } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
const Column = ({ column, createNewCard, deleteColumnDetails }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column },
  })

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title', { position: 'bottom-right' })
      return
    }
    //API...
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    }
    //...
    createNewCard(newCardData)

    toggleOpenNewCardForm(false)
    setNewCardTitle('')
  }
  // xử lí xóa nhiều column
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = async () => {
    try {
      await confirmDeleteColumn({
        title: 'Delete Column?',
        description: 'This action will permanently delete your Column adn its Cards! Are you sure?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel',
      })
      deleteColumnDetails(column._id)
    } catch (error) {}
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: theme => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: theme => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Box column header */}
        <Box
          sx={{
            height: theme => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCardIcon fontSize="small" className="add-card-icon" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' },
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" className="delete-forever-icon" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <ListCards cards={orderedCards} />

        {/* Box column Footer */}
        <Box
          sx={{
            height: theme => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <TextField
                label="Enter card title"
                type="text"
                size="small"
                variant="outlined"
                data-no-dnd="true"
                value={newCardTitle}
                autoFocus
                onChange={e => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': {
                    color: 'text.primary',
                  },
                  '& input': {
                    color: theme => theme.palette.primary.main,
                    bgcolor: theme => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                  },
                  '& label.Mui-focused': {
                    color: theme => theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme => theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                      borderColor: theme => theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme => theme.palette.primary.main,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1,
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} data-no-dnd="true">
                <Button
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: theme => theme.palette.success.main,
                    '&:hover': { bgcolor: theme => theme.palette.success.main },
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: theme => theme.palette.warning.light,
                    cursor: 'pointer',
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
