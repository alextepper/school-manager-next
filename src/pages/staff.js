import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Card, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import api from "src/utils/api";
import { StaffTable } from "src/sections/staff/staff-table";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Page = () => {
  const [data, setData] = useState([]); // State for storing fetched data
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const response = await api.get(`/staff-list/`);
        setData(response.data.results); // Set fetched data to state
      } catch (err) {
        console.error("Error fetching student profiles:", err);
        // Handle error appropriately
      }
    };

    fetchStudentList();
  }, []);

  return (
    <>
      <Head>
        <title>{t("Staff")}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl" sx={{ px: 0 }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{t("Staff")}</Typography>
              </Stack>
            </Stack>
            <Card>
              <StaffTable items={data} />
            </Card>
          </Stack>
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
