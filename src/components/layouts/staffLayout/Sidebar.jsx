import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import EventNoteIcon from '@mui/icons-material/EventNote';
import PortraitIcon from '@mui/icons-material/Portrait';
import ArticleIcon from '@mui/icons-material/Article';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';
import NhaKhoaLogo from '../../../assets/images/logo.png';

import { STAFF_BENHNHAN, STAFF_DSDATKHAM, STAFF_DS_CHO_KHAM } from '../../../common/constants/pathConstants';
import { sideBarStaffConfig } from '../../../common/constants/sidebarConfig'

const Container = styled.div`
    flex:1;
    background-color: white;
    height:100vh;
    color: black;
    font-size: 14px;
    position:sticky;
    top: 0;
    overflow-y: auto;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-corner{
        background: transparent; 
    }
    ::-webkit-scrollbar-track {
        background: transparent; 
    }
    ::-webkit-scrollbar-thumb {
        background:  transparent;
    }
    :hover::-webkit-scrollbar-thumb {
        background: #4A4A4A; 
    }
`
const Wrapper = styled.div`
padding:18px 0px;
`

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    margin-bottom: 25px;
    margin-left: 30px;
    padding-left: 30px;
    font-size: larger;
    color:#1313c8;  
`
const Img = styled.img`
 height:25px;
 background-color: #399af592;
`

const Item = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    padding: 7.5px 26px;
    &:hover{
        background-color: #f5f5f5;
    }
`
const Sidebar = () => {
    return (
        <Container>
            <Wrapper>
                <Link to={STAFF_DSDATKHAM}>
                    <Logo>
                        Nha Khoa Đức Hạnh
                    </Logo>
                </Link>
                {sideBarStaffConfig.map((item, i) => (
                    <NavLink to={item.path}>
                        <Item>
                            {item.icon}
                            {item.name}
                        </Item>
                    </NavLink>
                ))}
                {/* <NavLink to={STAFF_DSDATKHAM}>
                    <Item>
                        <EventNoteIcon />
                        Danh sách đặt khám
                    </Item>
                </NavLink>
                <NavLink to={STAFF_BENHNHAN}>
                    <Item>
                        <PortraitIcon />
                        Bệnh nhân
                    </Item>
                </NavLink>
                <NavLink to={STAFF_DS_CHO_KHAM}>
                    <Item>
                        <AppsOutageIcon />
                        Danh sách chờ khám
                    </Item>
                </NavLink> */}
            </Wrapper>
        </Container >
    )
}

export default Sidebar