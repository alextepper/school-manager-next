const { default: styled } = require("@emotion/styled");
const { Avatar } = require("@mui/material");

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));
