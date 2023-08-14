import { NextPage } from 'next'
import { EventoResponse } from '../types/evento'
import { Box, Button, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { CustomDialog } from '../../../common/components/ui'
import ModalDeRegistrarse from './ModalDeRegistrarse'

const Portada: NextPage<{ evento: EventoResponse }> = ({ evento }) => {
  const [modalDeRegistro, setModalDeRegistro] = useState(false)

  const cerrarModal = () => {
    setModalDeRegistro(false)
  }
  const abrirModal = () => {
    setModalDeRegistro(true)
  }

  return (
    <Grid
      container
      marginTop={10}
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        borderRadius: '10px',
      }}
    >
      <CustomDialog
        title="Para participar debe registrarse"
        isOpen={modalDeRegistro}
        handleClose={cerrarModal}
      >
        <ModalDeRegistrarse
          accionCorrecta={() => {
            cerrarModal()
          }}
        />
      </CustomDialog>
      <Grid
        item
        xl={6}
        md={5}
        xs={12}
        paddingLeft={10}
        paddingRight={10}
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h2" fontWeight={500} marginBottom={2}>
          {evento.nombre}
        </Typography>
        <Box display="flex" marginBottom={1}>
          <Typography fontSize={22} marginRight={3}>
            Modalidad del evento:
          </Typography>
          <Typography fontSize={20} color="gray">
            {evento.modalidad}
          </Typography>
        </Box>
        <Box display="flex" marginBottom={1}>
          <Typography fontSize={22} marginRight={3}>
            Fecha del evento:
          </Typography>
          <Typography fontSize={20} color="gray">
            {evento.fechaEvento}
          </Typography>
        </Box>
        <Box display="flex" marginBottom={1}>
          <Typography fontSize={22} marginRight={3}>
            Ubicación del evento:
          </Typography>
          <Typography fontSize={20} color="gray">
            {evento.ubicacion}
          </Typography>
        </Box>
        <Box display="flex" marginBottom={1}>
          <Typography fontSize={22} marginRight={3}>
            Personas que asistiran:
          </Typography>
          <Typography fontSize={20} color="gray">
            {evento.participantes.length}
          </Typography>
        </Box>
        <Typography fontSize={20} color={'gray'} marginBottom={2}>
          {evento.descripcion}
        </Typography>
        <Box>
          <Button onClick={abrirModal} variant="outlined" color="primary" sx={{ fontSize: 22 }}>
            Asistir
          </Button>
        </Box>
      </Grid>
      <Grid item xl={6} md={6} xs={12}>
        <Image
          alt="100"
          width={800}
          height={500}
          src={evento.imagenEvento}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '10px',
          }}
        />
      </Grid>
    </Grid>
  )
}

export default Portada
