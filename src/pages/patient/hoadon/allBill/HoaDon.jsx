import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { axiosPrivate } from '../../../../api/axiosInstance'
import { STAFF_BILL } from '../../../../common/constants/pathConstants'
import { CustomBackdrop, CustomSnackbar } from '../../../../components'

import BillDetail from './BillDetail'



const HoaDon = () => {
    const param = useParams()

    const [bill, setBill] = useState()
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [reload, setReload] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState();
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');



    useEffect(() => {
        // console.log('load');
        let isMounted = true;
        const getBill = async () => {
            try {
                setOpenBackdrop(true)
                const response = await axiosPrivate.post(STAFF_BILL, {
                    "phoneNumber": param.id,
                    "type": "M"
                })
                isMounted && setBill(response.data)
                setOpenBackdrop(false)
            } catch (error) {
                setOpenBackdrop(false)
                console.log(error);
            }
        }
        getBill()
        return () => {
            isMounted = false;
        }
    }, [reload])
    return (
        <>
            <Grid container spacing={1} direction='column'>
                {
                    bill?.map((item, i) => (
                        <BillDetail
                            key={i}
                            item={item}

                            setReload={setReload}
                            reload={reload}
                            setTextSnackbar={setTextSnackbar}
                            setSeverity={setSeverity}
                            setOpenSnackbar={setOpenSnackbar}
                            setOpenBackdrop={setOpenBackdrop}
                        />
                    ))
                }
                {bill?.length === 0 &&
                    <Grid item>
                        Không có hóa đơn
                    </Grid>
                }
            </Grid>
            <CustomBackdrop open={openBackdrop} />
            <CustomSnackbar handleClose={() => {
                setOpenSnackbar(false)
            }}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right'
            />
        </>
    )
}

export default HoaDon