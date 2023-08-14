import { Button, DialogActions } from '@mui/material'

export interface ModalLoginType {
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const ModalConfirmar = ({
  accionCorrecta,
  accionCancelar,
}: ModalLoginType) => {
  return (
    <DialogActions
      sx={{
        my: 1,
        mx: 2,
        justifyContent: {
          lg: 'flex-end',
          md: 'flex-end',
          xs: 'center',
          sm: 'center',
        },
      }}
    >
      <Button variant={'outlined'} onClick={accionCancelar}>
        Cancelar
      </Button>
      <Button onClick={accionCorrecta} variant={'contained'} type={'submit'}>
        Confirmar
      </Button>
    </DialogActions>
  )
}

export default ModalConfirmar
