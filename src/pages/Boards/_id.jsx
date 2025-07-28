//Detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
const Board = () => {
  const [board, setBoard] = useState()

  useEffect(() => {
    const boardId = '688640302be67424e728c66c'
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <Container sx={{ height: '100vh' }} disableGutters maxWidth={false}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
