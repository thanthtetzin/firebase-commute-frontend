import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useRef, useEffect } from 'react';
import {
  Table, TableHead, TableBody,TableCell,TableContainer,TableFooter,TablePagination,TableRow,
  Paper,IconButton, Grid, CircularProgress
}

from '@material-ui/core';
import { Link } from 'react-router-dom';

import { firebaseAuth } from "../Firebase/init";
import axios from 'axios';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DescriptionIcon from '@material-ui/icons/Description';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@material-ui/icons';
import _get from 'lodash/get';
import "./DataTable.scss";

const useStyles = makeStyles(() => ({
  root: {
    width: 'auto',
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    minHeight: 580,
  },
  center: {
    position: "absolute",
    left: '47%'
  },
  spinnerRoot: {
    position: "absolute",
    top: "50%",
    left: '50%',
  },
}));

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
    },
    isLoading: true,
  });
  //let data.isLoading = useRef(true);
  let prevButtonDisable = useRef(false);
  let nextButtonDisable = useRef(false);
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
      data.isLoading = true;
      setData({ ...data, searchParams: searchParamsCopy || null });
    }
  };
  const handlePrevButtonClick = (event) => {
    console.log(data.listData)
    if(!data.listData.firstItemInRows && data.listData.rows.length) {
      return;
    }
    const prevFirstItemInfo = data.listData.rows.length ? 
                              prevFirstItems.current.find(f => f.firstItemInRows === data.listData.firstItemInRows) :
                              prevFirstItems.current[prevFirstItems.current.length - 1];
    if(prevFirstItemInfo && prevFirstItemInfo.prevFirstItem){
      const searchParamsCopy = JSON.parse(JSON.stringify(data.searchParams));
      searchParamsCopy.startAt = prevFirstItemInfo.prevFirstItem;

      if(searchParamsCopy.startAfter){
        delete searchParamsCopy.startAfter;
      }
      data.isLoading = true;
      setData({ ...data, searchParams: searchParamsCopy || null });
    }
  };
  const handlePrevNextButtonDisable = () => {
    console.log(data.listData.firstItemInRows)

    const prevFirstItemInfo = prevFirstItems.current.find(f => f.firstItemInRows === data.listData.firstItemInRows);
    prevButtonDisable.current = (prevFirstItemInfo && !prevFirstItemInfo.prevFirstItem) || data.isLoading ? true : false;
    nextButtonDisable.current = data.listData.rows.length < data.searchParams.limit || data.isLoading ? true : false;
  }
  
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
          firstItemInRows: rows.length ? rows[0].docId : null,
          lastItemInRows: rows.length && rows[rows.length - 1] ? rows[rows.length - 1].docId : null
        }

        pushToPrevFirsItems({
          firstItemInRows: newListData.firstItemInRows,
          prevFirstItem: prevFirstItemInRows.current
        });
        console.log('prevFirstItems: ', prevFirstItems.current);
        console.log('rows: ', newListData.rows)

        data.isLoading = false;
        setData({ ...data, listData: newListData || null });
        //setData({ ...data, firstItemInRows: rows.length ? rows[0].docId : null });
        //setData({ ...data, lastItemInRows: rows.length && dataResult.data[dataResult.data.length - 1] ?  dataResult.data[dataResult.data.length - 1].docId : null });
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
  
  handlePrevNextButtonDisable();
  
  const rowsLoadedTable = <TableBody>
      {data.listData.rows.map((row, rowindex) => {
        return(
          <TableRow hover role="checkbox" tabIndex={-1} key={`dataRow-${rowindex}`}>
            {columns.map((column) => {
              if(column.id === 'action'){
                let actionElements = [];
                column.items.forEach((actionItem) => {
                  switch(actionItem.name){
                    case 'Edit':
                      // actionElements.push(<a title="View Details" href={`${actionItem.editDataPath}${row.docId}`} key={`dataRow-${rowindex}-dataCell-${column.id}-${actionItem.name}`}>
                      //                       <DescriptionIcon color="action" style={{fontSize: '1.2rem'}} />
                      //                     </a>);
                      
                      actionElements.push(<Link title="View Details" to={`${actionItem.editDataPath}${row.docId}`} 
                                            key={`dataRow-${rowindex}-dataCell-${column.id}-${actionItem.name}`}
                                            target="_blank"
                                          >
                                            <DescriptionIcon color="action" style={{fontSize: '1.2rem'}} />
                                          </Link>);
                      break;
                    default:
                      break;
                  }
                  
                });
                return (
                  <TableCell key={`dataRow-${rowindex}-dataCell-${column.id}`} >
                    {actionElements}
                  </TableCell>
                );
              } 
              else {
                const rowfieldVal = row[column.id];
                let cellVal = '';
                if (rowfieldVal) {
                  cellVal = column.format ? column.format(rowfieldVal) : rowfieldVal;
                }
                return(
                  <TableCell key={`dataRow-${rowindex}-dataCell-${column.id}`} >
                    {cellVal}
                  </TableCell>
                );
              }
            })}
          </TableRow>
        );
      })}
    </TableBody>;
  const spinnner = <div className={classes.spinnerRoot}><CircularProgress /></div>
  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" id="dataTable">
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
          
          {!data.isLoading ? rowsLoadedTable : null}
          
        </Table>
        {data.isLoading ? spinnner : null }
      </TableContainer>
      {
        prevFirstItems.current.length ?
        <Grid item className={classes.center}>
          <IconButton disabled={prevButtonDisable.current} onClick={handlePrevButtonClick} aria-label="previous page" color="primary">
            <KeyboardArrowLeftRounded />
          </IconButton>
          <IconButton disabled={nextButtonDisable.current} onClick={handleNextButtonClick} aria-label="next page" color="primary">
            <KeyboardArrowRightRounded />
          </IconButton>
        </Grid>
       :
       null
      }
    </div>
  )
}
  


export default Datatable;