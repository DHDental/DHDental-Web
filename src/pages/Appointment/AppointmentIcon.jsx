import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { MdOutlineCancel } from 'react-icons/md'

import { axiosPublic } from '../../api/axiosInstance';
import { BOOKING_CHECKIN } from '../../common/constants/apiConstants';

const AppointmentIcon = ({ user }) => {
    const [click, setClick] = useState(0)

    // const [status, setStatus] = useState(user?.status)

    const handleCheck = async (id) => {
        try {
            const response = await axiosPublic.post(BOOKING_CHECKIN, {
                "id": id,
                "status": 'Done'
            })

            // fetchUserBookingList()
        } catch (error) {

        }
    }
    return (
        <IconButton onClick={() => {
            if (!(user?.status === 'Cancel' || user?.status === 'Done')) {
                setClick(1)
                // setStatus("Done")
                handleCheck(user?.idBooking)
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