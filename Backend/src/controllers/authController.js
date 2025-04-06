const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const handleError = require('../middleware/errorHandler');
const RefreshToken = require('../models/refreshToken');

// Función para generar un token JWT
const generateToken = (userId, role, name, email) =>
  jwt.sign({ userId, role, name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Función para verificar si un usuario existe
const checkUserExists = async (email) => User.findOne({ email });

// Función para hashear contraseñas
const hashPassword = async (password) => bcrypt.hash(password, 10);

// Función para generar un refresh token
const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return new RefreshToken({ userId, refreshToken }).save();
};

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Some server error
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await checkUserExists(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generar un token JWT
    const token = generateToken(
      user._id, 
      user.role, 
      user.name, 
      user.email
    );

    res.status(200).json({ token });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Some server error
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const existingToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingToken) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const token = generateToken(decoded.userId, decoded.role, decoded.name);
    const newRefreshToken = await generateRefreshToken(decoded.userId);

    await existingToken.remove();

    res.status(200).json({ token, refreshToken: newRefreshToken.token });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await checkUserExists(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generar un token JWT
    const token = generateToken(user._id, user.role, user.name, user.email);

    // Generar el refresh token
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Enviar la respuesta con todos los datos
    res.status(200).json({
      token,
      refreshToken,
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    handleError(res, error);
  }
};