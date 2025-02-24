import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { checkout, getOneOrder, pdfOrder } from '../api/order';
import { alertMsg } from '../utils/SweetAlert';
import { urlBackend } from '../config/config';

const listBath = [
    5, 10, 20, 50, 100, 500, 1000
]

const TableCart = ({ setCart, cart }) => {
    const [showPayment, setShowPayment] = useState(false)
    const [getMoney, setGetMoney] = useState(0)
    const [typePayment, setTypePayment] = useState("CASH")
    const [showReceipt, setShowReceipt] = useState(false)
    const [orders, setOrders] = useState([])
    const [orderId, setOrderId] = useState(null)
    const [showPdfOrder, setShowPdfOrder] = useState(false)
    const [getMoneyShow, setGetMoneyShow] = useState(0)
    const [changeMoneyShow, setChangeMoneyShow] = useState(0)

    const handleCloseReceipt = () => {
        setShowReceipt(false)
    }

    const handleShowReceipt = async (orderId) => {
        setOrderId(orderId)
        const { data } = await getOneOrder(orderId)
        setOrders(data.products)
        setGetMoneyShow(data.get_money)
        setChangeMoneyShow(data.change_money)
        setShowReceipt(true)
    }

    const increaseQty = (index) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            updatedCart[index].quantity += 1;
            updatedCart[index].total_price += updatedCart[index].price;

            localStorage.setItem("orders", JSON.stringify(updatedCart));

            return updatedCart;
        });
    };

    const decreaseQty = (index) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            if (updatedCart[index].quantity > 1) {
                updatedCart[index].quantity -= 1;
                updatedCart[index].total_price -= updatedCart[index].price;
            }
            localStorage.setItem("orders", JSON.stringify(updatedCart));

            return updatedCart;
        });
    };

    const handleClosePayment = () => setShowPayment(false)
    const handleShowPayment = () => {
        setShowPayment(true)
    }

    const removeFromCart = (index) => {
        setCart(prevCart => {
            const updatedCart = prevCart.filter((_, i) => i !== index);

            // อัปเดต localStorage
            localStorage.setItem("orders", JSON.stringify(updatedCart));

            return updatedCart;
        });
    };


    const totalPrice = () => {
        return cart.reduce((sum, item) => sum + item.total_price, 0);
    };

    const totalPriceProduct = () => {
        return orders.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    const handleCheckOut = async () => {
        try {
            const formatedData = {
                order: cart,
                payment: typePayment,
                get_money: getMoney,
                change_money: calculateChange(getMoney, totalPrice())
            }
            const { data } = await checkout(formatedData)
            handleClosePayment()
            handleShowReceipt(data.order_id)
            localStorage.removeItem("orders")
            setCart([])
            alertMsg("บันทึกออเดอร์สำเร็จ")
        } catch (error) {
            console.log(error);
        }
    }

    const printPdfOrder = async () => {
        try {
            setShowPdfOrder(true)
        } catch (error) {
            console.log(error);
        }
    }

    const calculateChange = (paidAmount, totalAmount) => {
        if (paidAmount < totalAmount) {
            return "เงินไม่พอ";  // แจ้งว่าเงินไม่พอ
        } else {
            const change = paidAmount - totalAmount;
            return change;  // คำนวณเงินทอน
        }
    };


    return (
        <div className="col-md-5">
            <div className="card border-0 shadow">
                <div className="card-body p-1">
                    {/* ใช้ div ครอบ table เพื่อควบคุมความสูงและการเลื่อน */}
                    <div style={{ maxHeight: "410px", overflowY: "auto", position: "relative" }}>
                        <table className="table">
                            <thead className="table-light sticky-top">
                                <tr>
                                    <th>สินค้า</th>
                                    <th className='text-end'>ราคา</th>
                                    <th className='text-center'>จำนวน</th>
                                    <th>ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.product_name} <br />
                                            ({item.size_txt}, {item.type_txt}, {item.toppings.map(topping => topping.name).join(", ")})
                                        </td>
                                        <td className='text-end'>{item.total_price}</td>
                                        <td className=''>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <button className='btn btn-sm btn-warning' onClick={() => decreaseQty(index)}><i className="bi bi-dash"></i></button>
                                                <small className='mx-2 fs-6 bg-light px-2'>{item.quantity}</small>
                                                <button className='btn btn-sm btn-primary' onClick={() => increaseQty(index)}><i className="bi bi-plus"></i></button>
                                            </div>
                                        </td>
                                        <td>
                                            <button className='btn btn-sm btn-danger' onClick={() => removeFromCart(index)}><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    {/* ปุ่มอยู่ด้านล่างและติดกับขอบล่าง */}
                    <div style={{ position: "sticky", bottom: 0, zIndex: 10 }}>
                        <h4 className='alert alert-success mb-2 text-end'>รวมทั้งสิ้น {totalPrice()} .-</h4>
                        {/* {cart.length} */}
                        <button className='btn btn-primary w-100' onClick={handleShowPayment} disabled={!cart[0]?.product_name}>
                            CheckOut ( F2 )
                        </button>
                    </div>

                </div>

                <Modal
                    size="lg"
                    show={showPayment}
                    onHide={handleClosePayment}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>ชำระเงิน</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                            <Row>
                                <Col sm={4}>
                                    <ListGroup>
                                        <ListGroup.Item action href="#link1" onClick={() => setTypePayment("CASH")}>
                                            <h5>เงินสด</h5>
                                        </ListGroup.Item>
                                        <ListGroup.Item action href="#link2" onClick={() => setTypePayment("QRCODE")}>
                                            <h5>QR CODE</h5>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col sm={8}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="#link1">
                                            <Row >
                                                <Col md={8}>
                                                    <div className="mb-2">
                                                        <label htmlFor="">ยอดที่ต้องชำระ</label>
                                                        <input type="text" className='form-control' defaultValue={totalPrice()} disabled />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor="">รับเงิน</label>
                                                        <input type="text" className='form-control' value={getMoney} />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor="">เงินทอน</label>
                                                        <input type="text" className='form-control' disabled value={calculateChange(getMoney, totalPrice())} />
                                                    </div>
                                                    <button className='btn btn-lg btn-outline-danger w-100 mt-3' onClick={() => setGetMoney(0)}>clear</button>
                                                    <button className='btn btn-lg btn-success w-100 mt-3' onClick={() => handleCheckOut()} disabled={totalPrice() - getMoney >= 0}>ชำระเงิน</button>
                                                </Col>
                                                <Col md={4}>
                                                    {listBath.map((item, index) =>
                                                        <button key={index} className='btn btn-outline-primary w-100 mb-2' onClick={() => setGetMoney(prev => prev + item)}>{item}</button>
                                                    )}

                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="#link2">
                                            <h3 className='text-center alert alert-primary'>ยอดที่ต้องชำระ {totalPrice()} บาท</h3>
                                            <span className='text-danger'>* ให้ตรวจสอบเช็คหลักฐานการชำระเงินก่อน กดชำระเงิน</span>
                                            <button className='btn btn-lg btn-success w-100 mt-3' onClick={() => handleCheckOut()} >ชำระเงิน</button>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePayment}>
                            ปิด
                        </Button>
                        {/* <Button variant="primary">Understood</Button> */}
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={showReceipt}
                    onHide={handleCloseReceipt}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>สรุปการการขาย</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="table-responsive">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>สินค้า</th>
                                        <th className='text-end'>ราคา</th>
                                        <th className='text-end'>จำนวน</th>
                                        <th className='text-end'>ราคารวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((item, index) =>
                                        <tr key={index}>
                                            <td>
                                                {item.name}
                                                <div className='d-block'>
                                                    (
                                                    {item.size}, &nbsp;
                                                    {item.type},
                                                    {item.toppings.map(row => row.name).join(", ")}
                                                    )
                                                </div>
                                            </td>
                                            <td className='text-end'>{item.price}</td>
                                            <td className='text-end'>{item.quantity}</td>
                                            <td className='text-end'>{item.price * item.quantity}</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className='text-end'>
                                            <b className='fs-5'>รวมทั้งสิ้น {totalPriceProduct()} บาท</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className='text-end'>
                                            <b className='fs-5'>รับเงิน {getMoneyShow} บาท</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className='text-end'>
                                            <b className='fs-5'>เงินทอน {changeMoneyShow} บาท</b>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className='btn btn-primary' onClick={() => printPdfOrder(orderId)}>พิมพ์ออเดอร์</button>
                            {/* <button></button> */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseReceipt}>
                            ปิด
                        </Button>
                        {/* <Button variant="primary">Understood</Button> */}
                    </Modal.Footer>
                </Modal>

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
            </div>
        </div>
    )
}

export default TableCart
