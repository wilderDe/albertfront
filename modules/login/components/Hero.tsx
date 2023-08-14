import { Box, Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { CustomDialog } from '../../../common/components/ui'
import ModalLogin from './ModalLogin'
import { useState } from 'react'
import ModalRegistro from './ModalRegistro'
import { motion } from 'framer-motion'
import { container } from '../../../common/utils/framerMotion'

const Hero: NextPage = () => {
  const [modalLogin, setModalLogin] = useState(false)
  const [modalRegistro, setModalRegistro] = useState(false)

  //Comenzar con el registro de Personas
  //Los roles usuarios no podran entrar al admin
  //los roles usuarios solo tendran un toolvar de ver perfil y quizas ver eventos que participaron

  const cerrarModalLogin = async () => {
    setModalLogin(false)
  }

  const abrirModalLogin = async () => {
    setModalLogin(true)
  }

  const cerrarModalRegistro = async () => {
    setModalRegistro(false)
  }

  const abrirModalRegistro = async () => {
    setModalRegistro(true)
  }

  return (
    <Box
      sx={{
        marginTop: 1,
        backgroundImage: 'url("/hero1.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        width: '100%',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CustomDialog
        title="Ingreso"
        isOpen={modalLogin}
        handleClose={cerrarModalLogin}
      >
        <ModalLogin
          accionCancelar={cerrarModalLogin}
          accionCorrecta={() => {
            cerrarModalLogin().finally()
          }}
        />
      </CustomDialog>
      <CustomDialog
        title="Registro"
        isOpen={modalRegistro}
        handleClose={cerrarModalRegistro}
      >
        <ModalRegistro
          accionCancelar={cerrarModalRegistro}
          accionCorrecta={() => {
            cerrarModalRegistro().finally()
          }}
        />
      </CustomDialog>
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
          SISTEMA GESTIÓN DE EVENTOS
        </Typography>
        <Typography
          textAlign="center"
          variant="h6"
          component="p"
          fontFamily="sans-serif"
        >
          El reto de realizar un sistema de gestión de eventos donde los
          usuarios pueden visualizar eventos proximos y ser participes.
        </Typography>
        <Box
          textAlign="center"
          marginTop={2}
          gap={2}
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={abrirModalRegistro}
          >
            <Typography variant="h6" component="p" fontFamily="sans-serif">
              Registrate
            </Typography>
          </Button>
          <Button variant="outlined" color="info" onClick={abrirModalLogin}>
            <Typography variant="h6" component="p" fontFamily="sans-serif">
              Ingresar
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Hero
