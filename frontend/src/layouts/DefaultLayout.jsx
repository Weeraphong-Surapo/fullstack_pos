import React from 'react'
import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import { userInfo } from '../stores/user';
import { useAtom } from 'jotai';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmation, alertMsg } from '../utils/SweetAlert';

const DefaultLayout = ({ children }) => {
    const [userData] = useAtom(userInfo)
    const pathName = useLocation().pathname
    const navigate = useNavigate()

    const handleLogout = () => {
        confirmation("ต้องการออกจากระบบ?").then(async (result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                alertMsg("ออกจากระบบสำเร็จ")
                navigate("/login")
            }
        })
    }
    return (
        <div>
            <div className="offcanvas offcanvas-start" style={{ width: "250px" }} tabIndex="-1" id="offcanvas" data-bs-keyboard="false"
                data-bs-backdrop="true">
                <div className="offcanvas-header">
                    <h6 className="offcanvas-title d-none d-sm-block" id="offcanvas">เมนูระบบ ( {userData.role === "ADMIN" ? "ผู้ดูแล" : "พนักงาน"} )</h6>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body px-0">
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start ps-4" id="menu">
                        <li className={`nav-item w-100 ${pathName === '/' && 'bg-primary'}`}>
                            <Link to="/" className={`nav-link text-truncate  ${pathName === '/' && 'text-white'}`}>
                                <i className="fs-5 bi-house"></i><span className="ms-3 ">หน้าแรก</span>
                            </Link>
                        </li>
                        <li className={`nav-item w-100 ${pathName === '/pos' && 'bg-primary'}`}>
                            <Link to="/pos" className={`nav-link text-truncate  ${pathName === '/pos' && 'text-white'}`}>
                                <i className="bi bi-shop fs-5"></i><span className="ms-3">ขายสินค้า</span> </Link>
                        </li>

                        {userData.role === "ADMIN" &&
                            <>
                                <li className={`nav-item w-100 ${pathName === '/products' && 'bg-primary'}`}>
                                    <Link to="/products" className={`nav-link text-truncate  ${pathName === '/products' && 'text-white'}`}>
                                        <i className="bi bi-archive fs-5"></i><span className="ms-3">จัดการสินค้า</span></Link>
                                </li>
                                <li className={`nav-item w-100 ${pathName === '/sizes' && 'bg-primary'}`}>
                                    <Link to="/sizes" className={`nav-link text-truncate  ${pathName === '/sizes' && 'text-white'}`}>
                                        <i className="fs-5 bi-grid"></i><span className="ms-3">จัดการไซส์</span></Link>
                                </li>
                                <li className={`nav-item w-100 ${pathName === '/types' && 'bg-primary'}`}>
                                    <Link to="/types" className={`nav-link text-truncate  ${pathName === '/types' && 'text-white'}`}>
                                        <i className="bi bi-bookmarks fs-5"></i><span className="ms-3">จัดการประเภท</span> </Link>
                                </li>
                                <li className={`nav-item w-100 ${pathName === '/toppings' && 'bg-primary'}`}>
                                    <Link to="/toppings" className={`nav-link text-truncate  ${pathName === '/toppings' && 'text-white'}`}>
                                        <i className="bi bi-boxes"></i><span className="ms-3">จัดการท็อปปิ้ง</span> </Link>
                                </li>
                            </>
                        }

                        <li className={`nav-item w-100 ${pathName === '/orders' && 'bg-primary'}`}>
                            <Link to="/orders" className={`nav-link text-truncate  ${pathName === '/orders' && 'text-white'}`}>
                                <i className="bi bi-card-list"></i><span className="ms-3">รายการขาย</span> </Link>
                        </li>
                        {userData.role === "ADMIN" &&
                            <li className={`nav-item w-100 ${pathName === '/users' && 'bg-primary'}`}>
                                <Link to="/users" className={`nav-link text-truncate  ${pathName === '/users' && 'text-white'}`}>
                                    <i className="fs-5 bi-people"></i><span className="ms-3">จัดการผู้ใช้งาน</span> </Link>
                            </li>
                        }

                    </ul>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row ">
                    <header className="fixed-top bg-primary d-flex justify-content-between align-items-center">
                        <button className="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" role="button">
                            <i className="bi text-white bi-arrow-right-square-fill fs-3" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvas"></i>
                        </button>

                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                คุณ {userData.first_name}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate('/profile')}>ข้อมูลส่วนตัว</Dropdown.Item>
                                {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item> */}
                                <Dropdown.Item onClick={handleLogout} className='bg-danger text-white ' as="button">ออกจากระบบ</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </header>

                    <div className="col min-vh-100 p-4 pt-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DefaultLayout
