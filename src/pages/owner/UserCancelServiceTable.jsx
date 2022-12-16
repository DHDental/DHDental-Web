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
import moment from "moment/moment";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { formatYearMonthDate } from "../../common/utils/formatDate";
import { axiosPrivate } from "../../api/axiosInstance";
import { GET_USER_CANCEL_SERVICE } from "../../common/constants/apiConstants";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const userCancelService = [
  // {
  //   id: "158",
  //   date: "2022-11-11",
  //   money: "30,150,000",
  // },
];

const UserCancelServiceTable = () => {
  const [userCancelServiceData, setUserCancelServiceData] = useState(userCancelService);
  const [userCancelServiceFilter, setUserCancelServiceFilter] = useState(userCancelService);
  const [isloading, setIsLoading] = useState(false);

  const pages = [4, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchedVal, setSearchedVal] = useState("");
  
  const current = new Date();
  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const [selectDate, setSelectDate] = useState(date);

  useEffect(() => {
    fetchData(date);
  }, [date]);

  const fetchData = async (date) => {
    setIsLoading(true);
    const params = {
      date: formatYearMonthDate(dayjs(date, "DD/MM/YYYY")) ===
      "Invalid Date"
        ? date
        : formatYearMonthDate(dayjs(date, "DD/MM/YYYY")),
    };
    try {
      const response = await axiosPrivate.post(GET_USER_CANCEL_SERVICE, params);
      const data = [...response.data];
      setUserCancelServiceFilter(data);
      setUserCancelServiceData(data);
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
            <h2>Bảng Lượng Người Hủy Dịch Vụ</h2>
          </Grid>
          <Grid item xs={7}>
          <TextField
              sx={{ width: "100%" }}
              label="Tìm Kiếm"
              variant="outlined"
              onChange={(e) => setSearchedVal(e.target.value)}
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
          <IconButton
              size="large"
              onClick={() => {
                handleDateSearch();
              }}
            >
              <SearchRoundedIcon />
            </IconButton>
            {/* <Button
              variant="contained"
              sx={{ width: "100%", height: "35px" }}
              onClick={() => {
                handleDateSearch();
              }}
            >
              Tìm Kiếm Theo Ngày
            </Button> */}
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              {isloading === true || userCancelServiceData.length === 0 ? (
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
              ) : userCancelServiceData.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    Không Có Dữ Liệu
                  </TableCell>
                </TableRow>
              ) : (
                userCancelServiceData
                .filter(
                  (row) =>
                    !searchedVal.length ||
                    `${row.fullName} ${row.phoneNumber} ${row.address}`
                      .toString()
                      .toLowerCase()
                      .includes(searchedVal.toString().toLowerCase())
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">
                        {userCancelServiceData.indexOf(row) + 1}
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
                    count={userCancelServiceData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Số hàng trên một trang"
                    showFirstButton
                    showLastButton
                    labelDisplayedRows={({ from, to, count, page }) =>
                      `${from}–${to} của ${
                        count !== -1 ? count : `nhiều hơn ${to}`
                      } | Trang ${page}`
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
  )
}

export default UserCancelServiceTable
