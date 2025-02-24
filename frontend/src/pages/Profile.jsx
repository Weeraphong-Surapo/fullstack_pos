import React from 'react'
import { userInfo } from '../stores/user'
import { useAtom } from 'jotai'

const Profile = () => {
    const [userData] = useAtom(userInfo)
    return (
        <div className='pt-3'>
            <div className="d-flex justify-content-center">
                <div className="card border-0 shadow" style={{ width: "500px" }}>
                    <div className="card-header">ข้อมูลส่วนตัว</div>
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <img src={userData.image} alt="" style={{ width: "120px", height: "100px", objectFit: "contain" }} />
                        </div>
                        <hr />
                        <div className="text-center">
                            <h6>ชื่อผู้ใช้งาน : {userData.username}</h6>
                            <h6>ชื่อ - สกุล : {userData.first_name} {userData.last_name}</h6>
                            <h6>ที่อยู่ : {userData.address}</h6>
                            <h6>เบอร์โทร : {userData.phone}</h6>
                            <h6>ตำแหน่ง : {userData.role}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile