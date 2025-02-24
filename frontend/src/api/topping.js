import { axiosPrivate } from "../common/axiosPrivate";

export const getAllData = async () =>
    await axiosPrivate.get("/api/topping")

export const createData = async (value) =>
    await axiosPrivate.post("/api/topping", value,{})

export const deleteData = async (id) =>
    await axiosPrivate.delete("/api/topping/" + id)

export const updateData = async (value, id) =>
    await axiosPrivate.put("/api/topping/" + id, value)
