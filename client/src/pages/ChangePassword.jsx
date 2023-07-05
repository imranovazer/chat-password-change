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
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contex/AuthContext";

const ChangePassword = () => {
  const { handlerLogInOut, loggedIn } = useContext(AuthContext);
  const location = useLocation();

  const params = useSearchParams();
  console.log(params);

  // const { state } = useLocation();
  const navigate = useNavigate();
  //use Formik
  const { handleSubmit, handleChange, touched, values, errors } = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: async ({ password }, bag) => {
      try {
        const searchParams = new URLSearchParams(location.search);

        const userId = searchParams.get("userId");
        const token = searchParams.get("token");
        const res = await axios.post(
          "http://localhost:8080/api/webuser/change-password",
          {
            userId,
            token,
            password,
          }
        );
        // const { token } = res.data;
        alert("Your password changed successfully");
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
            New password
          </Typography>
          <Typography variant="caption">Enter new password</Typography>
        </Grid>
        <Grid>
          {errors.general && <Alert severity="error">{errors.general}</Alert>}
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="text"
            name="password"
            label="New password"
            variant="standard"
            placeholder="Enter new password"
            onChange={handleChange}
            value={values.password}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
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

export default ChangePassword;
