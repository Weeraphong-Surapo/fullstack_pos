import { axiosPrivate } from "../common/axiosPrivate";

export const getReportDashboard = async (value) =>
    await axiosPrivate.post("/api/report-dashboard", value)