import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const LoginSnackbar = ({ handleClose, open, text }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            autoHideDuration={2800}
        >
            <Alert severity="error" variant='filled'>{text}</Alert>
        </Snackbar>
    )
}

export default LoginSnackbar