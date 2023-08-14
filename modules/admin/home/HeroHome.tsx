import { Box, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useAuth } from '../../../context/auth'
import { titleCase } from '../../../common/utils'

const HeroHome: NextPage = () => {
  const { usuario, rolUsuario } = useAuth()
  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        backgroundImage: 'url("/hero1.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        width: '100%',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      }}
    >
      <Box
        sx={{
          background: '#ffffff98',
          padding: 5,
          borderRadius: 5,
          width: '50%',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          fontWeight="600"
          textAlign="center"
          fontFamily="sans-serif"
        >
          Bienvenid@ {titleCase(usuario?.persona?.nombres ?? '')}{' '}
          {titleCase(
            usuario?.persona?.primerApellido ??
              usuario?.persona?.segundoApellido ??
              ''
          )}
        </Typography>
        <Typography
          textAlign="center"
          variant="h6"
          component="p"
          fontFamily="sans-serif"
        >
          SISTEMA GESTIÓN DE EVENTOS
        </Typography>
        <Box
          textAlign="center"
          marginTop={2}
          gap={2}
          display="flex"
          justifyContent="center"
        ></Box>
      </Box>
    </Box>
  )
}

export default HeroHome
