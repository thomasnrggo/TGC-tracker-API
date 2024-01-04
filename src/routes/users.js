const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/', usersController.createUser);
router.get('/:userId', usersController.getUser);
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

module.exports = router;