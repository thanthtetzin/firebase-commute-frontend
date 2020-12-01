import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Grid,
  CircularProgress
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { Link } from "react-router-dom";
import { firebaseAuth } from "../../Firebase/init";
import axios from "axios";
import DescriptionIcon from "@material-ui/icons/Description";
import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@material-ui/icons";
import "./DataTable.scss";

const useStyles = makeStyles(() => ({
  root: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    minHeight: 580,
  },
  center: {
    position: "absolute",
    left: "47%",
  },
  spinnerRoot: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  errorAlert: {
    width: 400,
    position: 'absolute',
    top: '50%',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  }
}));

function Datatable(props) {
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
    error: false
  });
  //let data.isLoading = useRef(true);
  let prevButtonDisable = useRef(false);
  let nextButtonDisable = useRef(false);
  const prevFirstItemInRows = useRef(null);
  const prevFirstItems = useRef([]);

  const pushToPrevFirsItems = (data) => {
    if (
      !prevFirstItems.current.some(
        (f) => f.firstItemInRows === data.firstItemInRows
      )
    ) {
      prevFirstItems.current.push(data);
    }
  };

  const handleNextButtonClick = (event) => {
    prevFirstItemInRows.current = data.listData.firstItemInRows;
    if (data.listData.lastItemInRows) {
      const searchParamsCopy = JSON.parse(JSON.stringify(data.searchParams));
      searchParamsCopy.startAfter = data.listData.lastItemInRows;

      if (searchParamsCopy.startAt) {
        delete searchParamsCopy.startAt;
      }
      data.isLoading = true;
      setData({ ...data, searchParams: searchParamsCopy || null });
    }
  };
  const handlePrevButtonClick = (event) => {
    console.log(data.listData);
    if (!data.listData.firstItemInRows && data.listData.rows.length) {
      return;
    }
    const prevFirstItemInfo = data.listData.rows.length
      ? prevFirstItems.current.find(
          (f) => f.firstItemInRows === data.listData.firstItemInRows
        )
      : prevFirstItems.current[prevFirstItems.current.length - 1];
    if (prevFirstItemInfo && prevFirstItemInfo.prevFirstItem) {
      const searchParamsCopy = JSON.parse(JSON.stringify(data.searchParams));
      searchParamsCopy.startAt = prevFirstItemInfo.prevFirstItem;

      if (searchParamsCopy.startAfter) {
        delete searchParamsCopy.startAfter;
      }
      data.isLoading = true;
      setData({ ...data, searchParams: searchParamsCopy || null });
    }
  };
  const handlePrevNextButtonDisable = () => {
    console.log(data.listData.firstItemInRows);

    const prevFirstItemInfo = prevFirstItems.current.find(
      (f) => f.firstItemInRows === data.listData.firstItemInRows
    );
    prevButtonDisable.current =
      (prevFirstItemInfo && !prevFirstItemInfo.prevFirstItem) || data.isLoading
        ? true
        : false;
    nextButtonDisable.current =
      data.listData.rows.length < data.searchParams.limit || data.isLoading
        ? true
        : false;
  };

  const loadData = async () => {
    const axiosClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
      json: true,
    });
    if (firebaseAuth.currentUser && apiEndPoint) {
      try {
        const idToken = await firebaseAuth.currentUser.getIdToken(true);
        console.log('Id_Token: ' , idToken);
        const dataResult = await axiosClient({
          method: "get",
          url: `${apiEndPoint}${JSON.stringify(data.searchParams)}`,
          headers: {
            AuthToken: idToken,
          },
        });

        const rows = dataResult.data;
        const newListData = {
          rows: rows,
          firstItemInRows: rows.length ? rows[0].docId : null,
          lastItemInRows:
            rows.length && rows[rows.length - 1]
              ? rows[rows.length - 1].docId
              : null,
        };

        pushToPrevFirsItems({
          firstItemInRows: newListData.firstItemInRows,
          prevFirstItem: prevFirstItemInRows.current,
        });
        console.log("prevFirstItems: ", prevFirstItems.current);
        console.log("rows: ", newListData.rows);

        data.isLoading = false;
        setData({ ...data, listData: newListData || null });
        //setData({ ...data, firstItemInRows: rows.length ? rows[0].docId : null });
        //setData({ ...data, lastItemInRows: rows.length && dataResult.data[dataResult.data.length - 1] ?  dataResult.data[dataResult.data.length - 1].docId : null });
      } catch (error) {
        if (error.response) {
          console.error(`Error in getting orders: ${error.response.data}`);
          setData({ ...data, error: true || null });
        }
      }
    }
  };

  useEffect(() => {
    // This effect dependes on data.searchParams state val
    loadData();
  }, [data.searchParams]);

  handlePrevNextButtonDisable();

  const rowsLoadedTable = (
    <TableBody>
      {data.listData.rows.map((row, rowindex) => {
        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={`dataRow-${rowindex}`}
          >
            {columns.map((column) => {
              if (column.id === "action") {
                let actionElements = [];
                column.items.forEach((actionItem) => {
                  switch (actionItem.name) {
                    case "View":
                      actionElements.push(
                        <Link
                          title="View Details"
                          to={`${actionItem.editDataPath}${row.docId}`}
                          key={`dataRow-${rowindex}-dataCell-${column.id}-${actionItem.name}`}
                          target="_blank"
                        >
                          <DescriptionIcon
                            color="action"
                            style={{ fontSize: "1.2rem" }}
                          />
                        </Link>
                      );
                      break;
                    default:
                      break;
                  }
                });
                return (
                  <TableCell key={`dataRow-${rowindex}-dataCell-${column.id}`}>
                    {actionElements}
                  </TableCell>
                );
              } else {
                const rowfieldVal = row[column.id];
                let cellVal = "";
                if (rowfieldVal) {
                  cellVal = column.format
                    ? column.format(rowfieldVal)
                    : rowfieldVal;
                }
                return (
                  <TableCell key={`dataRow-${rowindex}-dataCell-${column.id}`}>
                    {cellVal}
                  </TableCell>
                );
              }
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
  const spinnner = (
    <div className={classes.spinnerRoot}>
      <CircularProgress />
    </div>
  );
  const errorAlertMsg = (
    <div className={classes.errorAlert}>
      <Alert variant="outlined" severity="error">
        Error in loading data! Check console for details & try again.
      </Alert>
    </div> 
  );
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
        {data.isLoading && !data.error ? spinnner : null}
        {data.error ? errorAlertMsg : null}
      </TableContainer>
      {prevFirstItems.current.length ? (
        <Grid item className={classes.center}>
          <IconButton
            disabled={prevButtonDisable.current}
            onClick={handlePrevButtonClick}
            aria-label="previous page"
            color="primary"
          >
            <KeyboardArrowLeftRounded />
          </IconButton>
          <IconButton
            disabled={nextButtonDisable.current}
            onClick={handleNextButtonClick}
            aria-label="next page"
            color="primary"
          >
            <KeyboardArrowRightRounded />
          </IconButton>
        </Grid>
      ) : null}
    </div>
  );
}

export default Datatable;
