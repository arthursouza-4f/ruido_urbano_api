const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');

router.post('/create', CategoryController.createCategory);
router.get('/list', CategoryController.getCategories);
router.put('/update/:id', CategoryController.updateCategory);
router.delete('/delete/:id', CategoryController.deleteCategory);

module.exports = router;

