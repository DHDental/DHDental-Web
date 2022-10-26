import styled from "styled-components"

import Sidebar from "./Sidebar"
import Navbar from './Navbar'
import { Outlet } from "react-router-dom"

const Container = styled.div`
    display: flex;
`
const Main = styled.div`
flex: 5.2;
background-color: #f9f9f9;
`
const Wrapper = styled.div`
padding: 22px 40px;
/* padding-top: 22px; */
`

const OwnerLayout = () => {
    return (
        <Container>
            <Sidebar />
            <Main>
                <Navbar />
                <Wrapper>
                    <Outlet />
                </Wrapper>
            </Main>
        </Container>
    )
}

export default OwnerLayout