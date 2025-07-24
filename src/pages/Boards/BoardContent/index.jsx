import Box from '@mui/material/Box'
import React from 'react'

const BoardContent = () => {
  return (
    <Box
      sx={{
        bgcolor: theme => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        display: 'flex',
        height: theme =>
          `calc(100vh - ${theme.trello.boardBarHeight} - ${theme.trello.appBarHeight})`,
        alignItems: 'center',
      }}
    >
      Board Content
    </Box>
  )
}

export default BoardContent
