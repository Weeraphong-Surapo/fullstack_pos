import { axiosPrivate } from "../common/axiosPrivate";

export const getAllData = async () => await axiosPrivate.get("/api/order")

export const deleteData = async (id) => await axiosPrivate.delete("/api/order/" + id)