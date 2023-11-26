// src/utils/cloudinaryUpload.js
import axios from "axios";
import api from "./api";

export const cloudinaryUpload = async (file, userProfile) => {
  const url = "https://api.cloudinary.com/v1_1/dk98nlyp4/image/upload";
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

    await api.put(`/student-profile/${userProfile.id}/`, updatedData);
    return response.data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

export const cloudinaryUploadStaff = async (file, userProfile) => {
  const url = "https://api.cloudinary.com/v1_1/dk98nlyp4/image/upload";
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
  const url = "https://api.cloudinary.com/v1_1/dk98nlyp4/image/upload";
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
