import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Table } from "antd";
import { createData, deleteData, getAllData, updateData } from '../api/product';
import Form from 'react-bootstrap/Form';
import Loader from '../components/Loader';
import { alertMsg, confirmation } from '../utils/SweetAlert';

const Product = () => {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: "5%"
    },
    {
      title: 'รูปภาพ',
      dataIndex: 'img',
      key: 'img',
      width: "15%",
      render: (text, row) => (
        <img src={text} className='' style={{ width: "80px", height: "50px", objectFit: "contain" }} />
      )
    },
    {
      title: 'สินค้า',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'จัดการ',
      width: "20%",
      dataIndex: 'action',
      key: 'action',
      render: (text, row) => (
        <div className='gap-2 d-flex'>
          <button className='btn btn-sm btn-warning' onClick={() => handleEdit(row)}><i className="bi bi-pencil"></i></button>
          <button className='btn btn-sm btn-danger' onClick={() => deleteDataById(row.id)}><i className="bi bi-trash"></i></button>
        </div>
      )
    },
  ];
  const [dataSource, setDataSource] = useState([])
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: null
  })

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setEditMode(false)
    setForm({
      name: "",
      price: "",
      image: null
    })
    setShow(true);
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const { data } = await getAllData()
      setDataSource(data.products.map(item => ({
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

  const handleChangeImg = (e) => {
    const { name, value, files } = e.target;

    setForm(prevForm => ({
      ...prevForm,
      [name]: files[0]
    }));
  }

  const deleteDataById = async (id) => {
    try {
      await confirmation("คุณต้องการลบสินค้านี้หรือไม่?").then(async (result) => {
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
      id: row.id,
      name: row.name,
      price: row.price,
      image: row.img
    })
    setShow(true)
  }

  const handleSubmit = async () => {
    try {
      setLoadingBtn(true)
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("price", form.price)
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
            <h3>สินค้าทั้งหมด</h3>
            <button className='btn btn-success' onClick={handleShow}>เพิ่มสินค้า</button>
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
                <Modal.Title>{editMode ? "แก้ไขสินค้า" : "สร้างสินค้า"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {editMode && form.image && <img src={form.image} style={{ width: "100%", height: "200px", objectFit: "contain" }} />}
                <div className="mb-3">
                  <Form.Label htmlFor="name"><small className='text-danger'>*</small> สินค้า</Form.Label>
                  <Form.Control
                    name='name'
                    value={form.name}
                    type="text"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <Form.Label htmlFor="price"><small className='text-danger'>*</small> ราคา</Form.Label>
                  <Form.Control
                    name='price'
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
                <div className="mb-3">
                  <Form.Label htmlFor="img"><small className='text-danger'>*</small> รูปภาพ</Form.Label>
                  <Form.Control
                    name='image'
                    onChange={handleChangeImg}
                    type="file"
                  />
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

export default Product
