import { Grid } from '@mui/material'

const TestDemo = () => {
    return (
        <>
            <Grid container direction={'row'} spacing={2}>
                <Grid item xs={5}>
                    <div>Test 1 đặt lịch</div>
                </Grid>
                <Grid item xs={5}>
                    <div>Kết quả</div>
                </Grid>
            </Grid>
        </>
    )
}

export default TestDemo