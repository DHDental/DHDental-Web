import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CREATE_SERVICE, DELETE_SERVICE, GET_ALL_SERVICES, UPDATE_SERVICE } from "../../common/constants/apiConstants";
import { axiosPrivate } from "../../api/axiosInstance";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';

const service = [
  // {
  //   maDichVu: "123456",
  //   tenDichVu: "Trám Răng",
  //   chiPhi: "12200000",
  // },
];

const initialValues = {
  serviceId: "",
  serviceDesc: "",
  expectedPrice: "",
};

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

const OwnerTest = () => {
  const [serviceData, setServiceData] = useState(service);
  const [serviceFilter, setServiceFilter] = useState(service);

  const pages = [4, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const [isloading, setIsLoading] = useState(false);
  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const [isAddNew, setIsAddNew] = useState(false);
  const [isUpdateRow, setIsUpdateRow] = useState(false);
  const [values, setvalues] = useState(initialValues);

  const [rowSelectDelete, setRowSelectDelete] = useState(initialValues);
  const [searchedVal, setSearchedVal] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_SERVICES, params);
      const data = [...response.data];
      setServiceFilter(data);
      setServiceData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const createData = async (newRow) => {
    setIsLoading(true);
    const params = {
      serviceId: newRow.serviceId,
      serviceDesc: newRow.serviceDesc,
      expectedPrice: newRow.expectedPrice,
    };
    try {
      await axiosPrivate.post(CREATE_SERVICE, params);
      setvalues(initialValues);
      setIsAddNew(false);
      setIsDisabled(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const updateData = async (newRow) => {
    setIsLoading(true);
    const params = {
      serviceId: newRow.serviceId,
      serviceDesc: newRow.serviceDesc,
      expectedPrice: newRow.expectedPrice,
    };
    try {
      await axiosPrivate.post(UPDATE_SERVICE, params);
      setvalues(initialValues);
      setIsUpdateRow(false);
      setIsDisabled(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const deleteData = async (newRow) => {
    setIsLoading(true);
    const params = {
      serviceId: newRow.serviceId,
      serviceDesc: "",
      expectedPrice: "",
    };
    try {
      await axiosPrivate.post(DELETE_SERVICE, params);
      setRowSelectDelete(initialValues);

      setvalues(initialValues);

      setIsAddNew(false);
      setIsUpdateRow(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(2);
    if (
      values.serviceId === "" ||
      values.serviceDesc === "" ||
      values.expectedPrice === ""
    ) {
      setTextSnackbar("Lỗi: Không được để trống");
      setOpenSnackbar(true);
    } else {
      isAddNew === true
        ? 
        createData(values)
        : updateData(values);
    }
  };

  const handleUpdate = (row) => {
    setIsUpdateRow(true);
    setIsAddNew(false);
    setvalues({ ...row, serviceId: row.id });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setvalues({ ...values, [name]: value });
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleAcceptDialog = () => {
    deleteData(rowSelectDelete);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setRowSelectDelete(initialValues);
    setOpenDialog(false);
  };

  return (
    <>
    {isAddNew === true || isUpdateRow === true ? (
        <Box>
          <Grid container justifyContent="center">
            <Card sx={{ width: "100%" }}>
              <CardHeader
                title="Thông tin Dịch Vụ"
                titleTypographyProps={{
                  align: "center",
                  fontWeight: "bold",
                }}
                subheader={isAddNew === true ? "Tạo mới" : "Cập nhật"}
                subheaderTypographyProps={{
                  align: "center",
                }}
              />
              <CardContent sx={{ marginBottom: "2%" }}>
                <Box
                  component="form"
                  sx={{
                    display: "column",
                  }}
                  onSubmit={handleSubmit}
                >
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        disabled={isUpdateRow === true ? true : false}
                        id="serviceId"
                        name="serviceId"
                        fullWidth
                        variant="standard"
                        label="Mã dịch vụ"
                        value={values.serviceId}
                        onChange={handleChange}
                        // error={formik.touched.phone && Boolean(formik.errors.phone)}
                        // helperText={formik.touched.phone && formik.errors.phone}
                      />
                    </Grid>
                    <Grid item>
                    <TextField
                        id="serviceDesc"
                        name="serviceDesc"
                        fullWidth
                        variant="standard"
                        label="Mô tả dịch vụ"
                        value={values.serviceDesc}
                        onChange={handleChange}
                        // error={formik.touched.password && Boolean(formik.errors.password)}
                        // helperText={formik.touched.password && formik.errors.password}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="expectedPrice"
                        name="expectedPrice"
                        fullWidth
                        variant="standard"
                        label="Giá dịch vụ"
                        value={values.expectedPrice}
                        onChange={handleChange}
                        // error={formik.touched.password && Boolean(formik.errors.password)}
                        // helperText={formik.touched.password && formik.errors.password}
                      />
                    </Grid>
                    <br />
                    <Grid item>
                      <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ height: "35px" }}
                      >
                        {isAddNew === true ? "Tạo dịch vụ" : "Cập nhật dịch vụ"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      ) : (
        <></>
      )}
      <br />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid
          sx={{ flexGrow: 1 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={4}></Grid>
          <Grid item xs={6}>
            <h2>Bảng Dịch Vụ</h2>
          </Grid>
          <Grid item xs={8}>
          <TextField
              sx={{ width: "100%" }}
              label="Tìm Kiếm"
              variant="outlined"
              onChange={(e) => setSearchedVal(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <IconButton color="info" onClick={() => fetchData()}>
              <RefreshIcon />
            </IconButton>
            <IconButton
              size="large"
              disabled={isDisabled}
              color="warning"
              onClick={() => {
                setIsDisabled(true);

                setIsAddNew(true);
                setIsUpdateRow(false);

                setvalues(initialValues);
              }}
            >
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
            <IconButton
              size="large"
              disabled={!isDisabled}
              color="error"
              onClick={() => {
                setvalues(initialValues);

                setIsAddNew(false);
                setIsUpdateRow(false);

                setIsDisabled(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              {isloading === true || serviceData.length === 0 ? (
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell align="center">Số Thứ Tự</TableCell>
                  <TableCell align="right">Mã Dịch Vụ</TableCell>
                  <TableCell align="right">Tên Dịch Vụ</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
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
              ) : serviceData.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    Không Có Dữ Liệu
                  </TableCell>
                </TableRow>
              ) :(
                serviceData
                .filter(
                  (row) =>
                    !searchedVal.length ||
                    `${row.id} ${row.serviceDesc}`
                      .toString()
                      .toLowerCase()
                      .includes(searchedVal.toString().toLowerCase())
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {serviceData.indexOf(row) + 1}
                      </TableCell>
                      <TableCell align="right">{row.id}</TableCell>
                      <TableCell align="right">{row.serviceDesc}</TableCell>
                      <TableCell align="right">
                        {formatNumber(row.expectedPrice)} VND
                      </TableCell>
                      <TableCell align="center">
                      <IconButton
                          color="info"
                          disabled={isDisabled}
                          onClick={() => {
                            setIsDisabled(true);
                            handleUpdate(row);
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                      {/* <Button
                        variant="contained"
                        sx={{ width: "150px", height: "35px" }}
                        disabled={isDisabled}
                        onClick={() => {
                          setIsDisabled(true);
                          handleUpdate(row);
                        }}
                      >
                        Cập Nhật
                      </Button> */}
                    </TableCell>
                    <TableCell align="center">
                    <IconButton
              size="large"
              disabled={isDisabled}
              color="error"
              onClick={() => {
                setRowSelectDelete({ ...row, serviceId: row.id });
                handleClickOpenDialog();
              }}
            >
              <DeleteOutlinedIcon />
            </IconButton>
                      {/* <Button
                        variant="contained"
                        sx={{ width: "50px", height: "35px" }}
                        disabled={isDisabled}
                        onClick={() => {
                          setRowSelectDelete({ ...row, serviceId: row.id });
                          handleClickOpenDialog();
                        }}
                      >
                        Xóa
                      </Button> */}
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
                    count={serviceData.length}
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

export default OwnerTest;
