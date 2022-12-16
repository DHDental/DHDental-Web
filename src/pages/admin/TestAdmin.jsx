import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { axiosPrivate } from "../../api/axiosInstance";
import { BAN_OR_ACTIVE_ACCOUNT_ADMIN, CRUD_ACCOUNT_ADMIN, GET_ALL_USER_ADMIN } from "../../common/constants/apiConstants";
import { formatYearMonthDate } from "../../common/utils/formatDate";
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const user = [];

const initialValues = {
  lastName: "",
  middleName: "",
  firstName: "",
  phoneNumber: "",
  dob: null,
  address: "",
  role: "",
};

const TestAdmin = () => {
  const [staff, setStaff] = useState(user);
  const [staffFilter, setStaffFilter] = useState(user);
  const [values, setvalues] = useState(initialValues);

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const [isloading, setIsLoading] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);
  const [isUpdateRow, setIsUpdateRow] = useState(false);

  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const [selectDob, setSelectDob] = useState(null);
  const [selectRole, setSelectRole] = useState("");

  const [rowSelectStaff, setRowSelectStaff] = useState(null);
  const [searchedVal, setSearchedVal] = useState("");

  useEffect(() => {
    fetchData()
  }, []);

  // useEffect(() => {
  //   if (roleStaff === "All") {
  //     setStaff(staffFilter);
  //   } else {
  //     setStaff(staffFilter.filter((data) => data.roleName === roleStaff));
  //   }
  // }, [roleStaff, staffFilter]);

  // const filterData = async () => {
  //   const params = {};
  //   const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
  //   console.log(response);
  //   const data = [...response.data];
  //   const staffData = data.filter((data) => {
  //     return data.roleName !== "End User";
  //   });
  //   const filterData = data.filter((data) => {
  //     return data.roleName === roleStaff;
  //   });
  //   setStaffFilter(staffData);
  //   setStaff(filterData);
  // };

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
      const data = [...response.data];
      const staffData = data.filter((data) => {
        return data.roleName !== "End User";
      });
      setStaffFilter(staffData);
      setStaff(staffData);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const createStaff = async (newRow, dob, selectRole) => {
    // setIsLoading(true);
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.phoneNumber,
      dob: formatYearMonthDate(dayjs(dob, "DD/MM/YYYY")),
      address: newRow.address,
      role: selectRole,
      operationType: "C",
    };
    try {
      await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
      setvalues(initialValues);
      setSelectDob(null);
      setSelectRole("");
      setIsAddNew(false);

      setIsDisabled(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const updateStaff = async (newRow, dob, selectRole) => {
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.userName,
      dob:
        formatYearMonthDate(dayjs(dob, "DD/MM/YYYY")) === "Invalid Date"
          ? dob
          : formatYearMonthDate(dayjs(dob, "DD/MM/YYYY")),
      address: newRow.address,
      role: selectRole,
      operationType: "U",
    };
    try {
      await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
      setvalues(initialValues);
      setSelectDob(null);
      setSelectRole("");
      setIsUpdateRow(false);

      setIsDisabled(false);
      fetchData();
    } catch (error) {
      setTextSnackbar("Đã xãy ra lỗi");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const banStaff = async (newRow) => {
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

  // const handleClose = () => {
  //   setLoading(false);
  //   setOpen(false);
  // };

  // const handleAccept = () => {
  //   const index = oldRow.tableData.id;
  //   const updateRows = [...staff];
  //   updateRows[index] = updateRow;
  //   updateStaff(updateRow);
  //   if (roleStaff !== "All") {
  //     filterData();
  //   } else {
  //     setStaffFilter(updateRows);
  //     setStaff(updateRows);
  //     setLoading(false);
  //   }
  //   setUpdateRow(null);
  //   setOldRow(null);
  //   setOpen(false);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      values.lastName === "" ||
      values.middleName === "" ||
      values.firstName === "" ||
      values.address === "" ||
      values.phoneNumber === "" ||
      selectRole === "" ||
      selectDob === null
    ) {
      setTextSnackbar("Lỗi: Không được để trống");
      setOpenSnackbar(true);
    } else {
      isAddNew === true
        ? createStaff(values, selectDob, selectRole)
        : updateStaff(values, selectDob, selectRole);
    }
  };

  const handleUpdate = (row) => {
    setIsUpdateRow(true);
    setIsAddNew(false);
    setvalues(row);
    setSelectRole(row.roleName);
    setSelectDob(row.dateOfBirth);
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
    banStaff(rowSelectStaff);
    setRowSelectStaff(null);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setRowSelectStaff(null);
    setOpenDialog(false);
  };

  return (
    <>
      {isAddNew === true || isUpdateRow === true ? (
        <Box>
          <Grid container justifyContent="center">
            <Card sx={{ width: "100%" }}>
              <CardHeader
                title="Thông tin Nhân Viên"
                titleTypographyProps={{
                  align: "center",
                  fontWeight: "bold",
                }}
                subheader={isAddNew === true ? "Thêm mới" : "Cập nhật"}
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
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        id="lastName"
                        name="lastName"
                        sx={{ width: "290px" }}
                        variant="standard"
                        label="Họ Tên"
                        value={values.lastName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="middleName"
                        name="middleName"
                        sx={{ width: "290px" }}
                        variant="standard"
                        label="Tên Đệm"
                        value={values.middleName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="firstName"
                        name="firstName"
                        sx={{ width: "290px" }}
                        variant="standard"
                        label="Tên"
                        value={values.firstName}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        fullWidth
                        variant="standard"
                        label="Số điện thoại"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        disabled={isUpdateRow === true ? true : false}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="address"
                        name="address"
                        fullWidth
                        variant="standard"
                        label="Địa Chỉ"
                        value={values.address}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Ngày Sinh"
                        inputFormat="DD/MM/YYYY"
                        placeholder="DD/MM/YYYY"
                        value={selectDob}
                        onChange={(newValue) => {
                          setSelectDob(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField fullWidth variant="standard" {...params} />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel id="roleChoose">Chọn Quyền Hạng</InputLabel>
                        <Select
                          disabled={isUpdateRow === true ? true : false}
                          labelId="roleChoose"
                          id="selectRole"
                          fullWidth
                          value={selectRole}
                          onChange={(e) => setSelectRole(e.target.value)}
                          label="Quyền"
                        >
                          <MenuItem value={"Staff"} style={{ width: "100%" }}>
                            Nhân Viên
                          </MenuItem>
                          <MenuItem value={"Dentist"} style={{ width: "100%" }}>
                            Nha Sĩ
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
                      >
                        {isAddNew === true
                          ? "Thêm Nhân Viên"
                          : "Cập Nhật Nhân Viên"}
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
            <h2>Bảng Tài Khoản Nhân Sự</h2>
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
                setSelectDob(null);
                setSelectRole("");
              }}
            >
              Thêm nhân viên
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              sx={{ width: "50%", height: "35px" }}
              disabled={!isDisabled}
              onClick={() => {
                setvalues(initialValues);
                setSelectDob(null);
                setSelectRole("");

                setIsAddNew(false);
                setIsUpdateRow(false);

                setIsDisabled(false);
              }}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              {isloading === true || staff.length === 0 ? (
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
              ) : staff.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    Không Có Dữ Liệu
                  </TableCell>
                </TableRow>
              ) :(
                staff
                .filter(
                  (row) =>
                    !searchedVal.length ||
                    `${row.lastName} ${row.middleName} ${row.firstName} ${row.userName} ${row.address} ${row.status}`
                      .toString()
                      .toLowerCase()
                      .includes(searchedVal.toString().toLowerCase())
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.userName}>
                      <TableCell align="center">
                        {staff.indexOf(row) + 1}
                      </TableCell>
                      <TableCell align="right">{row.lastName}</TableCell>
                      <TableCell align="right">{row.middleName}</TableCell>
                      <TableCell align="right">{row.firstName}</TableCell>
                      <TableCell align="right">{row.userName}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">
                        {moment(row.dateOfBirth).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">{row.roleName === "Dentist"? "Nha sĩ" : "Nhân viên"}</TableCell>
                      <TableCell align="center">
                        {row.status === "Active" ? (
                          <Chip label="Active" color="success" />
                        ) : (
                          <Chip label="Inactive" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                      
                        {/* <Button
                          variant="contained"
                          sx={{ width: "100%", height: "35px" }}
                          disabled={isDisabled}
                          onClick={() => {
                            setIsDisabled(true);
                            handleUpdate(row);
                          }}
                        >
                          Cập Nhật
                        </Button> */}
                        <IconButton color= "secondary" disabled={isDisabled} onClick={() => {
                            setIsDisabled(true);
                            handleUpdate(row);
                          }}>
                            <EditRoundedIcon/>
              
            </IconButton>
                      </TableCell>
                      <TableCell align="center">
                      <IconButton color= {row.status === "Active"? "error": "success"}  disabled={isDisabled} onClick={() => {
                            setRowSelectStaff(row);
                            handleClickOpenDialog();
                          }}>
                            {row.status === "Active"
                            ? <RemoveCircleOutlineRoundedIcon />
                            : <RemoveCircleRoundedIcon/>}
              
            </IconButton>
                        {/* <Button
                          variant="contained"
                          sx={{ width: "180px", height: "35px" }}
                          disabled={isDisabled}
                          onClick={() => {
                            setRowSelectStaff(row);
                            handleClickOpenDialog();
                          }}
                        >
                          {row.status === "Active"
                            ? "Khóa Tài Khoản"
                            : "Gỡ Khóa Tài Khoản"}
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
                    5,
                    10,
                    25,
                    100,
                    { label: "Tất cả", value: -1 },
                  ]}
                    count={staff.length}
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

export default TestAdmin;
