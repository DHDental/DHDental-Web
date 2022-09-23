import { Box } from '@mui/material'

import image from '../../assets/images/login_bg.png'
import LoginForm from './LoginForm'

const Login = () => {
    return (
        <>
            <Box sx={{
                backgroundImage: `url(${image})`,
                height: '100vh',
            }}>
                <Box sx={{ height: '18%' }}></Box>
                <LoginForm />
            </Box>
        </>
    )
}

export default Login