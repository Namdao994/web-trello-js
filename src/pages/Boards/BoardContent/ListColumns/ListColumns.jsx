import Box from '@mui/material/Box'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

const ListColumns = ({ columns }) => {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please Enter column title')
      return
    }
    //API...
    const newColumnData = {
      title: newColumnTitle,
    }

    const createdColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })
    //Cập nhật lại state board
    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]
    /**
     * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spred operator là Shallow copy/ Clone, nên dính rule Immuatability trong Redux toolkit khoong dùng được hàm Push(sửa giá trị trực tiếp), cách đơn giản nhanh gọn nhất là ở trường hợp này của chúng ta là dùng tới Deep clone/copy toàn bộ cái Board cho dễ hiểu và code ngắn gọn
     */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    /**
     * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như dóc của Redux tookit ở trên vì push như đã nói nó sẽ thay đổi giá trị mảng trược tipees, còng thằng conacat thì nó merge - ghép mảng lại và tạo ra một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì
     */
    // const newBoard = {...board}
    // newBoard.columns = newBoard.columns.concat([createdColumn]);
    // newBoard.columnsOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])

    dispatch(updateCurrentActiveBoard(newBoard))

    toggleOpenNewColumnForm(false)
    setNewColumnTitle('')
  }

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2,
          },
        }}
      >
        {columns?.map(column => (
          <Column key={column._id} column={column} />
        ))}

        {/* Button Add new Column */}
        {!openNewColumnForm ? (
          <Box
            sx={{
              minWidth: '200px',
              maxWidth: '200px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 2.5, py: 1 }}
              onClick={toggleOpenNewColumnForm}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <TextField
              label="Enter column title"
              type="text"
              size="small"
              variant="outlined"
              value={newColumnTitle}
              autoFocus
              onChange={e => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': {
                  color: 'white',
                },
                '& input': {
                  color: 'white',
                },
                '& label.Mui-focused': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
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
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: theme => theme.palette.warning.light },
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
