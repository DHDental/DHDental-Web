import styled from "styled-components"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import Tippy from '@tippyjs/react/headless'
import classNames from "classnames/bind"
import jwtDecode from "jwt-decode";

import styles from '../../../style/SearchTippy.module.scss'
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../../api/axiosInstance";
import { LOGOUT } from "../../../common/constants/apiConstants";
import CustomBackdrop from "../../CustomBackdrop";

const cx = classNames.bind(styles)

const Container = styled.div`
position: sticky;
top: 0;
/* background-color:#2ccad8; */
/* background-color:#8fc9ff94; */
background-color:white;
height: 56px;
z-index: 1;
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
    // const navigate = useNavigate();
    // const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    // const user = jwtDecode(loginInfo?.token)
    // const roleID = user?.roleID[0].authority
    // const [openBackdrop, setOpenBackdrop] = useState(false)
    // const handleLogout = async () => {
    //     try {
    //         setOpenBackdrop(true)
    //         const response = await axiosPrivate.post(LOGOUT, {
    //             "key": user?.PhoneNumber
    //         })
    //         setOpenBackdrop(false)
    //         localStorage.clear();
    //         console.clear();
    //         navigate('/login');
    //     } catch (error) {
    //         console.log(error);
    //         alert('Có lỗi xảy ra, vui lòng thao tác lại')
    //     }
    // }
    return (
        <>
            <Container>
                <Wrapper>
                    <Tippy
                        render={attrs => (
                            <div className={cx('resultLogoutBox')} tabIndex="-1" {...attrs}>
                                <div className={cx('resultLogoutItem')}>
                                    <Typography>Demo</Typography>
                                </div>
                                {/* <div className={cx('resultLogoutItem')}>
                                    <Typography>{`Phòng số ${user?.DentistRoom}`}</Typography>
                                </div>
                                <div className={cx('resultLogoutItem')}
                                    onClick={handleLogout}
                                    style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                                >
                                    <LogoutIcon />
                                    Đăng xuất
                                </div> */}
                            </div>
                        )}
                        placement='bottom-start'
                        interactive={true}
                    >
                        <Button>
                            <AccountCircleOutlinedIcon />
                            {/* {roleID == '3' ? 'Nha sĩ' :
                                roleID == '2' ? 'Nhân viên' :
                                    roleID == '1' ? 'Admin' :
                                        'Chủ nha khoa'
                            } */}
                        </Button>
                    </Tippy>
                </Wrapper>

            </Container>
            {/* <CustomBackdrop open={openBackdrop} /> */}
        </>
    )
}

export default Navbar