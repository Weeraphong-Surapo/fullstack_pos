import { axiosPrivate } from "../common/axiosPrivate";

export const getAllData = async () =>
    await axiosPrivate.get("/api/type")

export const createData = async (value) =>
    await axiosPrivate.post("/api/type", value)

export const deleteData = async (id) =>
    await axiosPrivate.delete("/api/type/" + id)

export const updateData = async (value, id) =>
    await axiosPrivate.put("/api/type/" + id, value)
