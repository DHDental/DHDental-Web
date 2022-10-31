import { Alert, AlertTitle, Snackbar, Backdrop } from '@mui/material'

const SnackbarRecord = ({ handleClose, open, text, severity, variant, vertical, horizontal, title }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <Snackbar
                anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
                open={open}
                onClose={handleClose}
                autoHideDuration={8000}
            >

                <Alert severity={severity} variant={variant}>
                    {(title) ? (<AlertTitle>{title}</AlertTitle>) : null}
                    {text}</Alert>
            </Snackbar>
        </Backdrop>
    )
}

export default SnackbarRecord