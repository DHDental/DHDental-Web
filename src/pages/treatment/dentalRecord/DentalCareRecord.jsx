import { Button, Grid, TextField } from '@mui/material'
import { useState } from 'react'

import ServiceBill from './ServiceBill'
import CreateRecord from './CreateRecord'
import PatientInfoDR from './PatientInfoDR'


const DentalCareRecord = () => {
    // const [open, setOpen] = useState(false)
    // const [nhap, setNhap] = useState()
    return (
        <>
            <Grid container direction='column' spacing={2}>
                <Grid container item>
                    <PatientInfoDR />
                    {/* <Button onClick={() => (
                        setOpen(!open)
                    )}>Click here</Button> */}
                </Grid>
                {/* {open &&
                    <Grid item>
                        <TextField
                            value={nhap}
                            onChange={(e) => (
                                setNhap(e.target.value)
                            )}
                        />
                        {nhap}
                    </Grid>
                } */}
                <Grid container item>
                    <ServiceBill />
                </Grid>
                <Grid container item>
                    <CreateRecord />
                </Grid>
            </Grid>
        </>
    )
}

export default DentalCareRecord