import React, { useState } from 'react'
import Logo from '../assets/logo.png'
import { login } from '../api/auth'
import { alertMsg } from '../utils/SweetAlert'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        username: "",
        password: ""
    })
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { data } = await login(form)
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("token", data.token)
            alertMsg("เข้าสู่ระบบสำเร็จ")
            navigate("/")

        } catch (error) {
            console.log(error);
            if (error.response.data.errors && error.status == 400) {
                alertMsg("Please required input all!", 'error')
            } else if (error && error.status == 400) {
                alertMsg(error.response.data.message, 'error')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center vh-100 bg-success">
                <div className="card border-0 shadow" style={{ minWidth: "350px" }}>
                    <img src={Logo} alt="" style={{ width: "100%", height: "100px", objectFit: "contain" }} />
                    <div className="card-body">
                        <h4 className='text-center '>ยินดีต้อนรับเข้าสู่ระบบ</h4>
                        <div className='border-bottom border-3 border-success'></div>
                        <small className='text-danger'>* หากเข้าสู่ระบบไม่ได้ให้แจ้ง <a href="https://www.facebook.com/weeraphong.surapho/?locale=th_TH" target='_blank'>facebook</a></small>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="">username</label>
                                <input type="text" className='form-control' name='username' value={form.username} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="">password</label>
                                <input type="password" className='form-control' name='password' value={form.password} onChange={handleChange} />
                            </div>
                            <button type='submit' className='btn btn-primary w-100'>{loading ? "Please wait..." : "Login"}</button>
                        </form>
                        <div className='alert alert-info mt-3'>
                            <b>role : admin</b> <br />
                            username & password = admin <br />
                            <b>role : employee</b> <br />
                            username & password = employee
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login