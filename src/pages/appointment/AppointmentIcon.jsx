import { IconButton } from '@mui/material';
import { push, ref, set } from "firebase/database";
import React, { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';

import { axiosPublic } from '../../api/axiosInstance';
import { BOOKING_CHECKIN } from '../../common/constants/apiConstants';
import StartFirebase from '../../components/firebaseConfig';

const db = StartFirebase()

const AppointmentIcon = ({ user }) => {
    const [click, setClick] = useState(0)

    const handleCheck = async (id) => {
        try {
            const response = await axiosPublic.post(BOOKING_CHECKIN, {
                "id": id,
                "status": 'Done'
            })
            // fetchUserBookingList() 
            const dbRef = ref(db)
            const newUser = push(dbRef)
            set(newUser, {
                fullName: user.lastName + ' ' + user.middleName + ' ' + user.firstName,
                sdt: user.phoneNumber,
                status: -1,
                doctor: ''
            })
        } catch (error) {

        }
    }
    return (
        <IconButton onClick={() => {
            if (!(user?.status === 'Cancel' || user?.status === 'Done')) {
                if (click === 0) {
                    setClick(1)
                    handleCheck(user?.idBooking)
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
    )
}

export default AppointmentIcon
