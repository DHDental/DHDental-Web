import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Alert,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchBar from "material-ui-search-bar";
import TablePagination from "@mui/material/TablePagination";
import { axiosPrivate } from "../../../api/axiosInstance";
import { GET_ALL_SERVICES } from "../../../common/constants/apiConstants";
import RefreshIcon from "@mui/icons-material/Refresh";

// const CustomTablePagination = styled.TablePagination`
//   display: inline;
// `

const service = [
  // {
  //   maDichVu: "123456",
  //   tenDichVu: "Trám Răng",
  //   chiPhi: "12200000",
  // },
];

export const formatNumber = (inputNumber) => {
  let formetedNumber = Number(inputNumber)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  let splitArray = formetedNumber.split(".");
  if (splitArray.length > 1) {
    formetedNumber = splitArray[0];
  }
  return formetedNumber;
};

const ServiceTable = (props) => {
  const [serviceData, setServiceData] = useState(service);
  const [serviceFilter, setServiceFilter] = useState(service);
  const [searched, setSearched] = useState("");

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const [isloading, setIsLoading] = useState(false);
  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const columnsService = [
  //     { title: "Mã Dịch Vụ", field: "maDichVu", editable: "never"  },
  //     { title: "Tên Dịch Vụ", field: "tenDichVu" },
  //     { title: "Giá", field: "chiPhi", render: (rowData) =>
  //     formatNumber(rowData.chiPhi) + " VND", },
  //   ];

  useEffect(() => {
    setIsLoading(props.loading);
    setServiceFilter(props.serviceData);
    setServiceData(props.serviceData);
  }, [props.serviceData, props.loading]);

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_SERVICES, params);
      const data = [...response.data];
      setServiceData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const requestSearch = (searchedVal) => {
    setPage(0);
    if (searchedVal === "") {
      setServiceData(serviceFilter);
      setPage(pageSave);
    } else {
      const filteredRows = serviceFilter.filter((row) => {
        return `${row.id} ${row.serviceDesc}`
          .toLowerCase()
          .includes(searchedVal.toLowerCase());
      });
      setServiceData(filteredRows);
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
        >
          {/* <Grid item xs={1}></Grid> */}
          <Grid item xs={4}>
            <h2>Bảng Dịch Vụ</h2>
          </Grid>
          <Grid item xs={6}>
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
                  <TableCell align="center">Số Thứ Tự</TableCell>
                  <TableCell align="right">Mã Dịch Vụ</TableCell>
                  <TableCell align="right">Tên Dịch Vụ</TableCell>
                  <TableCell align="right">Giá</TableCell>
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
                serviceData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">
                        {serviceData.indexOf(row) + 1}
                      </TableCell>
                      <TableCell align="right">{row.id}</TableCell>
                      <TableCell align="right">{row.serviceDesc}</TableCell>
                      <TableCell align="right">
                        {formatNumber(row.expectedPrice)} VND
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
                      5,
                      10,
                      25,
                      100,
                      { label: "Tất cả", value: -1 },
                    ]}
                    count={serviceData.length}
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

export default ServiceTable;
