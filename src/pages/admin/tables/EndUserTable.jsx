import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TableFooter,
} from "@mui/material";
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
import RefreshIcon from "@mui/icons-material/Refresh";

const user = [];

const EndUserTable = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const [endUser, setEndUser] = useState(user);
  const [endUserFilter, setEndUserFilter] = useState(user);
  const [rowSelectUser, setRowSelectUser] = useState(null);
  const [searched, setSearched] = useState("");

  const pages = [4, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setIsLoading(props.loading);
    setEndUserFilter(props.endUser);
    setEndUser(props.endUser);
  }, [props.endUser, props.loading]);

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
      const data = [...response.data];
      const endUser = data.filter((data) => {
        return data.roleName === "End User";
      });
      setEndUser(endUser);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const updateUser = async (newRow) => {
    setIsLoading(true);
    const params = {
      userName: newRow.userName,
    };
    try {
      await axiosPrivate.post(BAN_OR_ACTIVE_ACCOUNT_ADMIN, params);
      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const requestSearch = (searchedVal) => {
    setPage(0);
    if (searchedVal === "") {
      setEndUser(endUserFilter);
      setPage(pageSave);
    } else {
      const filteredRows = endUserFilter.filter((row) => {
        return `${row.lastName.toLowerCase()} ${row.middleName.toLowerCase()} ${row.firstName.toLowerCase()}`.includes(
          searchedVal.toLowerCase()
        );
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleAcceptDialog = () => {
    updateUser(rowSelectUser);
    setRowSelectUser(null);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setRowSelectUser(null);
    setOpenDialog(false);
  };

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
            <h2>Bảng Tài Khoản Người Dùng</h2>
          </Grid>
          <Grid item xs={7}>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton color="info" onClick={() => fetchData()}>
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              {isloading === true ? (
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
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
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {isloading === true ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                endUser
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
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{ width: "200px", height: "35px" }}
                          onClick={() => {
                            setRowSelectUser(row);
                            handleClickOpenDialog();
                          }}
                        >
                          {row.status === "Active"
                            ? "Ban Tài Khoản"
                            : "Gỡ Ban Tài Khoản"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                {isloading === true ? (
                  <></>
                ) : (
                  <TablePagination
                    rowsPerPageOptions={[
                      4
                    ]}
                    // component="div"
                    count={endUser.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Số hàng trên một trang"
                    showFirstButton
                    showLastButton
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} của ${
                        count !== -1 ? count : `nhiều hơn ${to}`
                      }`
                    }
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
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
      <Dialog
        open={openDialog}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Lưu ý!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Bạn có xác nhận muốn tiếp tục
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleAcceptDialog}>Xác Nhận</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EndUserTable;
