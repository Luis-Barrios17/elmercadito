const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Roles = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest"
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
exports.createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const role = req.body.role || { name: Roles.USER, permisos: [] }; // Default role and permissions
  
      // Verifica que el rol sea válido
      if (!Object.values(Roles).includes(role.name)) {
        throw new Error(`El rol ${role.name} no es válido`);
      }
  
      // Encripta la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        name, // Cambiado de DisplayName a name
        email,
        password: hashedPassword,
        role,
      });
  
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
    console.log('Datos recibidos en el backend:', req.body);
  };

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.updateUser = async (req, res) => {
    try {
        // Si no se proporciona una contraseña, elimina el campo password del cuerpo de la solicitud
        if (!req.body.password) {
            delete req.body.password;
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       204:
 *         description: The user was deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).send(error);
    }
};
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // El ID del usuario autenticado (extraído del token)
        const user = await User.findById(userId).select('-password'); // Excluye la contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: error.message });
    }
};