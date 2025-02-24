import { axiosPrivate } from "../common/axiosPrivate";

export const checkout = async (value) =>
    await axiosPrivate.post("/api/order", value)

export const getOneOrder = async (id) =>
    await axiosPrivate.get("/api/order/" + id)

export const pdfOrder = async (id) =>
    await axiosPrivate.get("/api/report-receipt/" + id)
