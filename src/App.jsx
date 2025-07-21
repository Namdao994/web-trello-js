import { Button } from '@mui/material'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import Typography from '@mui/material/Typography'
const App = () => {
  return (
    <>
      <Typography variant="body2" color="text.secondary">
        Test Typography
      </Typography>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <AcUnitIcon />
    </>
  )
}

export default App
