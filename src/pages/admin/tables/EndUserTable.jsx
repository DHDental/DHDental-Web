import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import tableIcons from "../../../components/MaterialTableIcons";
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
import RefreshIcon from "@mui/icons-material/Refresh";
import moment from "moment/moment";
import { BAN_OR_ACTIVE_ACCOUNT_ADMIN, GET_ALL_USER_ADMIN } from "../../../common/constants/apiConstants";
import { axiosPrivate } from "../../../api/axiosInstance";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

const user = [
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EndUserTable = (props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [endUser, setEndUser] = useState(user);
  const [userData, setUserData] = useState(null);

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
    setLoading(props.loading);
    // setStaffFilter(props.staff);
    setEndUser(props.endUser);
  },[props.loading, props.endUser]);

  const fetchData = async () => {
    setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const endUser = data.filter((data) => {
      return data.roleName === "End User";
    });
    setEndUser(endUser);
    setLoading(false);
  };

  const updateUser = async (newRow) => {
    if (newRow.status === "Inactive") {
      const params = {
        userName: newRow.userName,
      };
      await axiosPrivate.post(BAN_OR_ACTIVE_ACCOUNT_ADMIN, params);
      await fetchData();
    } else {
      const params = {
        userName: newRow.userName,
      };
      await axiosPrivate.post(BAN_OR_ACTIVE_ACCOUNT_ADMIN, params);
      await fetchData();
    }
  };

  const handleClickOpen = () => {
    setLoading(true);
    setOpen(true);
  };

  const handleAccept = () => {
    updateUser(userData);
    setUserData(null);
    setOpen(false);
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };


  return (
    <div>
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
            onClick: (e, data)=>{
              setUserData(data);
              handleClickOpen();
            },
          },
        ]}
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
    </div>
  );
};

export default EndUserTable;
