import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Card, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link } from 'react-router-dom'
import { createOrder } from '../redux/actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
	const dispatch = useDispatch()

	const cart = useSelector((state) => state.cart)
	const orderCreate = useSelector((state) => state.orderCreate)

	const { address, city, postalCode, country } = cart.shippingAddress
	const { error, order, success } = orderCreate

	// Calculate Prices
	const addDecimals = (num) => {
		return Math.round((num * 100) / 100).toFixed(2)
	}

	cart.itemsPrice = addDecimals(
		cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
	)
	cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 25)
	cart.taxPrice = addDecimals(Number(0.15 * cart.itemsPrice))
	cart.totalPrice = (
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice)
	).toFixed(2)

	useEffect(() => {
		if (success && order._id) {
			history.push(`/order/${order._id}`)
		}
		// eslint-disable-next-line
	}, [history, success])

	const placeOrderHandler = () => {
		dispatch(
			createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice
			})
		)
	}

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Adress: </strong>
								{address}, {postalCode + ' '}
								{city}, {country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Ordered Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cart.cartItems.map((item) => (
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
									<Col>${cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								{error && <Message variant='danger'>{error}</Message>}
							</ListGroup.Item>
							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
									onClick={placeOrderHandler}
									disabled={cart.cartItems === 0}
								>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default PlaceOrderScreen
