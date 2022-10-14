import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export const TaoHoaDonPopUp = ({ open, handleClose, handleYes }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
        >
            <DialogContent>
                <DialogContentText sx={{ color: '#000' }}>
                    Bạn chắc chắc muốn tạo chỉ định công tác điều trị các dịch vụ trong danh sách
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
