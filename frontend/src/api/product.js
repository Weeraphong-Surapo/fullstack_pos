import { axiosPrivate } from "../common/axiosPrivate";
import { axiosPrivateWithImage } from "../common/axiosPrivateWithImage";


export const getAllData = async (page =null) =>
    await axiosPrivate.get("/api/product?page=" + page)

export const createData = async (value) =>
    await axiosPrivateWithImage.post("/api/product", value)

export const deleteData = async (id) =>
    await axiosPrivate.delete("/api/product/" + id)

export const updateData = async (value, id) =>
    await axiosPrivateWithImage.put("/api/product/" + id, value)
