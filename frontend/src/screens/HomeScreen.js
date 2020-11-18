import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'
import Meta from '../components/Meta'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import { Row, Col } from 'react-bootstrap'
import { listProducts } from '../redux/actions/productActions'

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword
	const pageNumber = match.params.pageNumber || 1

	const dispatch = useDispatch()

	const productList = useSelector((state) => state.productList)
	const { loading, error, products, page, pages } = productList

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber))
	}, [dispatch, keyword, pageNumber])

	return (
		<div>
			<Meta title='Welcome to E-Shop | Home' />

			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link to='/' className='btn btn-light'>
					Go Back
				</Link>
			)}
			<h1>Latest Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Row>
						{!loading &&
							products.map((product) => (
								<Col sm={12} md={6} lg={4} xl={3} key={product._id}>
									<Product product={product} />
								</Col>
							))}
					</Row>
					<Paginate
						page={page}
						pages={pages}
						keyword={keyword ? keyword : ''}
					/>
				</>
			)}
		</div>
	)
}

export default HomeScreen
