import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import Tab from "@material-ui/core/Tab";
import MaterialTable from "material-table";
import moment from "moment/moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { axiosPublic } from "../../api/axiosInstance";
import {
  BAN_OR_ACTIVE_ACCOUNT_ADMIN,
  CRUD_ACCOUNT_ADMIN,
  GET_ALL_USER_ADMIN,
} from "../../common/constants/apiConstants";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import tableIcons from "../../components/MaterialTableIcons";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const user = [
  //   {
  //     firstName: "",
  //     userName: "",
  //     middleName: "",
  //     lastName: "",
  //     phoneNumber: "",
  //     address: "",
  //     dateOfBirth: "",
  //     roleName: "",
  //   },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TestAdmin = () => {
  const [value, setValue] = React.useState("1");
  const [staff, setStaff] = useState(user);
  const [endUser, setEndUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [updateRow, setUpdateRow] = React.useState(null);
  const [oldRow, setOldRow] = React.useState(null);

  const columnsStaff = [
    { title: "Họ", field: "lastName" },
    { title: "Tên đệm", field: "middleName" },
    { title: "Tên", field: "firstName" },
    { title: "Số điện thoại", field: "userName", editable: "onAdd" },
    { title: "Địa chỉ", field: "address" },
    {
      title: "Ngày sinh",
      field: "dateOfBirth",
      type: "date",
      dateSetting: { locale: "vn-VN" },
      render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
    },
    {
      title: "Quyền",
      field: "roleName",
      editable: "onAdd",
      filterPlaceholder: "Select",
      lookup: {
        Dentist: "Nha sĩ",
        Staff: "Nhân viên",
      },
    },
  ];

  const columnsEndUser = [
    { title: "Họ", field: "lastName", editable: "never" },
    { title: "Tên đệm", field: "middleName", editable: "never" },
    { title: "Tên", field: "firstName", editable: "never" },
    { title: "Số điện thoại", field: "userName", editable: "never" },
    { title: "Địa chỉ", field: "address", editable: "never" },
    {
      title: "Ngày sinh",
      field: "dateOfBirth",
      type: "date",
      dateSetting: { locale: "vn-VN" },
      render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
      editable: "never",
    },
    {
      title: "Quyền",
      field: "roleName",
      editable: "never",
      lookup: {
        "End User": "Người dùng",
      },
      filtering: false,
    },
    {
      title: "Trạng thái",
      field: "status",
      filterPlaceholder: "Select",
      render: (rowData) =>
        rowData.status === "Active" ? (
          <Chip label="Active" color="success" />
        ) : (
          <Chip label="Inactive" color="error" />
        ),
      lookup: {
        Active: "Active",
        Inactive: "Inactive",
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const params = {};
    const response = await axiosPublic.post(GET_ALL_USER_ADMIN, params);
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

  const createStaff = async (newRow) => {
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.userName,
      dob: newRow.dateOfBirth,
      address: newRow.address,
      role: newRow.roleName,
      operationType: "C",
    };
    await axiosPublic.post(CRUD_ACCOUNT_ADMIN, params);
  };

  const updateStaff = async (newRow) => {
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.userName,
      dob: newRow.dateOfBirth,
      address: newRow.address,
      role: newRow.roleName,
      operationType: "U",
    };
    await axiosPublic.post(CRUD_ACCOUNT_ADMIN, params);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateUser = async (newRow) => {
    // setLoading(true);
    if (newRow.status === "Inactive") {
      const params = {
        userName: newRow.userName,
      };
      await axiosPublic.post(BAN_OR_ACTIVE_ACCOUNT_ADMIN, params);
      await fetchData();
    } else {
      const params = {
        userName: newRow.userName,
      };
      await axiosPublic.post(BAN_OR_ACTIVE_ACCOUNT_ADMIN, params);
      await fetchData();
    }
  };

  const handleClickOpen = () => {
    setLoading(true);
    setOpen(true);
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const handleAccept = () => {
    const index = oldRow.tableData.id;
    const updateRows = [...staff];
    updateRows[index] = updateRow;
    updateStaff(updateRow);
    setStaff(updateRows);
    setUpdateRow(null);
    setOldRow(null);
    setLoading(false);
    setOpen(false);
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
          <MaterialTable
            isLoading={loading}
            title="Bảng Tài Khoản Nhân Sự"
            icons={tableIcons}
            columns={columnsStaff}
            data={staff}
            actions={[
              {
                icon: RefreshIcon,
                tooltip: "Refresh Data",
                isFreeAction: true,
                onClick: () => fetchData(),
              },
            ]}
            editable={{
              onRowAdd: (newRow) =>
                new Promise((resolve, reject) => {
                  const updateRows = [
                    ...staff,
                    {
                      ...newRow,
                      dateOfBirth: moment(newRow.dateOfBirth).format(
                        "YYYY-MM-DD"
                      ),
                    },
                  ];
                  setTimeout(() => {
                    createStaff({
                      ...newRow,
                      dateOfBirth: moment(newRow.dateOfBirth).format(
                        "YYYY-MM-DD"
                      ),
                    });
                    setStaff(updateRows);
                    resolve();
                  }, 2000);
                  //   console.log(newRow);
                }),

              onRowUpdate: (updateRow, oldRow) =>
                new Promise((resolve, reject) => {
                  handleClickOpen();
                  setUpdateRow(updateRow);
                  setOldRow(oldRow);
                  resolve();
                }),
            }}
            // components={{
            //     OverlayLoading: props => (<Spinner />)
            //   }}
            options={{
              sorting: true,
              search: true,
              searchFieldAlignment: "right",
              searchAutoFocus: true,
              searchFieldVariant: "standard",

              paging: true,
              pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
              pageSize: 5,
              paginationType: "stepped",
              showFirstLastPageButtons: false,
              selection: false,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,

              actionsColumnIndex: -1,
              addRowPosition: "first",

              filtering: true,
              defaultFilter: "Select",

              rowStyle: (data, index) =>
                index % 2 === 0 ? { background: "#f5f5f5" } : null,
              headerStyle: { background: "#f44336", color: "#fff" },
            }}
            localization={{
              pagination: {
                labelRowsSelect: "Dòng",
                labelDisplayedRows: "{from}-{to} of {count}",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                nRowsSelected: "{0} Dòng(s) selected",
              },
              header: {
                actions: "",
              },
              body: {
                emptyDataSourceMessage: "Chưa có dữ liệu",
                filterRow: {
                  filterTooltip: "Filter",
                },
              },
            }}
          />
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Lưu ý!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Bạn có xác nhận muốn cập nhật
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button onClick={handleAccept}>Xác Nhận</Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
        <TabPanel value="2">
          <MaterialTable
            isLoading={loading}
            title="Bảng Tài Khoản Người Dùng"
            icons={tableIcons}
            columns={columnsEndUser}
            data={endUser}
            actions={[
              {
                icon: RefreshIcon,
                tooltip: "Refresh Data",
                isFreeAction: true,
                onClick: () => fetchData(),
              },
              {
                icon: ChangeCircleIcon,
                tooltip: "Đổi Trạng Thái",
                onClick: (e, data) => updateUser(data),
              },
            ]}
            // editable={{
            //   onRowUpdate: (updateRow, oldRow) =>
            //     new Promise((resolve, reject) => {
            //       const index = oldRow.tableData.id;
            //       const updateRows = [...endUser];
            //       updateRows[index] = updateRow;
            //       setTimeout(() => {
            //         updateUser(updateRow);
            //         setEndUser(updateRows);
            //         resolve();
            //       }, 2000);
            //     }),
            // }}
            // components={{
            //     OverlayLoading: props => (<Spinner />)
            //   }}
            options={{
              sorting: true,
              search: true,
              searchFieldAlignment: "right",
              searchAutoFocus: true,
              searchFieldVariant: "standard",

              paging: true,
              pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
              pageSize: 5,
              paginationType: "stepped",
              showFirstLastPageButtons: false,
              selection: false,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,

              actionsColumnIndex: -1,
              addRowPosition: "first",

              filtering: true,

              //   loadingType: 'linear',
              rowStyle: (data, index) =>
                index % 2 === 0 ? { background: "#f5f5f5" } : null,
              headerStyle: { background: "#f44336", color: "#fff" },
            }}
            localization={{
              pagination: {
                labelDisplayedRows: "{from}-{to} of {count}",
                labelRowsSelect: "Dòng",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                nRowsSelected: "{0} Dòng(s) đã chọn",
              },
              header: {
                actions: "",
              },
              body: {
                emptyDataSourceMessage: "Chưa có dữ liệu",
                filterRow: {
                  filterTooltip: "Bộ lọc",
                },
              },
            }}
          />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default TestAdmin;
