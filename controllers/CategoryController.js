const Category = require('../models/Category');

module.exports = class CategoryController {
    static async createCategory(req, res) {
        try {
            const { title, icon } = req.body;
            const createdBy = req.userId;

            const category = new Category({
                title,
                icon,
                createdBy
            });

            await category.save();
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar categoria: ${error.message}` });
        }
    }

    static async getCategories(req, res) {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar categorias: ${error.message}` });
        }
    }

    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }
            res.status(200).json({ message: 'Categoria deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: `Erro ao deletar categoria: ${error.message}` });
        }
    }

    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { title, icon } = req.body;
            const category = await Category.findByIdAndUpdate(id, { title, icon }, { new: true });
            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar categoria: ${error.message}` });
        }
    }

};
