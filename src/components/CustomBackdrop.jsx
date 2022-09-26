import { Backdrop, CircularProgress } from '@mui/material'

const CustomBackdrop = ({ open }) => {
    console.log(open);
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default CustomBackdrop