import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useEffect, useState } from "react";
import { TeamCard } from "src/sections/team/team-card";
import api from "src/utils/api";
import TeamCreationForm from "src/sections/team/team-creation-form";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Page = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]); // State for storing fetched data
  const [openDialog, setOpenDialog] = useState(false);

  const fetchStudentList = async () => {
    try {
      const response = await api.get(`/teams/`);
      setData(response.data.results);
    } catch (err) {
      console.error("Error fetching student profiles:", err);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    if (!openDialog) {
      // Refresh the page (re-fetch the data) when openDialog is set to false
      fetchStudentList();
    }
  }, [openDialog]);

  return (
    <>
      <Head>
        <title>{t("Teams")} | RKZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack direction="row" spacing={1}>
                <Typography variant="h4">{t("Teams")}</Typography>
                <IconButton color="primary" onClick={() => setOpenDialog(true)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                  <TeamCreationForm setOpenDialog={setOpenDialog} />
                </DialogContent>
              </Dialog>
            </Stack>
            <Grid container spacing={3}>
              {data.map((team) => (
                <Grid xs={6} sm={4} md={3} key={team.id} sx={{ p: [0.2, 0.5, 1, 2] }}>
                  <TeamCard team={team} />
                </Grid>
              ))}
            </Grid>
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination count={3} size="small" />
            </Box> */}
          </Stack>
          {/* <Button
            sx={{ ml: "0 !important" }}
            variant="contained"
            onClick={() => setOpenDialog(true)}
          >
            {t("Add")}
          </Button> */}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
