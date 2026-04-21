const Agent = require('../models/Agent');

module.exports = class AgentController {
    static async createAgent(req, res) {
        try {
            const { title, icon } = req.body;
            const createdBy = req.userId;

            const agent = new Agent({
                title,
                icon,
                createdBy
            });

            await agent.save();
            res.status(201).json(agent);
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar agente: ${error.message}` });
        }
    }

    static async getAgents(req, res) {
        try {
            const agents = await Agent.find();
            res.status(200).json(agents);
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar agentes: ${error.message}` });
        }
    }

    static async deleteAgent(req, res) {
        try {
            const { id } = req.params;
            const agent = await Agent.findByIdAndDelete(id);
            if (!agent) {
                return res.status(404).json({ error: 'Agente não encontrado' });
            }
            res.status(200).json({ message: 'Agente deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: `Erro ao deletar agente: ${error.message}` });
        }
    }

    static async updateAgent(req, res) {
        try {
            const { id } = req.params;
            const { title, icon } = req.body;
            const agent = await Agent.findByIdAndUpdate(id, { title, icon }, { new: true });
            if (!agent) {
                return res.status(404).json({ error: 'Agente não encontrado' });
            }
            res.status(200).json(agent);
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar agente: ${error.message}` });
        }
    }

};
