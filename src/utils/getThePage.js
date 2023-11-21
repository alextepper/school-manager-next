const { useRouter } = require("next/router");

export const getThePage = (url) => {
  const router = useRouter();
  router.push(url);
};
