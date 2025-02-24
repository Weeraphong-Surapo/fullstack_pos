import React, { useEffect, useState } from 'react'
import ReportPerDay from '../components/ReportPerDay'
import { getReportDashboard } from '../api/dashboard'
import Loader from '../components/Loader'
import Form from 'react-bootstrap/Form';
import { useAtom } from 'jotai';
import { userInfo } from '../stores/user';
import ProfileUser from '../components/ProfileUser';

const optionMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
]

const Dashboard = () => {
    const [userData] = useAtom(userInfo)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [year, setYear] = useState([])
    const [defaultYear, setDefaultYear] = useState(new Date().getFullYear())
    const [defaultMonth, setDefaultMonth] = useState(new Date().getMonth() + 1)

    const loadData = async (value) => {
        try {
            setLoading(true)
            const { data } = await getReportDashboard(value)
            setData(data)
            setYear(data.optionYears)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const handleChangeYear = async (e) => {
        try {
            let yearInput = e.target.value
            setDefaultYear(yearInput)
            setDefaultMonth(month)
            await loadData({
                month: defaultMonth,
                year: yearInput
            })

        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeMonth = async (e) => {
        try {
            let monthInput = e.target.value
            setDefaultMonth(monthInput)
            await loadData({
                month: monthInput,
                year: defaultYear
            })


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadData({
            year: 2025,
            month: 2
        })
    }, [])
    return (
        <div className='mt-3'>
            {loading ?
                <Loader />
                :
                <>
                    {userData.role === "ADMIN" ?
                        <>
                            <h3>หน้าแรก</h3>
                            <div className="row gy-3">
                                {year.length !== 0 && <>
                                    <div className="col-md-6 bg-light p-3">
                                        <label htmlFor="">เลือกปี</label>
                                        <Form.Select onChange={handleChangeYear} defaultValue={defaultYear}>
                                            {year.map((item, index) =>
                                                <option key={index} value={item} >{item}</option>
                                            )}
                                        </Form.Select>
                                    </div>
                                    <div className="col-md-6 bg-light p-3">
                                        <label htmlFor="">เลือกเดือน</label>
                                        <Form.Select onChange={handleChangeMonth} defaultValue={defaultMonth}>
                                            {optionMonths.map((month, index) =>
                                                <option key={index} value={++index}>{month}</option>
                                            )}
                                        </Form.Select>
                                    </div></>}

                                <div className="col-md-4 col-12 ">
                                    <div className="card border-0 shadow" >
                                        <div className="card-body">
                                            <h5 className="card-title">สินค้า ( ทั้งหมด )</h5>
                                            <h2 className="card-subtitle mb-2 text-body-secondary">{data.countProducts} รายการ</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-12 ">
                                    <div className="card border-0 shadow" >
                                        <div className="card-body">
                                            <h5 className="card-title">พนักงาน ( ทั้งหมด )</h5>
                                            <h2 className="card-subtitle mb-2 text-body-secondary">{data.countUsers} คน</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-12 ">
                                    <div className="card border-0 shadow" >
                                        <div className="card-body">
                                            <h5 className="card-title">รายการขาย ( ทั้งหมด )</h5>
                                            <h2 className="card-subtitle mb-2 text-body-secondary">{data.countOrders} รายการ</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 col-12 ">
                                    <div className="card border-0 shadow" >
                                        <div className="card-body">
                                            <h5 className="card-title">ราคาได้เงินสด</h5>
                                            <h2 className="card-subtitle mb-2 text-body-secondary">{data.totalPriceCash} บาท</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-12 ">
                                    <div className="card border-0 shadow" >
                                        <div className="card-body">
                                            <h5 className="card-title">รายได้ QR CODE</h5>
                                            <h2 className="card-subtitle mb-2 text-body-secondary">{data.totalPriceQrcode} บาท</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-12 ">
                                    <div className="card border-0 shadow" >
                                        <div className="card-body">
                                            <h5 className="card-title">รายได้ทั้งหมด</h5>
                                            <h2 className="card-subtitle mb-2 text-body-secondary">{data.totalPrice} บาท</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ReportPerDay orderPerDays={data.orderPerDays} />
                        </>
                        :
                        <ProfileUser />
                    }
                </>
            }
        </div>
    )
}

export default Dashboard
