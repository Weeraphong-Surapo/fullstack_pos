import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Table } from "antd";
import { createData, deleteData, getAllData, updateData } from '../api/user';
import Form from 'react-bootstrap/Form';
import Loader from '../components/Loader';
import { alertMsg, confirmation } from '../utils/SweetAlert';

const User = () => {
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: "5%"
        },
        {
            title: 'ชื่อ - สกุล',
            dataIndex: 'image',
            key: 'image',
            render: (text) => (
                <img src={text} style={{ width: "80px", height: "80px", objectFit: "contain" }} />
            )
        },
        {
            title: 'ชื่อ - สกุล',
            dataIndex: 'name',
            key: 'name',
            render: (text, row) => (
                <>{row.first_name} {row.last_name}</>
            )
        },
        {
            title: 'ชื่อผู้ใช้งาน',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'เบอร์',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'ที่อยู่',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'ตำแหน่ง',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'จัดการ',
            width: "20%",
            dataIndex: 'action',
            key: 'action',
            render: (text, row) => (
                <>
                    {
                        row.username != "admin" && row.username != "employee"
                            ?
                            <div className='gap-2 d-flex'>
                                <button className='btn btn-sm btn-warning' onClick={() => handleEdit(row)}><i className="bi bi-pencil"></i></button>
                                <button className='btn btn-sm btn-danger' onClick={() => deleteDataById(row.id)}><i className="bi bi-trash"></i></button>
                            </div>
                            :
                            <button className='btn btn-danger btn-sm'>Loock Acount</button>
                    }
                </>

            )
        },
    ];
    const [dataSource, setDataSource] = useState([])
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [form, setForm] = useState({
        image: null,
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        phone: "",
        address: "",
        role: ""
    })

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setEditMode(false)
        setForm({
            image: null,
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            phone: "",
            address: "",
            role: ""
        })
        setShow(true);
    }

    const loadData = async () => {
        try {
            setLoading(true)
            const { data } = await getAllData()
            setDataSource(data.map(item => ({
                ...item,
                key: item.id
            })))

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    }


    const deleteDataById = async (id) => {
        try {
            await confirmation("คุณต้องการลบข้อมูลนี้หรือไม่?").then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await deleteData(id)
                    alertMsg("ลบข้อมูลสำเร็จ")
                    await loadData()
                }
            })
        } catch (error) {
            console.log(error);

        }
    }

    const handleEdit = (row) => {
        setEditMode(true)

        setForm({
            image: row.image,
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name,
            username: row.username,
            phone: row.last_name,
            password: row.password,
            address: row.address,
            role: row.role,
        })
        setShow(true)
    }

    const handleSubmit = async () => {
        try {
            setLoadingBtn(true)
            const formData = new FormData()

            formData.append("first_name", form.first_name)
            formData.append("last_name", form.last_name)
            formData.append("username", form.username)
            formData.append("password", form.password)
            formData.append("phone", form.phone)
            formData.append("address", form.address)
            formData.append("role", form.role)
            formData.append("image", form.image)

            if (editMode) {
                const { data } = await updateData(formData, form.id)
            } else {
                const { data } = await createData(formData)
            }

            setShow(false)
            alertMsg("บันทึกข้อมูลสำเร็จ")

            await loadData()
        } catch (error) {
            console.log(error);
            if (error && error.status === 400) {
                alertMsg("กรุณากรอกข้อมูลให้ครบถ้วน", 'error')
            }
        } finally {
            setLoadingBtn(false)
        }
    }

    const handleChangeRole = (e) => {
        setForm(prev => ({
            ...prev,
            role: e.target.value
        }))
    }

    const handleChangeFile = (e) => {
        setForm(prev => ({
            ...prev,
            image: e.target.files[0]
        }))
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div className='pt-3'>
            {loading ?
                <Loader />
                :
                <>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>ผู้ใช้งาน</h3>
                        <button className='btn btn-success' onClick={handleShow}>เพิ่มข้อมูล</button>
                    </div>
                    <div className="table-responsive">
                        <Table dataSource={dataSource} columns={columns} />

                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>{editMode ? "แก้ไขข้อมูล" : "สร้างข้อมูล"}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                {editMode && form.image && <img src={form.image} style={{ width: "100%", height: "200px", objectFit: "contain" }} />}
                                <div className="mb-3">
                                    <Form.Label htmlFor="first_name"><small className='text-danger'>*</small> รูปภาพ</Form.Label>
                                    <Form.Control
                                        required
                                        name='first_name'
                                        type="file"
                                        onChange={handleChangeFile}
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="first_name"><small className='text-danger'>*</small> ชื่อ</Form.Label>
                                    <Form.Control
                                        name='first_name'
                                        value={form.first_name}
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="last_name"><small className='text-danger'>*</small> นามสกุล</Form.Label>
                                    <Form.Control
                                        name='last_name'
                                        value={form.last_name}
                                        onChange={handleChange}
                                        type="text"
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="username"><small className='text-danger'>*</small> ชื่อผู้ใช้าน</Form.Label>
                                    <Form.Control
                                        disabled={editMode}
                                        name='username'
                                        value={form.username}
                                        onChange={handleChange}
                                        type="text"
                                    />
                                </div>
                                {!editMode && <div className="mb-3">
                                    <Form.Label htmlFor="password"><small className='text-danger'>*</small> รหัสผ่าน</Form.Label>
                                    <Form.Control
                                        name='password'
                                        value={form.password}
                                        onChange={handleChange}
                                        type="text"
                                    />
                                </div>}

                                <div className="mb-3">
                                    <Form.Label htmlFor="phone"><small className='text-danger'>*</small> เบอร์โทร</Form.Label>
                                    <Form.Control
                                        name='phone'
                                        value={form.phone}
                                        onChange={handleChange}
                                        type="text"
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="address"><small className='text-danger'>*</small> ที่อยู่</Form.Label>
                                    <Form.Control
                                        name='address'
                                        value={form.address}
                                        onChange={handleChange}
                                        type="text"
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="price"><small className='text-danger'>*</small> ตำแหน่ง</Form.Label>
                                    <Form.Select onChange={handleChangeRole}>
                                        <option value="EMPLOYEE" selected>พนักงาน</option>
                                        <option value="ADMIN">ผู้ดูแล</option>
                                    </Form.Select>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    ปิด
                                </Button>
                                <Button variant="primary" onClick={handleSubmit} disabled={loadingBtn}>{loadingBtn ? 'โปรดรอ...' : 'บันทึก'}</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </>
            }
        </div>
    )
}

export default User
