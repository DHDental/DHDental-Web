import { Alert, Snackbar } from '@mui/material'

const CustomSnackbar = ({ handleClose, open, text, severity, variant, vertical, horizontal }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
            open={open}
            onClose={handleClose}
            autoHideDuration={4000}
        >
            <Alert severity={severity} variant={variant}>{text}</Alert>
        </Snackbar>
    )
}

export default CustomSnackbar