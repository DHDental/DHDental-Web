import {
  Box,
} from "@mui/material";
import Tab from "@material-ui/core/Tab";
import React, { useState } from "react";
import { useEffect } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import {
  GET_ALL_USER_ADMIN,
} from "../../common/constants/apiConstants";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import StaffTable from "./tables/StaffTable";
import EndUserTable from "./tables/EndUserTable";

const user = [
];

const TestAdmin = () => {
  const [value, setValue] = React.useState("1");
  const [staff, setStaff] = useState(user);
  const [endUser, setEndUser] = useState(user);
  const [loading, setLoading] = useState(false);
  // const [open, setOpen] = React.useState(false);
  // const [updateRow, setUpdateRow] = React.useState(null);
  // const [oldRow, setOldRow] = React.useState(null);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const staff = data.filter((data) => {
      return data.roleName !== "End User";
    });
    const endUser = data.filter((data) => {
      return data.roleName === "End User";
    });
    setStaff(staff);
    setEndUser(endUser);
    setLoading(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Quản Lý Nhân Sự" value="1" />
            <Tab label="Quản Lý Người Dùng" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <StaffTable loading={loading} staff={staff}/>
        </TabPanel>
        <TabPanel value="2">
          <EndUserTable loading={loading} endUser={endUser}/>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default TestAdmin;
