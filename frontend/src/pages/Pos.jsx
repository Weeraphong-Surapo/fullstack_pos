import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getAllData } from '../api/product';
import { getAllData as getAllDataSize } from '../api/size';
import { getAllData as getAllDataType } from '../api/type';
import { getAllData as getAllDataTopping } from '../api/topping';
import CardProduct from '../components/CardProduct';
import TableCart from '../components/TableCart';
import Loader from '../components/Loader';

const Pos = () => {
    const [show, setShow] = useState(false);
    const [products, setProducts] = useState([])
    const [sizes, setSizes] = useState([])
    const [types, setTypes] = useState([])
    const [toppings, setToppings] = useState([])
    const [listToppings, setListToppings] = useState([])
    const [listToppingsTH, setListToppingsTH] = useState([])
    const [selectType, setSelectType] = useState('')
    const [selectTypeTH, setSelectTypeTH] = useState('')
    const [selectSize, setSelectSize] = useState('')
    const [selectSizeTH, setSelectSizeTH] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [productId, setProductId] = useState("")
    const [sumProduct, setSumProduct] = useState(0)
    const [page, setPage] = useState(1)
    const [listPaginate, setListPaginate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem("orders")) || [];
    });
    const [product, setProduct] = useState({
        name: "",
        price: "",
        image: "",
    })

    const handleClose = () => setShow(false);
    const handleShow = (product) => {
        setSelectSize("")
        setSelectType("")
        setSelectType("")
        setSelectTypeTH("")
        setQuantity(1)
        setListToppingsTH([])
        setListToppings([])
        setProductId(product.id)
        setSumProduct(product.price)
        setProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.img
        })
        setShow(true)
    };

    const loadDataProducts = async (page) => {
        try {
            const { data } = await getAllData(page)
            setProducts(data.products)
            setListPaginate(data.totalPages)
        } catch (error) {
            console.log(error);
        }
    }

    const loadDataSizes = async () => {
        try {
            const { data } = await getAllDataSize()
            setSizes(data)
        } catch (error) {
            console.log(error);

        }
    }

    const loadDataTypes = async () => {
        try {
            const { data } = await getAllDataType()
            setTypes(data)
        } catch (error) {
            console.log(error);

        }
    }

    const loadDataToppings = async () => {
        try {
            const { data } = await getAllDataTopping()
            setToppings(data)
        } catch (error) {
            console.log(error);

        }
    }

    const loadData = async (page) => {
        try {
            setLoading(true)
            await loadDataProducts(page)
            await loadDataSizes()
            await loadDataTypes()
            await loadDataToppings()
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }



    const addTopping = (id, name, price) => {
        setListToppings((prev) => {
            if (prev.includes(id)) {
                setSumProduct((prevSum) => prevSum - price); // ลดราคา
                return prev.filter(item => item !== id);
            } else {
                setSumProduct((prevSum) => prevSum + price); // เพิ่มราคา
                return [...prev, id];
            }
        });

        setListToppingsTH((prev) => {
            if (prev.some(item => item.id === id)) {
                return prev.filter(item => item.id !== id); // ลบถ้ามี id นี้
            } else {
                return [...prev, { id, name }]; // เก็บทั้ง id และ name
            }
        });
    };



    const addToOrder = () => {
        const orderItem = {
            product_id: productId,
            product_name: product.name,
            size_id: selectSize,
            size_txt: selectSizeTH,
            type_id: selectType,
            type_txt: selectTypeTH,
            quantity: quantity,
            topping_id: listToppings,
            toppings: listToppingsTH,
            price: sumProduct,
            total_price: sumProduct
        };

        // ดึงข้อมูล order เก่าจาก localStorage
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

        // เพิ่ม order ใหม่เข้าไป
        const updatedOrders = [...existingOrders, orderItem];

        // บันทึกลง localStorage
        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        setCart(updatedOrders)

        handleClose(); // ปิด Modal หลังเพิ่มสินค้า
    };

    const handleSelectType = (type) => {
        setSelectTypeTH(type.name)
        setSumProduct((prev) => prev + type.price)

        setSelectType(type.id)
    }

    const handleSelectSize = (size) => {
        setSelectSizeTH(size.size_name)
        setSumProduct((prev) => prev + size.price)

        setSelectSize(size.id)
    }

    const handleChangePage = async (pageNumber) => {
        setPage(pageNumber)
        await loadDataProducts(pageNumber)
    }

    useEffect(() => {
        loadData(page)
        localStorage.setItem("orders", JSON.stringify(cart));
    }, [])
    return (
        <div className='pt-4'>
            {loading ?
                <Loader />
                :
                <div className="row gy-3">
                    <div className="col-md-7">
                        <div className='mb-3'>
                            <div className='d-flex'>
                                {
                                    Array.from({ length: listPaginate }, (_, i) => (
                                        <button onClick={() => handleChangePage(i + 1)} className={`btn btn-sm btn-outline-secondary px-3 me-1 ${page - 1 == i && 'bg-primary text-white'}`} key={i}>{i + 1}</button>
                                    ))
                                }
                            </div>
                            {/* <input type="search" name="" className='form-control my-2' id="" /> */}
                        </div>
                        <div className="row gy-3">
                            {products.map(product =>
                                <CardProduct product={product} handleShow={handleShow} key={product.id} />
                            )}
                        </div>
                    </div>
                    <Modal
                        size="lg"
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>ข้อมูล</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-4">
                                    <img style={{ height: "200px", objectFit: "contain" }} src={product.image} className="card-img-top" alt="" />
                                    <div className="card-body">
                                        <h3 className="text-center card-title">{product.name}</h3>
                                        {/* <p className="text-center card-text">{product.price} .-</p> */}
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <label htmlFor="">ขนาดแก้ว</label>
                                    <div className="d-flex gap-4 border p-2 mb-2 border-primary">
                                        {sizes.map((item) =>
                                            <Form.Check
                                                onClick={() => handleSelectSize(item)}
                                                key={item.id}
                                                name='size'
                                                type="radio"
                                                label={`${item.size_name} ( ${item.price} )`}
                                            />
                                        )}

                                    </div>
                                    <label htmlFor="">ประเภท</label>
                                    <div className="d-flex gap-4 border p-2 border-info mb-2">
                                        {types.map((item) =>
                                            <Form.Check
                                                onClick={() => handleSelectType(item)}
                                                key={item.id}
                                                type="radio"
                                                name='type'
                                                label={`${item.name} ( ${item.price} )`}
                                            />
                                        )}
                                    </div>
                                    <label htmlFor="">ท็อปปิ้ง</label>
                                    <div className=" gap-4 border p-2 border-danger mb-2">
                                        {toppings.map((item) =>
                                            <Form.Check
                                                key={item.id}
                                                onClick={() => addTopping(item.id, item.name, item.price)}
                                                type="checkbox"
                                                label={`${item.name} ( ${item.price} )`}
                                            />
                                        )}
                                    </div>
                                    <label htmlFor="">จำนวนแก้ว</label>

                                    <input type="number" className='form-control' value={quantity} onChange={() => setQuantity((prev) => prev + 1)} min={1} />
                                </div>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                ปิด
                            </Button>
                            <Button variant="primary" onClick={addToOrder}>เพิ่มลงออเดอร์</Button>
                        </Modal.Footer>
                    </Modal>


                    <TableCart setCart={setCart} cart={cart} />
                </div>
            }
        </div>
    )
}

export default Pos
