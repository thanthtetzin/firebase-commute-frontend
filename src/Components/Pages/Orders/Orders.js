import { makeStyles } from "@material-ui/core/styles";
import DataTable from "../../SharedComponent/DataTable";
import moment from "moment";
import "moment-timezone";

const useStyles = makeStyles(() => ({
  orderH3: {
    paddingTop: "10px",
    paddingLeft: "20px",
  },
}));
function Orders() {
  const classes = useStyles();
  const columns = [
    { id: "docId", label: "ID", minWidth: 170 },
    { id: "title", label: "Title", minWidth: 170 },
    {
      id: "bookingDate",
      label: "Booking Date",
      minWidth: 100,
      format: (value) => {
        const timeStampVal = value._seconds ? value._seconds : value;
        if (new Date(timeStampVal).getTime() > 0) {
          return moment(moment.unix(timeStampVal))
            .tz(moment.tz.guess())
            .format("DD.MM.YYYY");
        } else {
          return null;
        }
      },
    },
    {
      id: "address",
      label: "Address",
      minWidth: 100,
      format: (value) => (value.street ? value.street : ""),
    },
    {
      id: "customer",
      label: "Customer",
      minWidth: 100,
      format: (value) => (value.name ? value.name : ""),
    },
    {
      id: "action",
      label: "",
      minWidth: 50,
      items: [
        {
          name: "View",
          editDataPath: "/orders/view/",
        },
      ],
    },
  ];
  const searchParams = {
    collectionName: "orders",
    filters: [],
    orderBy: {
      fieldName: "bookingDate",
      direction: "desc",
      mockValueIfNotFoundInDoc: {
        integerValue: "0",
        valueType: "integerValue",
      },
    },
    limit: 10,
  };
  const apiEndPoint = "/documents/?searchParams=";

  return (
    <div>
      <h3 className={classes.orderH3}>Orders</h3>
      <DataTable
        columns={columns}
        searchParams={searchParams}
        apiEndPoint={apiEndPoint}
      />
    </div>
  );
}
export default Orders;
