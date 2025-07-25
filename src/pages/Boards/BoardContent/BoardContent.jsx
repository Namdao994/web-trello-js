import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
const BoardContent = ({ board }) => {
  const [orderedColumns, setOrderedColumns] = useState([])
  //Yêu cầu chuột di chuyển 10px để kích hoạt sự kiện
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //Yêu cầu chạm hơn 250 ms và dung sai cảm ứng (tolerance)
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  })

  //ưu tiên sử dụng hai loại mouse và touch để cho mobile tốt nhất
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragEnd = event => {
    console.log('handleDragEnd >>>>', event)
    const { active, over } = event
    // trường hợp kéo ra ngoài vùng
    if (!over) return

    if (active.id !== over.id) {
      //lấy vị trí cũ từ active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      //lấy vị trí mới từ over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      //gọi api
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumns(dndOrderedColumns)
    }
  }

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: theme => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          display: 'flex',
          height: theme => theme.trello.boardContentHeight,
          p: '10px 0',
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
