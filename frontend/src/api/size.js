import { axiosPrivate } from "../common/axiosPrivate";

export const getAllData = async () =>
    await axiosPrivate.get("/api/size")

export const createData = async (value) =>
    await axiosPrivate.post("/api/size", value)

export const deleteData = async (id) =>
    await axiosPrivate.delete("/api/size/" + id)

export const updateData = async (value, id) =>
    await axiosPrivate.put("/api/size/" + id, value)
