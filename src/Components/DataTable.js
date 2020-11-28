import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useRef, useEffect } from 'react';
import {
  Table, TableHead, TableBody,TableCell,TableContainer,TableFooter,TablePagination,TableRow,
  Paper,IconButton, Grid
}
from '@material-ui/core';
import { firebaseAuth } from "../Firebase/init";
import axios from 'axios';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import _get from 'lodash/get';

const useStyles = makeStyles({
  root: {
    width: 'auto',
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    //maxHeight: 460,
  },
  center: {
    textAlign: 'center'
  }
});

function Datatable(props){
  const classes = useStyles();
  const columns = props.columns ? props.columns : [];
  const apiEndPoint = props.apiEndPoint || null;
  const [data, setData] = useState({
    searchParams: props.searchParams || null,
    listData: {
      rows: [],
      firstItemInRows: null,
      lastItemInRows: null,
    }
  });
  let isLoading = useRef(true);
  const prevFirstItemInRows = useRef(null);
  const prevFirstItems = useRef([]);

  const pushToPrevFirsItems = (data) => {
    if(!prevFirstItems.current.some(f => f.firstItemInRows === data.firstItemInRows)){
      prevFirstItems.current.push(data);
    }
  }

  const handleNextButtonClick = (event) => {
    prevFirstItemInRows.current = data.listData.firstItemInRows;
    if(data.listData.lastItemInRows){
      const searchParamsCopy = JSON.parse(JSON.stringify(data.searchParams));
      searchParamsCopy.startAfter = data.listData.lastItemInRows;

      if(searchParamsCopy.startAt){
        delete searchParamsCopy.startAt;
      }
      isLoading = true;
      setData({ ...data, searchParams: searchParamsCopy || null });
    }
  };
  const handlePrevButtonClick = (event) => {
    if(!data.listData.firstItemInRows) {
      return;
    }
    const prevFirstItemInfo = prevFirstItems.current.find(f => f.firstItemInRows === data.listData.firstItemInRows);
    if(prevFirstItemInfo && prevFirstItemInfo.prevFirstItem){
      const searchParamsCopy = JSON.parse(JSON.stringify(data.searchParams));
      searchParamsCopy.startAt = prevFirstItemInfo.prevFirstItem;

      if(searchParamsCopy.startAfter){
        delete searchParamsCopy.startAfter;
      }
      isLoading = true;
      setData({ ...data, searchParams: searchParamsCopy || null });
    }
  };
  
  const loadData = async () => {
    const axiosClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
      json: true
    })
    if (firebaseAuth.currentUser && apiEndPoint) {
      try{
        const idToken = await firebaseAuth.currentUser.getIdToken(true);
        const dataResult = await axiosClient({
          method: 'get',
          url: `${apiEndPoint}${JSON.stringify(data.searchParams)}`,
          headers: {
            'AuthToken': idToken
          }
        });
        
        const rows = dataResult.data;
        const newListData = {
          rows: rows,
          firstItemInRows: rows.length ? rows[0].uid : null,
          lastItemInRows: rows.length && rows[rows.length - 1] ? rows[rows.length - 1].uid : null
        }
        pushToPrevFirsItems({
          firstItemInRows: newListData.firstItemInRows,
          prevFirstItem: prevFirstItemInRows.current
        });
        console.log('prevFirstItems: ', prevFirstItems.current);
console.log(rows)
        isLoading = false;
        setData({ ...data, listData: newListData || null });
        //setData({ ...data, firstItemInRows: rows.length ? rows[0].uid : null });
        //setData({ ...data, lastItemInRows: rows.length && dataResult.data[dataResult.data.length - 1] ?  dataResult.data[dataResult.data.length - 1].uid : null });
      }
      catch(error){
        console.error(`Error when calling to get orders: ${error.message}`);
      }
    }
  }
  useEffect(() => {
    // Using an IIFE
    (async function anyNameFunction() {
      await loadData();
    })();
  }, [data.searchParams]);
  

  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow key={`columnLabelsRow`}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.listData.rows.map((row, rowindex) => {
              return(
                <TableRow hover role="checkbox" tabIndex={-1} key={`dataRow-${rowindex}`}>
                  {columns.map((column) => {
                    const rowfieldVal = row[column.id];
                    // console.log(rowfieldVal)
                    // console.log(fieldVal);
                    let cellVal = '';
                    if (rowfieldVal) {
                      cellVal = column.format ? column.format(rowfieldVal) : rowfieldVal;
                    }
                    // console.log(cellVal);
                    return(
                      <TableCell key={`dataRow-${rowindex}-dataCell-${column.id}`} >
                        {cellVal}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        data.listData.rows.length ?
        <Grid item className={classes.center}>
          <IconButton onClick={handlePrevButtonClick} aria-label="previous page" color="primary">
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={handleNextButtonClick} aria-label="next page" color="primary">
            <KeyboardArrowRight />
          </IconButton>
        </Grid>
       :
       null
      }
    </div>
  )
}


export default Datatable;