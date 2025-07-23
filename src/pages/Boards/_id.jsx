//Detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BoardBar from './BoardBar'
import BoardContent from './BoardContent'

const Board = () => {
  return (
    <Container
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
      disableGutters
      maxWidth={false}
    >
      <AppBar />
      <BoardBar />
      <BoardContent />
    </Container>
  )
}

export default Board
