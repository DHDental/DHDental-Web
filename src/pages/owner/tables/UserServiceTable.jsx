import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import SearchBar from "material-ui-search-bar";
import { axiosPrivate } from "../../../api/axiosInstance";
import {
  GET_USER_WITH_SERVICE,
} from "../../../common/constants/apiConstants";
import moment from "moment/moment";
import { formatYearMonthDate } from "../../../common/utils/formatDate";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const userWithService = [
  // {
  //   id: "158",
  //   date: "2022-11-11",
  //   money: "30,150,000",
  // },
];

const UserServiceTable = (props) => {
  const [userServiceData, setUserServiceData] = useState(userWithService);
  const [userServiceFilter, setUserServiceFilter] = useState(userWithService);
  const [isloading, setIsLoading] = useState(false);

  const pages = [4, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [searched, setSearched] = useState("");
  const current = new Date();
  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const [selectDate, setSelectDate] = useState(date);

  useEffect(() => {
    setIsLoading(props.loading);
    setUserServiceFilter(props.userServiceData);
    setUserServiceData(props.userServiceData);
  }, [props.userServiceData, props.loading]);

  const requestSearch = (searchedVal) => {
    setPage(0);
    if (searchedVal === "") {
      setUserServiceData(userServiceFilter);
      setPage(pageSave);
    } else {
      const filteredRows = userServiceFilter.filter((row) => {
        return `${row.fullName} ${row.phoneNumber} ${row.address}`
          .toLowerCase()
          .includes(searchedVal.toLowerCase());
      });
      setUserServiceData(filteredRows);
    }
  };

  const fetchData = async (date) => {
    setIsLoading(true);
    const params = {
      date: formatYearMonthDate(dayjs(date, "DD/MM/YYYY")) ===
      "Invalid Date"
        ? date
        : formatYearMonthDate(dayjs(date, "DD/MM/YYYY")),
    };
    try {
      const response = await axiosPrivate.post(GET_USER_WITH_SERVICE, params);
      const data = [...response.data];
      setUserServiceFilter(data);
      setUserServiceData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleDateSearch = () => {
    if (selectDate === null) {
      setTextSnackbar("Không thấy ngày tìm kiếm");
      setOpenSnackbar(true);
    } else {
      fetchData(selectDate);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid
          sx={{ flexGrow: 1 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <h2>Bảng Lượng Người Dùng Dịch Vụ</h2>
          </Grid>
          <Grid item xs={7}>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
            disableFuture
              label="Tìm Kiếm Ngày"
              inputFormat="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              value={selectDate}
              onChange={(newValue) => {
                setSelectDate(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth variant="standard" {...params} />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              sx={{ width: "100%", height: "35px" }}
              onClick={() => {
                handleDateSearch();
              }}
            >
              Tìm Kiếm Theo Ngày
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              {isloading === true || userServiceData.length === 0 ? (
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="right">Họ & Tên</TableCell>
                  <TableCell align="right">Số Điện Thoại</TableCell>
                  <TableCell align="right">Địa Chỉ</TableCell>
                  <TableCell align="right">Ngày Sinh</TableCell>
                  <TableCell align="right">Tổng Tiền</TableCell>
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
              ) : userServiceData.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    Không Có Dữ Liệu
                  </TableCell>
                </TableRow>
              ) : (
                userServiceData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">
                        {userServiceData.indexOf(row) + 1}
                      </TableCell>
                      <TableCell align="right">{row.fullName}</TableCell>
                      <TableCell align="right">{row.phoneNumber}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">
                        {moment(row.dob).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">{row.totalPrice} VND</TableCell>
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
                    count={userServiceData.length}
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
    </>
  );
};

export default UserServiceTable;
