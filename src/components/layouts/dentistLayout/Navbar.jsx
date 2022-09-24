import styled from "styled-components"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useState } from "react";
import { useEffect } from "react";

const Container = styled.div`
position: sticky;
top: 0;
/* background-color:#2ccad8; */
/* background-color:#8fc9ff94; */
background-color:white;
height: 56px;
`
const Wrapper = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
height: 100%;
padding: 0px 20px;
`
const Button = styled.button`
/* margin-right: 30px; */
padding: 5px 15px;
background-color: transparent;
border: none;
/* color: #1c38c3; */
color: #1313c8;
/* border: 1px solid #3ea6ff; */
/* border-radius: 3px; */
/* font-weight: 500; */
/* font-size: 14px; */
display: flex;
align-items: center;
gap: 5px;
`

const Navbar = () => {
    const [role, setRole] = useState()
    useEffect(() => {
        setRole(localStorage.getItem('role'))
    }, [])

    return (
        <Container>
            <Wrapper>
                <Button>
                    <AccountCircleOutlinedIcon />
                    {role === 'staff' ? 'Nhân viên' : null}
                </Button>
            </Wrapper>
        </Container>
    )
}

export default Navbar