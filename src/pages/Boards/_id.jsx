//Detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI,
  updateBoardDetailsAPI,
} from '~/apis'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
const Board = () => {
  const [board, setBoard] = useState()

  useEffect(() => {
    const boardId = '688640302be67424e728c66c'
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  const createNewColumn = async newColumnData => {
    const createdColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })
    console.log('createdColumn', createdColumn)
    //Cập nhật lại state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]
    setBoard(newBoard)
  }

  const createNewCard = async newCardData => {
    const createdCard = await createNewCardAPI({ ...newCardData, boardId: board._id })
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard)
    }
    setBoard(newBoard)
  }

  const moveColumns = async dndOrderedColumns => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    //API
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  return (
    <Container sx={{ height: '100vh' }} disableGutters maxWidth={false}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board
