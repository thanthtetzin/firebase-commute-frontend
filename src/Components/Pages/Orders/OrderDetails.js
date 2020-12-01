import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Input,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { firebaseAuth } from "../../../Firebase/init";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "moment-timezone";
import "./OrderDetails.scss";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles({
  customerCard: {
    display: "flex",
  },
  orderDetailGridContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  margin_top_20: {
    marginTop: "20px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 105,
    margin: "auto",
  },
  lineHeightZero: {
    lineHeight: "inherit",
  },
  errorInLoadOrderDetail: {
    padding: 20,
    color: "red",
    fontSize: 13,
  },
});

function OrderDetails() {
  const classes = useStyles();
  const [data, setData] = useState({
    orderInfo: null,
    orderFieldsForUpdate: {
      title: "",
      bookingDate: 0,
    },
    loadDetailError: false,
    update: {
      processing: false,
      success: false,
      showMsg: false,
    },
  });
  useEffect(() => {
    loadData();
  }, []);
  const { id } = useParams();

  const loadData = async () => {
    const client = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
      json: true,
    });
    if (id && firebaseAuth.currentUser) {
      try {
        const idToken = await firebaseAuth.currentUser.getIdToken(true);
        console.log("idToken ", idToken);
        const result = await client({
          method: "get",
          url: `/documents/orders/${id}`,
          headers: {
            AuthToken: idToken,
          },
        });
        if (result.data && Object.keys(result.data).length) {
          console.log(result.data);
          let bookingDateTimeStampVal = result.data.bookingDate._seconds
            ? result.data.bookingDate._seconds
            : result.data.bookingDate;
          if (!bookingDateTimeStampVal) {
            bookingDateTimeStampVal = 0;
          }
          if (new Date(bookingDateTimeStampVal).getTime() >= 0) {
            result.data.bookingDate = moment
              .tz(moment.unix(bookingDateTimeStampVal), moment.tz.guess())
              .format("YYYY-MM-DD");
            //result.data.bookingDate = moment(moment.unix(bookingDateTimeStampVal)).tz(moment.tz.guess()).format('YYYY-MM-DD');
          }
          data.orderFieldsForUpdate = {
            title: result.data.title,
            bookingDate: result.data.bookingDate,
          };
          data.loadDetailError = false;

          setData({ ...data, orderInfo: result.data || null });
        }
        console.log("Order Detail: ", result);
      } catch (error) {
        if (error.response) {
          console.error(
            `Error in loading Order Details: ${error.response.data}`
          );
        }
        setData({ ...data, loadDetailError: true });
      }
    }
  };

  const handleBookingDateChange = () => (event) => {
    setData({
      ...data,
      orderFieldsForUpdate: {
        title: data.orderFieldsForUpdate.title,
        bookingDate: event.target.value,
      },
    });
  };
  const handleTitleChange = () => (event) => {
    setData({
      ...data,
      orderFieldsForUpdate: {
        title: event.target.value,
        bookingDate: data.orderFieldsForUpdate.bookingDate,
      },
    });
  };
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    console.log(form.checkValidity());
    if (form.checkValidity() === false || !data.orderFieldsForUpdate) {
      event.stopPropagation();
      form.reportValidity();
    } else {
      const clonedOrderFieldsForUpdate = JSON.parse(
        JSON.stringify(data.orderFieldsForUpdate)
      );
      clonedOrderFieldsForUpdate.bookingDate = moment(
        clonedOrderFieldsForUpdate.bookingDate,
        "YYYY-MM-DD"
      ).unix();
      console.log("clonedOrderFieldsForUpdate: ", clonedOrderFieldsForUpdate);
      setData({
        ...data,
        update: {
          processing: true,
          success: false,
          showMsg: false,
        },
      });
      const axiosClient = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
        json: true,
      });
      try {
        await axiosClient({
          method: "put",
          url: `/documents/orders/${id}`,
          data: clonedOrderFieldsForUpdate,
          headers: {
            AuthToken: await firebaseAuth.currentUser.getIdToken(true),
          },
        });
        setData({
          ...data,
          update: {
            processing: false,
            success: true,
            showMsg: true,
          },
        });
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        }
        setData({
          ...data,
          update: {
            processing: false,
            success: false,
            showMsg: true,
          },
        });
      }
    }
  };
  const msgToShow = data.update.success ? (
    <p className="success-p">Success!</p>
  ) : (
    <p className="error-p">Update Failed! See console for more details.</p>
  );

  let contentToRender = null;
  if (data.loadDetailError) {
    contentToRender = (
      <p className={classes.errorInLoadOrderDetail}>
        Error in loading Order Details! Check console for more details.
      </p>
    );
  } else if (!data.loadDetailError && data.orderInfo) {
    contentToRender = (
      <Grid container className={classes.orderDetailGridContainer}>
        <Grid item className="orderDetailGrid">
          <Grid item className={classes.margin_top_20}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Card>
                <CardContent style={{ maxWidth: 380 }}>
                  <Typography component="h6" variant="h6" gutterBottom>
                    Order Details
                  </Typography>
                  <Grid item style={{ marginTop: 20 }}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="txtTitle" shrink>
                        Title
                      </InputLabel>
                      <Input
                        id="txtTitle"
                        type="text"
                        disabled={data.update.processing}
                        value={data.orderFieldsForUpdate.title}
                        onChange={handleTitleChange()}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item style={{ marginTop: 18 }}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="dtpBookingDate" shrink>
                        Booking Date
                      </InputLabel>
                      <Input
                        id="dtpBookingDate"
                        type="date"
                        disabled={data.update.processing}
                        value={data.orderFieldsForUpdate.bookingDate}
                        onChange={handleBookingDateChange()}
                      />
                    </FormControl>
                  </Grid>
                  {data.update.showMsg ? msgToShow : null}
                </CardContent>
                <CardActions>
                  <Button
                    type="submit"
                    color="primary"
                    size="small"
                    disabled={data.update.processing}
                  >
                    {data.update.processing ? "Updating..." : "Update"}
                  </Button>
                </CardActions>
              </Card>
            </form>
          </Grid>

          <Grid container>
            <Grid item style={{ marginTop: 20, marginRight: 20 }}>
              <Card className={classes.customerCard}>
                <CardMedia className={classes.cover}>
                  <PersonIcon
                    style={{ fontSize: "3.3rem" }}
                    className={classes.cover}
                  />
                </CardMedia>
                <div className={classes.details}>
                  <CardContent
                    className={classes.content}
                    style={{ minWidth: 120, minHeight: 120 }}
                  >
                    <Typography
                      className={classes.title}
                      style={{ color: "#7a9cdc", fontSize: 14 }}
                      gutterBottom
                    >
                      Customer
                    </Typography>
                    <Typography component="h6" variant="h6">
                      {data.orderInfo.customer && data.orderInfo.customer.name
                        ? data.orderInfo.customer.name
                        : "-"}
                    </Typography>
                    <Typography
                      style={{ fontSize: "14px" }}
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {data.orderInfo.customer && data.orderInfo.customer.email
                        ? data.orderInfo.customer.email
                        : "-"}
                    </Typography>
                    <Typography
                      style={{ fontSize: "14px" }}
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {data.orderInfo.customer && data.orderInfo.customer.phone
                        ? data.orderInfo.customer.phone
                        : "-"}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
            <Grid item style={{ marginTop: 20 }}>
              <Card className={classes.customerCard}>
                <CardMedia className={classes.cover}>
                  <LocationCityIcon
                    style={{ fontSize: "3.3rem" }}
                    className={classes.cover}
                  />
                </CardMedia>
                <div className={classes.details}>
                  <CardContent
                    className={classes.content}
                    style={{ minWidth: 120, minHeight: 120 }}
                  >
                    <Typography
                      className={classes.title}
                      style={{ color: "#7a9cdc", fontSize: 14 }}
                      gutterBottom
                    >
                      Address
                    </Typography>
                    <Typography
                      component="h6"
                      variant="h6"
                      style={{ fontSize: 14 }}
                    >
                      {data.orderInfo.address && data.orderInfo.address.street
                        ? data.orderInfo.address.street
                        : "-"}
                    </Typography>
                    <Typography
                      style={{ fontSize: "14px" }}
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {data.orderInfo.address && data.orderInfo.address.city
                        ? data.orderInfo.address.city
                        : "-"}
                      {data.orderInfo.address && data.orderInfo.address.zip
                        ? ` ${data.orderInfo.address.zip}`
                        : " -"}
                    </Typography>
                    <Typography
                      style={{ fontSize: "14px" }}
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {data.orderInfo.address && data.orderInfo.address.country
                        ? data.orderInfo.address.country
                        : "-"}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return contentToRender;
}
export default OrderDetails;
