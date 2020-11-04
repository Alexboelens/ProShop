import React, { useEffect, useState } from 'react'
import { PayPalButton } from 'react-paypal-button-v2'
import axios from 'axios'
import { Row, Col, ListGroup, Card, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import { getOrderDetails, payOrder } from '../redux/actions/orderActions'
import { ORDER_PAY_RESET } from '../redux/constants/orderConstants'

const OrderScreen = ({ match }) => {
	const orderId = match.params.id

	const [sdkReady, setSdkReady] = useState(false)

	const dispatch = useDispatch()

	const orderDetails = useSelector((state) => state.orderDetails)
	const { error, order, loading } = orderDetails

	const orderPay = useSelector((state) => state.orderPay)
	const { success: successPay, loading: loadingPay } = orderPay

	useEffect(() => {
		const addPaypalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal')
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
			script.async = true
			script.onload = () => setSdkReady(true)
			document.body.appendChild(script)
		}

		if (!order || successPay || order._id !== orderId) {
			dispatch({ type: ORDER_PAY_RESET })
			dispatch(getOrderDetails(orderId))
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPaypalScript()
			} else {
				setSdkReady(true)
			}
		}
	}, [successPay, orderId, dispatch, order])

	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult)
		dispatch(payOrder(orderId, paymentResult))
	}

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong>
								{order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>

							<p>
								<strong>Adress: </strong>
								{order.shippingAddress.address},{' '}
								{order.shippingAddress.postalCode + ' '}
								{order.shippingAddress.city}, {order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered at {order.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>Paid at {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Ordered Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item) => (
										<ListGroup.Item key={item.product}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} X ${item.price} = $
													{(item.qty * item.price).toFixed(2)}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card variant='flush'>
						<ListGroup>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={successPaymentHandler}
										/>
									)}
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
