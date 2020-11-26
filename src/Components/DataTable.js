import { makeStyles } from '@material-ui/core/styles';

import {
  Table, TableHead, TableBody,TableCell,TableContainer,TableFooter,TablePagination,TableRow,
  Paper,IconButton
}
  from '@material-ui/core';

 const useStyles = makeStyles({
  root: {
    width: 'auto',
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    maxHeight: 440,
  },
});
function Datatable(props){
  console.log(props)
  const classes = useStyles();
  const columns = props.columns ? props.columns : [];
  const rows = props.rows ? props.rows: [];

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
            {rows.map((row, rowindex) => {
              return(
                <TableRow hover role="checkbox" tabIndex={-1} key={`dataRow-${rowindex}`}>
                  {columns.map((column) => {
                    const rowfieldVal = row[column.id];
                    // console.log(fieldVal);
                    let cellVal = '';
                    if (rowfieldVal) {
                      cellVal = column.format ? column.format(rowfieldVal) : rowfieldVal;
                    }
                    console.log(cellVal);
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
    </div>
  )
}


export default Datatable;