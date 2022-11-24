import React, { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
} from "@mui/material";
import Tab from "@material-ui/core/Tab";
import RevenueTable from "./tables/RevenueTable";
import CheckUpTable from "./tables/CheckUpTable";
import ServiceTable from "./tables/ServiceTable";
import { axiosPrivate } from "../../api/axiosInstance";
import { GET_ALL_SERVICES } from "../../common/constants/apiConstants";

const service = [
  {
    maDichVu: "123456",
    tenDichVu: "Trám Răng",
    chiPhi: "12200000",
  },
];

const checkUp = [
  {
    fullName: "Lại Nguyễn Tấn Tài",
    phoneNumber: "021312334",
    dob: "2000-02-02",
    address: "Bình Dương",
    dateRecord: "2000-03-03",
  },
];



const OwnerTest = () => {
  const [serviceData, setServiceData] = useState(service);
  const [checkUpData, setCheckUpeData] = useState(checkUp);
  // const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState("1");

  useEffect(() => {
    // setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    // setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_SERVICES, params);
    // console.log(response);
    const data = [...response.data];
    setServiceData(data);
    // setLoading(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Quản Lý Dịch Vụ" value="1" />
            <Tab label="Quản Lý Lượng Người Tới Khám" value="2" />
            <Tab label="Quản Lý Doanh Thu" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ServiceTable serviceData={serviceData}/>
        </TabPanel>
        <TabPanel value="2">
          <CheckUpTable/>
        </TabPanel>
        <TabPanel value="3">
          <RevenueTable/>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default OwnerTest;
