import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const CustomDialog = ({ open, handleClose, text, handleYes }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
        >
            <DialogContent>
                <DialogContentText sx={{ color: '#000' }}>
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Không</Button>
                <Button onClick={handleYes} autoFocus >
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default CustomDialog