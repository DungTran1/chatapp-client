import axios from "axios";
export const uploadMultiFile = async (files: File[]) => {
  try {
    let mediaFile = [];
    if (files.length > 0) {
      let uploaders;
      uploaders = files.map(async (file: File) => {
        // const type=/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(file.name)?"image":"video"
        const type = file.name.match(/.mp4/g)?.length ? "video" : "image";
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "chatApp");
        formData.append("api_key", "737159585551433");

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dk1rya6k8/${type}/upload`,
          formData
        );
        return res.data.secure_url;
      });
      mediaFile = await axios.all(uploaders);
    }
    return mediaFile;
  } catch (error) {
    console.log(error);
  }
};
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chatApp");
    formData.append("api_key", "737159585551433");
    //   formData.append("use_filename", "true");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dk1rya6k8/image/upload",
      formData
    );
    return res.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};
