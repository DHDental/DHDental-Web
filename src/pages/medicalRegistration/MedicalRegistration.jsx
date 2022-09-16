import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

const MedicalRegistration = () => {
    return (
        <Stack direction='column'>
            <Box>
                <Typography sx={{ fontWeight: 'bold' }}>
                    Đăng kí khám bệnh
                </Typography>
            </Box>

        </Stack>
    )
}

export default MedicalRegistration