import { Button, DialogActions } from '@mui/material'

export interface ModalLoginType {
  accionCorrecta: () => void
}

export const ModalDeRegistrarse = ({
  accionCorrecta,
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
      <Button onClick={accionCorrecta} variant={'contained'} type={'submit'}>
        Ok
      </Button>
    </DialogActions>
  )
}

export default ModalDeRegistrarse
