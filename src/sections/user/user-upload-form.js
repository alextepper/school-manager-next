// UserUploadForm.js
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import api from "src/utils/api";

const UserUploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload-users/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Users uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        variant="outlined"
        margin="normal"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        label="Upload CSV"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Upload
      </Button>
    </form>
  );
};

export default UserUploadForm;
