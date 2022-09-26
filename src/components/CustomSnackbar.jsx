import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const CustomSnackbar = ({ handleClose, open, text, severity, variant, vertical, horizontal }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
            open={open}
            onClose={handleClose}
            autoHideDuration={2000}
        >
            <Alert severity={severity} variant={variant}>{text}</Alert>
        </Snackbar>
    )
}

export default CustomSnackbar