import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import { paperStyle } from "./Auth/AuthStyles";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contex/AuthContext";

const ForgotPassword = () => {
  const { handlerLogInOut, loggedIn } = useContext(AuthContext);

  // const { state } = useLocation();
  const navigate = useNavigate();
  //use Formik
  const { handleSubmit, handleChange, touched, values, errors } = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async ({ email }, bag) => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/webuser/forgot-password",
          {
            email,
          }
        );
        // const { token } = res.data;
        alert("Please check your email");
        navigate("/");
        // handlerLogInOut(true, navigate("/"), token);
      } catch (error) {
        bag.setErrors({ general: error.response.data.message });
      }
    },
  });

  return !loggedIn ? (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid textAlign="center" marginBottom={2}>
          <Typography variant="h5" fontWeight="bold">
            Forgot password ?
          </Typography>
          <Typography variant="caption">Enter your registered email</Typography>
        </Grid>
        <Grid>
          {errors.general && <Alert severity="error">{errors.general}</Alert>}
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            name="email"
            label="Email"
            variant="standard"
            placeholder="Enter your email"
            onChange={handleChange}
            value={values.email}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <Grid marginTop={3}>
            <Button
              fullWidth
              textAlign="center"
              type="submit"
              variant="contained"
            >
              Confirm
            </Button>
          </Grid>
        </form>
      </Paper>
    </Grid>
  ) : (
    <Navigate to="/" />
  );
};

export default ForgotPassword;
