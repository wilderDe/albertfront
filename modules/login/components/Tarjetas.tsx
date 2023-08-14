import { NextPage } from 'next'
import { Item } from '../types/evento'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'

const Tarjetas: NextPage<{ item: Item }> = ({ item }) => {
  return (
    <Card sx={{ maxWidth: 445 }}>
      <CardActionArea>
        <CardMedia image={item.imagenItem} sx={{ height: 240 }} />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h2">
            {item.tema}
          </Typography>
          <Box display="flex" gap={1}>
            <Typography fontSize={20} fontWeight={500}>
              Horario:
            </Typography>
            <Typography fontSize={20}>{item.horaInicio}</Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Typography fontSize={20} fontWeight={500}>
              Expositor:
            </Typography>
            <Typography fontSize={20}>{item.expositor}</Typography>
          </Box>
          <Typography variant="body1" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default Tarjetas
