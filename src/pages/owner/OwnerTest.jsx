import React, { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Alert, Box, Snackbar } from "@mui/material";
import Tab from "@material-ui/core/Tab";
import RevenueTable from "./tables/RevenueTable";
import CheckUpTable from "./tables/CheckUpTable";
import ServiceTable from "./tables/ServiceTable";
import { axiosPrivate } from "../../api/axiosInstance";
import {
  COUNT_NUMBER_VISITED_BY_RANGE_TIME,
  GET_ALL_SERVICES,
  GET_ALL_TURN_OVER_RANGE_TIME,
  GET_USER_CANCEL_SERVICE,
  GET_USER_WITH_SERVICE,
} from "../../common/constants/apiConstants";
import moment from "moment/moment";
import { formatYearMonthDate } from "../../common/utils/formatDate";
import dayjs from "dayjs";
import UserServiceTable from "./tables/UserServiceTable";
import UserCancelServiceTable from "./tables/UserCancelServiceTable";

const service = [
  // {
  //   maDichVu: "123456",
  //   tenDichVu: "Trám Răng",
  //   chiPhi: "12200000",
  // },
];

const checkUp = [
  // {
  //   fullName: "Lại Nguyễn Tấn Tài",
  //   phoneNumber: "021312334",
  //   dob: "2000-02-02",
  //   address: "Bình Dương",
  //   dateRecord: "2000-03-03",
  // },
];

const revenue = [
  // {
  //   id: "158",
  //   date: "2022-11-11",
  //   money: "30,150,000",
  // },
];

const userWithService = [
  // {
  //   id: "158",
  //   date: "2022-11-11",
  //   money: "30,150,000",
  // },
];

const userCancelService = [
  // {
  //   id: "158",
  //   date: "2022-11-11",
  //   money: "30,150,000",
  // },
];

const OwnerTest = () => {
  const [serviceData, setServiceData] = useState(service);
  const [checkUpData, setCheckUpData] = useState(checkUp);
  const [revenueData, setRevenueData] = useState(revenue);
  const [userServiceData, setUserServiceData] = useState(userWithService);
  const [userCancelServiceData, setUserCancelServiceData] = useState(userCancelService);

  const [isloading, setIsLoading] = useState(false);

  const [value, setValue] = React.useState("1");

  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const current = new Date();
  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const datePast = formatYearMonthDate(dayjs(date, "YYYY-MM-DD").add(-1, 'days'));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    fetchData();
    fetchDataCheckUp();
    fetchDataRevenue();
    fetchDataUserService();
    fetchDataUserCancelService();
  };

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_SERVICES, params);
      const data = [...response.data];
      setServiceData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const fetchDataCheckUp = async () => {
    // console.log(date);
    setIsLoading(true);
    const params = {
      from: date,
      to: datePast,
    };
    // console.log(params);
    try {
      const response = await axiosPrivate.post(
        COUNT_NUMBER_VISITED_BY_RANGE_TIME,
        params
      );
      const data = [...response.data];
      setCheckUpData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const fetchDataUserService = async () => {
    setIsLoading(true);
    const params = {
      date: date,
    };
    try {
      const response = await axiosPrivate.post(
        GET_USER_WITH_SERVICE,
        params
      );
      const data = [...response.data];
      setUserServiceData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const fetchDataRevenue = async () => {
    setIsLoading(true);
    const params = {
      from: datePast,
      to: date,
    };
    // console.log(params);
    try {
      const response = await axiosPrivate.post(
        GET_ALL_TURN_OVER_RANGE_TIME,
        params
      );
      const data = [...response.data];
      setRevenueData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const fetchDataUserCancelService = async () => {
    setIsLoading(true);
    const params = {
      date: date,
    };
    try {
      const response = await axiosPrivate.post(
        GET_USER_CANCEL_SERVICE,
        params
      );
      const data = [...response.data];
      setUserCancelServiceData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Quản Lý Dịch Vụ" value="1" />
            <Tab label="Quản Lý Lượng Người Tới Khám" value="2" />
            <Tab label="Quản Lý Doanh Thu" value="3" />
            <Tab label="Quản Lý Lượng Người Dùng Dịch Vụ" value="4" />
            <Tab label="Quản Lý Lượng Người Hủy Dịch Vụ" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ServiceTable serviceData={serviceData} loading={isloading} />
        </TabPanel>
        <TabPanel value="2">
          <CheckUpTable checkUpData={checkUpData} loading={isloading} />
        </TabPanel>
        <TabPanel value="3">
          <RevenueTable revenueData={revenueData} loading={isloading} />
        </TabPanel>
        <TabPanel value="4">
          <UserServiceTable userServiceData={userServiceData} loading={isloading} />
        </TabPanel>
        <TabPanel value="5">
          <UserCancelServiceTable userCancelServiceData={userCancelServiceData} loading={isloading} />
        </TabPanel>
      </TabContext>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="outlined" severity="error" sx={{ width: "100%" }}>
          {textSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OwnerTest;
