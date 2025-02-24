import { axiosPrivate } from "../common/axiosPrivate";
import { axiosPrivateWithImage } from "../common/axiosPrivateWithImage";

export const getAllData = async () =>
    await axiosPrivate.get("/api/user")

export const createData = async (value) =>
    await axiosPrivateWithImage.post("/api/user", value)

export const deleteData = async (id) =>
    await axiosPrivate.delete("/api/user/" + id)

export const updateData = async (value, id) =>
    await axiosPrivateWithImage.put("/api/user/" + id, value)
