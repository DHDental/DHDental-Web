import { Alert, Box, Snackbar } from "@mui/material";
import Tab from "@material-ui/core/Tab";
import React, { useState } from "react";
import { useEffect } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import { GET_ALL_USER_ADMIN } from "../../common/constants/apiConstants";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import StaffTable from "./tables/StaffTable";
import EndUserTable from "./tables/EndUserTable";

const user = [];

const TestAdmin = () => {
  const [value, setValue] = React.useState("1");
  const [staff, setStaff] = useState(user);
  const [endUser, setEndUser] = useState(user);

  const [isloading, setIsLoading] = useState(false);

  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
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
            <Tab label="Quản Lý Nhân Sự" value="1" />
            <Tab label="Quản Lý Người Dùng" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <StaffTable staff={staff} loading={isloading} />
        </TabPanel>
        <TabPanel value="2">
          <EndUserTable endUser={endUser} loading={isloading} />
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

export default TestAdmin;
