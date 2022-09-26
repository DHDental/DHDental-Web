import { IconButton } from '@mui/material';
import { push, ref, set } from "firebase/database";
import React, { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';

import { axiosPublic } from '../../api/axiosInstance';
import { BOOKING_CHECKIN } from '../../common/constants/apiConstants';
import CustomDialog from '../../components/CustomDialog';
import StartFirebase from '../../components/firebaseConfig';
import { CustomBackdrop, CustomSnackbar } from '../../components';

const db = StartFirebase()

const AppointmentIcon = ({ user }) => {
    const [click, setClick] = useState(0)
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [textSnackbar, setTextSnackbar] = useState('');
    const [name, setName] = useState()
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
        // setName()
    };
    const handleYes = () => {
        setOpen(false);
        // setName()
        handleCheck(user?.idBooking)
    }
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    const handleCheck = async (id) => {
        try {
            setOpenBackdrop(true)
            const response = await axiosPublic.post(BOOKING_CHECKIN, {
                "id": id,
                "status": 'Done'
            })
            setClick(1)
            setOpenBackdrop(false)
            setTextSnackbar('Check in thành công')
            setOpenSnackbar(true)
            // fetchUserBookingList() 
            const dbRef = ref(db)
            const newUser = push(dbRef)
            set(newUser, {
                fullName: user.lastName + ' ' + user.middleName + ' ' + user.firstName,
                sdt: user.phoneNumber,
                status: 0,
                statusSpecial: 1,
                timeBooking: user.slotBooking,
                doctor: ''
            })
        } catch (error) {
            setOpenBackdrop(false)
        }
    }
    return (
        <>
            <IconButton onClick={() => {
                if (!(user?.status === 'Cancel' || user?.status === 'Done')) {
                    if (click === 0) {
                        setName(user.lastName + ' ' + user.middleName + ' ' + user.firstName)
                        setOpen(true)
                        // handleCheck(user?.idBooking)
                    }
                }
            }} >
                {user?.status === 'Cancel' ? <MdOutlineCancel color='red' /> :
                    <BiCheckCircle
                        color={
                            click === 1 ? '#04b205' :
                                user?.status === 'Done' ? '#04b205' :
                                    '#4036364d'
                        }
                        size='22px' />}
            </IconButton>
            <CustomDialog open={open} handleClose={handleClose} handleYes={handleYes}
                text={`Bạn chắc chắn muốn check in cho bệnh nhân ${name}`} />
            <CustomBackdrop open={openBackdrop} />
            <CustomSnackbar handleClose={handleCloseSnackbar}
                open={openSnackbar}
                text={textSnackbar}
                severity='success'
                variant='standard'
                vertical='top'
                horizontal='right' />
        </>
    )
}

export default AppointmentIcon
