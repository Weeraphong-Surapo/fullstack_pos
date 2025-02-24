import React, { useEffect, useState } from 'react'
import moment from "moment/min/moment-with-locales"
import Modal from 'react-bootstrap/Modal';
import { Table } from "antd";
import { deleteData, getAllData } from '../api/listSale';
import Form from 'react-bootstrap/Form';
import Loader from '../components/Loader';
import { alertMsg, confirmation } from '../utils/SweetAlert';
import { urlBackend } from '../config/config';

const Order = () => {
  const columns = [
    {
      title: '#',
      dataIndex: 'order_id',
      key: 'order_id',
      width: "5%"
    },
    {
      title: 'พนักงานขาย',
      dataIndex: 'employee_sale',
      key: 'employee_sale',
      render: (text) => (
        <>{text.first_name} {text.last_name}</>
      )
    },
    {
      title: 'รับเงิน',
      dataIndex: 'payment',
      key: 'payment',
    },
    {
      title: 'รายได้',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'สินค้า',
      dataIndex: 'product',
      key: 'product',
      render: (text, row) => (
        <>
          {row.products.map((item, index) =>
            <p key={index}>
              {item.name} x {item.quantity} <br />
              ( &nbsp;
              {item.size}, &nbsp;
              {item.type}, &nbsp;
              {item.toppings.map((topping, i) =>
                <span key={i}>{topping.name},</span>
              )}
              &nbsp; )
            </p>
          )}
        </>
      )
    },
    {
      title: 'วันที่',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (text) => (
        <>{moment(text).locale('th').format('lll')}</>
      )
    },
    {
      title: 'จัดการ',
      width: "20%",
      dataIndex: 'action',
      key: 'action',
      render: (text, row) => (
        <div className='gap-2 d-flex'>
          <button className='btn  btn-primary' onClick={() => showPdfReceipt(row.order_id)}><i className="bi bi-printer"></i></button>
          <button className='btn  btn-danger' onClick={() => deleteDataById(row.order_id)}><i className="bi bi-trash"></i></button>
        </div>
      )
    },
  ];
  const [dataSource, setDataSource] = useState([])
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [showPdfOrder, setShowPdfOrder] = useState(false)
  const [orderId, setOrderId] = useState(null)


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

  const showPdfReceipt = (id) => {
    console.log(id);

    setOrderId(id)
    setShowPdfOrder(true)
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
            <h3>รายการขาย</h3>
          </div>
          <div className="table-responsive">
            <Table dataSource={dataSource} columns={columns} />
          </div>

          <Modal show={showPdfOrder} size="lg" onHide={() => setShowPdfOrder(false)}>
            <Modal.Header closeButton>
              <Modal.Title>เอกสาร PDF</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <iframe
                src={`${urlBackend}/report-receipt/${orderId}`}
                width="100%"
                height="500px"
                style={{ border: "none" }}
              ></iframe>
            </Modal.Body>
          </Modal>
        </>
      }
    </div>
  )
}

export default Order
