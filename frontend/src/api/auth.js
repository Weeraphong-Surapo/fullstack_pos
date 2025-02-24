import { axiosPrivate } from "../common/axiosPrivate";

export const login = async (value) =>
    await axiosPrivate.post("/api/login", value)

export const profile = async () =>
    await axiosPrivate.get("/api/profile")