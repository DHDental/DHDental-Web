import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import {
  GET_ALL_MEDICINES,
  SET_MEDICINE_MASTER,
} from "../../common/constants/apiConstants";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

const medicines = [
  // {
  //     id: "1",
  //     medicineName: "Paracetamol",
  //     medicineType: "Giảm đau",
  //     dosage: "Sáng 1 tối 1"
  // }
];
const initialValues = {
  id: "",
  medicineName: "",
  medicineType: "",
  dosage: "",
};

const Medicine = () => {
  const [medicineData, setMedicineData] = useState(medicines);
  const [medicineFilter, setMedicineFilter] = useState(medicines);
  const [medicineDosage, setMedicineDosage] = useState("");
  const [values, setvalues] = useState(initialValues);
  const [searchedVal, setSearchedVal] = useState("");

  const [rowSelectDelete, setRowSelectDelete] = useState(initialValues);

  const [isloading, setIsLoading] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);
  const [isUpdateRow, setIsUpdateRow] = useState(false);

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isErrorMedicineName, setIsErrorMedicineName] = useState(false);
  const [isErrorMedicineType, setIsErrorMedicineType] = useState(false);
  const [isErrorMedicineDosage, setIsErrorMedicineDosage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_MEDICINES, params);
      const data = [...response.data];
      setMedicineFilter(data);
      setMedicineData(data);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const createData = async (newRow, dosage) => {
    setIsLoading(true);
    const params = {
      medicineId: "",
      medicineName: newRow.medicineName,
      medicineType: newRow.medicineType,
      medicineDosage: dosage,
      operationType: "C",
    };
    try {
      await axiosPrivate.post(SET_MEDICINE_MASTER, params);
      setvalues(initialValues);
      setMedicineDosage("");
      setIsAddNew(false);

      setIsDisabled(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const updateData = async (newRow, dosage) => {
    setIsLoading(true);
    const params = {
      medicineId: newRow.id,
      medicineName: newRow.medicineName,
      medicineType: newRow.medicineType,
      medicineDosage: dosage,
      operationType: "U",
    };
    try {
      await axiosPrivate.post(SET_MEDICINE_MASTER, params);
      setvalues(initialValues);
      setMedicineDosage("");
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
      medicineId: newRow.id,
      medicineName: "",
      medicineType: "",
      medicineDosage: "",
      operationType: "D",
    };
    try {
      await axiosPrivate.post(SET_MEDICINE_MASTER, params);
      setRowSelectDelete(initialValues);

      setvalues(initialValues);
      setMedicineDosage("");

      setIsAddNew(false);
      setIsUpdateRow(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsErrorMedicineName(false);
    setIsErrorMedicineType(false);
    setIsErrorMedicineDosage(false);

    if(values.medicineName === ""){
      setIsErrorMedicineName(true);
      setTextSnackbar("Lỗi: Không Được để rỗng");
      setOpenSnackbar(true);
    }
    else if(values.medicineType === "" ){
      setIsErrorMedicineType(true);
      setTextSnackbar("Lỗi: Không Được để rỗng");
      setOpenSnackbar(true);
    }
    else if(medicineDosage === ""){
      setIsErrorMedicineDosage(true);
      setTextSnackbar("Lỗi: Vui lòng chọn liều dùng");
      setOpenSnackbar(true);
    }
    else if(values.medicineType.match(/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/) ){
      setIsErrorMedicineType(true);
      setTextSnackbar("Lỗi: Không chọn ký tự đặt biệt");
      setOpenSnackbar(true);
    }
    else if(values.medicineType.match(/[0-9]/) ){
      setIsErrorMedicineType(true);
      setTextSnackbar("Lỗi: Loại Thuốc Không Được Nhập Số");
      setOpenSnackbar(true);
    }
    else if (
      values.medicineName.match(/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/) 
    ) {
      setIsErrorMedicineName(true);
      setTextSnackbar("Lỗi: Không chọn ký tự đặt biệt");
      setOpenSnackbar(true);
      
    }
    else if(values.medicineName.match(/^[0-9]/)){
      setIsErrorMedicineName(true);
      setTextSnackbar("Lỗi: Tên Thuốc không được nhập số ở ký tự đầu");
      setOpenSnackbar(true);
      
    }
    else {
      isAddNew === true
        ? createData(values, medicineDosage)
        : updateData(values, medicineDosage);
    }
  };

  const handleUpdate = (row) => {
    setIsUpdateRow(true);
    setIsAddNew(false);
    setvalues(row);
    setMedicineDosage(row.dosage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setvalues({ ...values, [name]: value });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
                title="Thông tin Thuốc"
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
                        id="medicineName"
                        name="medicineName"
                        fullWidth
                        variant="standard"
                        label="Tên Thuốc *"
                        value={values.medicineName}
                        onChange={handleChange}
                        error={isErrorMedicineName}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="medicineType"
                        name="medicineType"
                        fullWidth
                        variant="standard"
                        label="Loại Thuốc *"
                        value={values.medicineType}
                        onChange={handleChange}
                        error={isErrorMedicineType}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel id="dosageChoose">
                          Chọn liều dùng
                        </InputLabel>
                        <Select
                          labelId="dosageChoose"
                          id="medicineDosage"
                          fullWidth
                          value={medicineDosage}
                          onChange={(e) => setMedicineDosage(e.target.value)}
                          label="Liều dùng"
                          error={isErrorMedicineDosage}
                        >
                          <MenuItem
                            value={"Sáng 1 tối 1"}
                            style={{ width: "100%" }}
                          >
                            Sáng 1 tối 1
                          </MenuItem>
                          <MenuItem value={"Sáng 1"} style={{ width: "100%" }}>
                            Sáng 1
                          </MenuItem>
                          <MenuItem value={"Tối 1"} style={{ width: "100%" }}>
                            Tối 1
                          </MenuItem>
                          <MenuItem
                            value={"Chỉ uống khi đang đau"}
                            style={{ width: "100%" }}
                          >
                            Chỉ uống khi đang đau
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item>
                      <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ height: "35px" }}
                        // disabled={formik.isSubmitting}
                        // startIcon={formik.isSubmitting ? <CircularProgress size='0.9rem' /> : null}
                      >
                        {isAddNew === true ? "Tạo Thuốc" : "Cập Nhật Thuốc"}
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
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <h2>Bảng Danh Sách Thuốc</h2>
          </Grid>
          <Grid item xs={7}>
            <TextField
              sx={{ width: "100%" }}
              label="Tìm Kiếm"
              variant="outlined"
              onChange={(e) => setSearchedVal(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton color="info" onClick={() => fetchData()}>
              <RefreshIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              sx={{ width: "100%", height: "35px" }}
              disabled={isDisabled}
              onClick={() => {
                setIsDisabled(true);

                setIsAddNew(true);
                setIsUpdateRow(false);
                setvalues(initialValues);
                setMedicineDosage("");
              }}
            >
              Tạo thuốc mới
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              sx={{ width: "50%", height: "35px" }}
              disabled={!isDisabled}
              onClick={() => {
                setvalues(initialValues);
                setMedicineDosage("");
                setIsAddNew(false);
                setIsUpdateRow(false);

                setIsDisabled(false);
              }}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
        {/* <TableContainer> */}
        <Table aria-label="simple table">
          <TableHead>
            {isloading === true || medicineData.length === 0 ? (
              <TableRow>
                <TableCell></TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="right">Tên Thuốc</TableCell>
                <TableCell align="right">Loại Thuốc</TableCell>
                <TableCell align="right">Liều Dùng</TableCell>
                <TableCell></TableCell>
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
            ) : medicineData.length === 0 ? (
              <TableRow>
                <TableCell
                  sx={{ width: "100%", height: "100%" }}
                  align="center"
                >
                  Không Có Dữ Liệu
                </TableCell>
              </TableRow>
            ) : (
              medicineData
                .filter(
                  (row) =>
                    !searchedVal.length ||
                    `${row.medicineName} ${row.medicineType} ${row.dosage}`
                      .toString()
                      .toLowerCase()
                      .includes(searchedVal.toString().toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">
                      {medicineData.indexOf(row) + 1}
                    </TableCell>
                    <TableCell align="right">{row.medicineName}</TableCell>
                    <TableCell align="right">{row.medicineType}</TableCell>
                    <TableCell align="right">{row.dosage}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        sx={{ width: "100%", height: "35px" }}
                        disabled={isDisabled}
                        onClick={() => {
                          setIsDisabled(true);
                          handleUpdate(row);
                        }}
                      >
                        Cập Nhật
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        disabled={isDisabled}
                        color="info"
                        onClick={() => {
                          setRowSelectDelete(row);
                          handleClickOpenDialog();
                        }}
                      >
                        <DoDisturbOnIcon />
                      </IconButton>
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
                  // component="div"
                  count={medicineData.length}
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
        {/* </TableContainer> */}
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
            Bạn có xác nhận muốn xóa
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

export default Medicine;
