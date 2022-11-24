import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import tableIcons from "../../../components/MaterialTableIcons";
import moment from "moment/moment";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Select,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import RefreshIcon from "@mui/icons-material/Refresh";
import { axiosPrivate } from "../../../api/axiosInstance";
import {
  CRUD_ACCOUNT_ADMIN,
  GET_ALL_USER_ADMIN,
} from "../../../common/constants/apiConstants";
import { async } from "@firebase/util";

const user = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StaffTable = (props) => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState(user);
  const [open, setOpen] = React.useState(false);
  const [updateRow, setUpdateRow] = React.useState(null);
  const [oldRow, setOldRow] = React.useState(null);
  const [staffFilter, setStaffFilter] = useState(user);
  const [roleStaff, setRoleStaff] = React.useState("All");

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

  useEffect(() => {
    setLoading(props.loading);
    setStaffFilter(props.staff);
    setStaff(props.staff);
  }, [props.loading, props.staff]);

  useEffect(() => {
    if (roleStaff === "All") {
      setStaff(staffFilter);
    } else {
      setStaff(staffFilter.filter((data) => data.roleName === roleStaff));
    }
  }, [roleStaff, staffFilter]);

  const filterData = async () => {
    setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const staffData = data.filter((data) => {
      return data.roleName !== "End User";
    });
    const filterData = data.filter((data) => {
      return data.roleName === roleStaff;
    });
    setStaffFilter(staffData);
    setStaff(filterData);
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const staffData = data.filter((data) => {
      return data.roleName !== "End User";
    });
    setStaffFilter(staffData);
    setStaff(staffData);
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
    await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
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
    await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
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
    if (roleStaff !== "All") {
      filterData();
    } else {
      setStaffFilter(updateRows);
      setStaff(updateRows);
      setLoading(false);
    }
    setUpdateRow(null);
    setOldRow(null);
    setOpen(false);
  };

  return (
    <div>
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
          {
            icon: () => (
              <Select
                // labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 120, height: 30 }}
                value={roleStaff}
                onChange={(e) => setRoleStaff(e.target.value)}
              >
                <MenuItem value={"All"}>Tất cả</MenuItem>
                <br />
                <MenuItem value={"Dentist"}>Nha sĩ</MenuItem>
                <br />
                <MenuItem value={"Staff"}>Nhân viên</MenuItem>
              </Select>
            ),
            // tooltip: "Filter Data",
            isFreeAction: true,
          },
        ]}
        editable={{
          onRowAdd: (newRow) =>
            new Promise((resolve, reject) => {
              const updateRows = [
                ...staff,
                {
                  ...newRow,
                  dateOfBirth: moment(newRow.dateOfBirth).format("YYYY-MM-DD"),
                },
              ];
              setTimeout(() => {
                createStaff({
                  ...newRow,
                  dateOfBirth: moment(newRow.dateOfBirth).format("YYYY-MM-DD"),
                });
                if (roleStaff !== "All") {
                  filterData();
                } else {
                  setStaffFilter(updateRows);
                  setStaff(updateRows);
                }
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

            // filtering: true,
          //   defaultFilter: "Select",

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
    </div>
  );
};

export default StaffTable;
