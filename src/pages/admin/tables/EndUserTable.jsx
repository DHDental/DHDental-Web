import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import moment from "moment/moment";
import {
  BAN_OR_ACTIVE_ACCOUNT_ADMIN,
  GET_ALL_USER_ADMIN,
} from "../../../common/constants/apiConstants";
import { axiosPrivate } from "../../../api/axiosInstance";
import Grid from "@mui/material/Grid";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchBar from "material-ui-search-bar";
import TablePagination from "@mui/material/TablePagination";

const user = [];

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

const EndUserTable = (props) => {
  // const [open, setOpen] = React.useState(false);
  // const [loading, setLoading] = useState(false);
  const [endUser, setEndUser] = useState(user);
  const [endUserFilter, setEndUserFilter] = useState(user);
  // const [userData, setUserData] = useState(null);
  const [searched, setSearched] = useState("");

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  // const columnsEndUser = [
  //   { title: "Họ", field: "lastName", editable: "never" },
  //   { title: "Tên đệm", field: "middleName", editable: "never" },
  //   { title: "Tên", field: "firstName", editable: "never" },
  //   { title: "Số điện thoại", field: "userName", editable: "never" },
  //   { title: "Địa chỉ", field: "address", editable: "never" },
  //   {
  //     title: "Ngày sinh",
  //     field: "dateOfBirth",
  //     type: "date",
  //     dateSetting: { locale: "vn-VN" },
  //     render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
  //     editable: "never",
  //   },
  //   {
  //     title: "Quyền",
  //     field: "roleName",
  //     editable: "never",
  //     lookup: {
  //       "End User": "Người dùng",
  //     },
  //     filtering: false,
  //   },
  //   {
  //     title: "Trạng thái",
  //     field: "status",
  //     filterPlaceholder: "Select",
  //     render: (rowData) =>
  //       rowData.status === "Active" ? (
  //         <Chip label="Active" color="success" />
  //       ) : (
  //         <Chip label="Inactive" color="error" />
  //       ),
  //     lookup: {
  //       Active: "Active",
  //       Inactive: "Inactive",
  //     },
  //   },
  // ];

  useEffect(() => {
    // setLoading(props.loading);
    // setStaffFilter(props.staff);
    setEndUserFilter(props.endUser);
    setEndUser(props.endUser);
  }, [ props.endUser]);

  const fetchData = async () => {
    // setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const endUser = data.filter((data) => {
      return data.roleName === "End User";
    });
    setEndUser(endUser);
    // setLoading(false);
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

  const requestSearch = (searchedVal) => {
    setPage(0);
    if (searchedVal === "") {
      setEndUser(endUserFilter);
      setPage(pageSave);
    } else {
      const filteredRows = endUserFilter.filter((row) => {
        return `${row.lastName.toLowerCase()} ${row.middleName.toLowerCase()} ${row.firstName.toLowerCase()}`
          .includes(searchedVal.toLowerCase());
      });
      setEndUser(filteredRows);
    }
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageSave(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPageSave(0);
  };

  // const handleClickOpen = () => {
  //   setLoading(true);
  //   setOpen(true);
  // };

  // const handleAccept = () => {
  //   updateUser(userData);
  //   setUserData(null);
  //   setOpen(false);
  // };

  // const handleClose = () => {
  //   setLoading(false);
  //   setOpen(false);
  // };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid
          sx={{ flexGrow: 1 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <h2>Bảng Tài Khoản Nhân Sự</h2>
          </Grid>
          <Grid item xs={8}>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="right">Họ</TableCell>
                <TableCell align="right">Tên đệm</TableCell>
                <TableCell align="right">Tên</TableCell>
                <TableCell align="right">Số điện thoại</TableCell>
                <TableCell align="right">Địa chỉ</TableCell>
                <TableCell align="right">Ngày sinh</TableCell>
                <TableCell align="right">Quyền</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endUser
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.userName}>
                    <TableCell align="center">
                      {endUser.indexOf(row) + 1}
                    </TableCell>
                    <TableCell align="right">{row.lastName}</TableCell>
                    <TableCell align="right">{row.middleName}</TableCell>
                    <TableCell align="right">{row.firstName}</TableCell>
                    <TableCell align="right">{row.userName}</TableCell>
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">
                      {moment(row.dateOfBirth).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="right">{row.roleName}</TableCell>
                    <TableCell align="center">
                      {row.status === "Active" ? (
                        <Chip label="Active" color="success" />
                      ) : (
                        <Chip label="Inactive" color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          page={page}
          rowsPerPage={rowsPerPage}
          count={endUser.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <Dialog
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
      </Dialog> */}
    </>
  );
};

export default EndUserTable;
