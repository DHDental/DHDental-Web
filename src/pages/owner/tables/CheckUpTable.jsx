import { Alert, Button, CircularProgress, Grid, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import SearchBar from 'material-ui-search-bar';
import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../api/axiosInstance';
import { COUNT_NUMBER_VISITED_BY_RANGE_TIME } from '../../../common/constants/apiConstants';
import RefreshIcon from "@mui/icons-material/Refresh";
import moment from 'moment/moment';
import { formatYearMonthDate } from '../../../common/utils/formatDate';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';


const checkUp = [
    // {
    //   fullName: "Lại Nguyễn Tấn Tài",
    //   phoneNumber: "021312334",
    //   dob: "2000-02-02",
    //   address: "Bình Dương",
    //   dateVisited: "2000-03-03",
    // },
  ];

const CheckUpTable = (props) => {
  const [checkUpData, setCheckUpData] = useState(checkUp);
  const [checkUpFilter, setCheckUpFilter] = useState(checkUp);
  const [isloading, setIsLoading] = useState(false);

  const pages = [4, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [searched, setSearched] = useState("");
  const current = new Date();
  const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
  const datePast = formatYearMonthDate(dayjs(date, "YYYY-MM-DD").add(-1, 'days'));

  const [selectDateStart, setSelectDateStart] = useState(datePast);
  const [selectDateEnd, setSelectDateEnd] = useState(date);
  
    useEffect(() => {
      setIsLoading(props.loading);
      setCheckUpFilter(props.checkUpData);
      setCheckUpData(props.checkUpData);
    }, [props.checkUpData, props.loading]);

    const requestSearch = (searchedVal) => {
      setPage(0);
      if (searchedVal === "") {
        setCheckUpData(checkUpFilter);
        setPage(pageSave);
      } else {
        const filteredRows = checkUpFilter.filter((row) => {
          return `${row.fullName} ${row.phoneNumber} ${row.address}`
            .toLowerCase()
            .includes(searchedVal.toLowerCase());
        });
        setCheckUpData(filteredRows);
      }
    };

    const fetchData = async (selectDateStart, selectDateEnd) => {
      setIsLoading(true);
      const params = {
        from:
        formatYearMonthDate(dayjs(selectDateStart, "DD/MM/YYYY")) ===
        "Invalid Date"
          ? selectDateStart
          : formatYearMonthDate(dayjs(selectDateStart, "DD/MM/YYYY")),
      to:
        formatYearMonthDate(dayjs(selectDateEnd, "DD/MM/YYYY")) ===
        "Invalid Date"
          ? selectDateEnd
          : formatYearMonthDate(dayjs(selectDateEnd, "DD/MM/YYYY")),
      };
      // console.log(params);
      try {
        const response = await axiosPrivate.post(COUNT_NUMBER_VISITED_BY_RANGE_TIME, params);
      const data = [...response.data];
      setCheckUpFilter(data);
      setCheckUpData(data);
      setIsLoading(false);
      } catch (error) {
        setTextSnackbar("Đã xãy ra lỗi");
        setOpenSnackbar(true);
        setIsLoading(false);
      }
    };

    const handleDateSearch = () => {
      if (selectDateStart === null || selectDateEnd === null) {
        setTextSnackbar("Không để trống");
        setOpenSnackbar(true);
      } else {
        fetchData(selectDateStart, selectDateEnd);
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
          {/* <Grid item xs={1}></Grid> */}
          <Grid item xs={5}>
            <h2>Bảng số lượng người đã khám theo ngày</h2>
          </Grid>
          <Grid item xs={6}>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="Tìm Kiếm Ngày Bắt Đầu"
              inputFormat="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              value={selectDateStart}
              maxDate={selectDateEnd}
              onChange={(newValue) => {
                setSelectDateStart(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth variant="standard" {...params} />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              disableFuture
              label="Tìm Kiếm Ngày Kết Thúc"
              inputFormat="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              value={selectDateEnd}
              minDate={selectDateStart}
              onChange={(newValue) => {
                setSelectDateEnd(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth variant="standard" {...params} />
              )}
            />
          </Grid>
          <Grid item xs={3}>
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
              {isloading === true || checkUpData.length === 0 ? (
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
                  <TableCell align="right">Ngày Khám</TableCell>
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
              ) : checkUpData.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    Không Có Dữ Liệu
                  </TableCell>
                </TableRow>
              ) :(
                checkUpData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row}>
                      <TableCell align="center">
                        {checkUpData.indexOf(row) + 1}
                      </TableCell>
                      <TableCell align="right">{row.fullName}</TableCell>
                      <TableCell align="right">{row.phoneNumber}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">{moment(row.dob).format("DD/MM/YYYY")}</TableCell>
                      <TableCell align="right">{moment(row.dateVisited).format("DD/MM/YYYY")}</TableCell>
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
                    count={checkUpData.length}
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
  )
}

export default CheckUpTable
