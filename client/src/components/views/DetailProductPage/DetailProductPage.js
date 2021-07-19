import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import { Row, Col } from 'antd'

function DetailProductPage(props) {

    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})

    useEffect(() => {

        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data[0])
            })
            .catch(err => alert(err))

    }, [])

    return (
        <div style={{ width: '100%', margin: '3rem 4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]}>

                <Col lg={12} sm={24}>
                    {/* Product Image */}
                    <ProductImage detail={Product} />
                </Col>

                <Col lg={12} sm={24}>
                    {/* Product Info */}
                    <ProductInfo detail={Product} />
                </Col>

            </Row>

        </div>
    )
}

export default DetailProductPage
