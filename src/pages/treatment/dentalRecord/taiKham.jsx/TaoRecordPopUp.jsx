import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export const TaoRecordPopUp = ({ open, handleClose, handleYes }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
        >
            <DialogContent>
                <DialogContentText sx={{ color: '#000' }}>
                    Bạn chắc chắc muốn lưu dental care record và kết thúc quá trình khám
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleYes} autoFocus >
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog >
    )
}
