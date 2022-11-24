import React, { useEffect, useState } from 'react'
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
import { axiosPrivate } from '../../../api/axiosInstance';
import { GET_ALL_SERVICES } from '../../../common/constants/apiConstants';

const service = [
    {
      maDichVu: "123456",
      tenDichVu: "Trám Răng",
      chiPhi: "12200000",
    },
  ];

  export const formatNumber = inputNumber => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let splitArray=formetedNumber.split('.');
    if(splitArray.length>1){
      formetedNumber=splitArray[0];
    }
    return(formetedNumber);
  };

const ServiceTable = (props) => {
  const [serviceData, setServiceData] = useState(service);
  const [serviceFilter, setServiceFilter] = useState(service);
  const [searched, setSearched] = useState("");

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

    // const columnsService = [
    //     { title: "Mã Dịch Vụ", field: "maDichVu", editable: "never"  },
    //     { title: "Tên Dịch Vụ", field: "tenDichVu" },
    //     { title: "Giá", field: "chiPhi", render: (rowData) =>
    //     formatNumber(rowData.chiPhi) + " VND", },
    //   ];

    useEffect(() => {
      setServiceFilter(props.serviceData);
      setServiceData(props.serviceData);
    }, [props.serviceData]);

    const fetchData = async () => {
      // setLoading(true);
      const params = {};
      const response = await axiosPrivate.post(GET_ALL_SERVICES, params);
      // console.log(response);
      const data = [...response.data];
      setServiceData(data);
      // setLoading(false);
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
        <Grid sx={{ flexGrow: 1 }} container direction="row" justifyContent="center" alignItems="center">
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
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Số Thứ Tự</TableCell>
                <TableCell align="right">Mã Dịch Vụ</TableCell>
                <TableCell align="right">Tên Dịch Vụ</TableCell>
                <TableCell align="right">Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">
                      {serviceData.indexOf(row) + 1}
                    </TableCell>
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.serviceDesc}</TableCell>
                    <TableCell align="right">{formatNumber(row.expectedPrice)} VND</TableCell>
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
          count={serviceData.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default ServiceTable
