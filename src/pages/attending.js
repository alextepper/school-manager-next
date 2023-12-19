import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Card, CardContent, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StudentTable } from "src/sections/student/student-table";
import api from "src/utils/api";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Page = () => {
  const [data, setData] = useState([]); // State for storing fetched data
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const response = await api.get(`/student-profiles?is_in_school=True`);
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
        <title>{t("Attending")}</title>
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
              <Stack spacing={1}>
                <Typography variant="h4">{t("Attending")}</Typography>
              </Stack>
            </Stack>
            <Card>
              <CardContent sx={{ p: 1 }}>
                <StudentTable search={"attending"} />
              </CardContent>
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
