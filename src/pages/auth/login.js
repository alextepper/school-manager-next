import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import api from "src/utils/api";

const Page = () => {
  const router = useRouter();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const auth = useAuth();
  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "marka@mark.com",
      password: "asdasdasd12",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log(values);
      try {
        await auth.signIn(values.email, values.password);
        router.push("/students");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/password_reset/", { email: resetEmail });
      console.log(resetEmail);
      setResetMessage("Check your email for the reset link.");
      // Optionally, hide the form after successful submission
    } catch (error) {
      setResetMessage("Error sending email.");
    }
  };

  const handleMethodChange = useCallback((event, value) => {
    setShowPasswordReset(value);
  }, []);

  return (
    <>
      <Head>
        <title>עזור אישי | RKZ-Solutions</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">קניסה לחשבון</Typography>
              <Typography color="text.secondary" variant="body2">
                אין עדיין לך חשבון? תפנה למדריך שלך
                {/* Don&apos;t have an account? Contact your Instructor. */}
              </Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={showPasswordReset}>
              <Tab sx={{ mx: 2 }} label="כניסה" value={false} />
              <Tab sx={{ mx: 2 }} label="איפוס סיסמה" value={true} />
            </Tabs>
            {!showPasswordReset && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="אימייל"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="סיסמה"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                  להמשיך
                </Button>
              </form>
            )}
            {showPasswordReset && (
              <form noValidate onSubmit={handlePasswordResetSubmit}>
                <TextField
                  fullWidth
                  label="אימייל"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  type="email"
                  sx={{ mt: 3 }}
                />
                {resetMessage && (
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    {resetMessage}
                  </Typography>
                )}
                <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                  לאפס סיסמה
                </Button>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
