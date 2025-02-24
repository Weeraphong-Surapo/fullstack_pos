import React from 'react'

const CardProduct = ({ product, handleShow }) => {
    return (
        <div className="col-lg-3 col-md-4 col-12" onClick={() => handleShow(product)} >
            <div className="card border-0 shadow" >
                <img style={{ height: "90px", objectFit: "contain" }} src={product.img} className="card-img-top" alt="" />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.price} .-</p>
                </div>
            </div>
        </div>

    )
}

export default CardProduct