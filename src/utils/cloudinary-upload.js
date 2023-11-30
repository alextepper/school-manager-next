// src/utils/cloudinaryUpload.js
import axios from "axios";
import api from "./api";

export const cloudinaryUpload = async (file, userProfile) => {
  const formData = new FormData();
  formData.append("file", file);

  if (userProfile) {
    // Including user profile data if available
    formData.append("userProfile", JSON.stringify(userProfile));
  }

  try {
    // Replace with your Django backend endpoint
    const response = await api.post("/upload_to_cloudinary/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url; // URL of the uploaded image from your backend
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const cloudinaryUploadStaff = async (file, userProfile) => {
  const url = process.env.NEXT_PUBLIC_CLOUDINARY_API_URL;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "shze0xft");

  if (userProfile) {
    const fullName = userProfile.id + userProfile.first_name + userProfile.last_name;
    formData.append("public_id", fullName);
  }

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updatedData = {
      avatar: response.data.secure_url,
    };

    await api.put(`/staff-profile/${userProfile.id}/`, updatedData);
    return response.data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

export const cloudinaryUploadTeam = async (file, userProfile) => {
  const url = process.env.NEXT_PUBLIC_CLOUDINARY_API_URL;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "shze0xft");

  if (userProfile) {
    const fullName = userProfile.id + userProfile.name + "group";
    formData.append("public_id", fullName);
  }

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updatedData = {
      avatar: response.data.secure_url,
      name: userProfile.name,
    };

    await api.put(`/team/${userProfile.id}/`, updatedData);
    return response.data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};
