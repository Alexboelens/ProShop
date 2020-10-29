import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @Desc    Auth user & generate token
// @Route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		})
	} else {
		res.status(401)
		throw new Error('invalid email or password')
	}
})

// @Desc    Register a new user
// @Route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		})
	} else {
		res.status(401)
		throw new Error('invalid email or password')
	}
})

// @Desc    Get user profile
// @Route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

export { authUser, getUserProfile }
