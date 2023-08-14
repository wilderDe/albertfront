import {
  AppBar,
  DialogContent,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import { CustomDialog } from '../modales/CustomDialog'
import React, { useState } from 'react'
import ThemeSwitcherButton from '../botones/ThemeSwitcherButton'
import { IconoTooltip } from '../botones/IconoTooltip'
import { alpha } from '@mui/material/styles'
import Image from 'next/image'

export const NavbarLogin = () => {
  const [modalAyuda, setModalAyuda] = useState(false)
  const theme = useTheme()
  const abrirModalAyuda = () => {
    setModalAyuda(true)
  }
  const cerrarModalAyuda: any = () => {
    setModalAyuda(false)
  }

  return (
    <>
      <CustomDialog
        isOpen={modalAyuda}
        handleClose={cerrarModalAyuda}
        title={'Información'}
      >
        <DialogContent>
          <Typography variant={'body2'}>
            Propuesta de Frontend Base Login creado con NextJS y Typescript
          </Typography>
        </DialogContent>
      </CustomDialog>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: 70 }}>
          <Image src={'/logo.png'} alt="logo" width={90} height={70} />
          <Box>
            <IconoTooltip
              id={'ayudaLogin'}
              name={'Ayuda'}
              titulo={'Ayuda'}
              accion={() => {
                abrirModalAyuda()
              }}
              icono={'help_outline'}
            />
            <ThemeSwitcherButton />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}
