const { Pertence, Pet } = require('../models');

class PertenceController {
    // Criar um novo pertence
    static async create(req, res) {
        try {
            const { 
                cama, 
                coberta, 
                brinquedo, 
                vasilhaComida, 
                vasilhaAgua, 
                coleira, 
                demaisPertences, 
                idPet 
            } = req.body;

            // Verifica se o pet existe
            const pet = await Pet.findByPk(idPet);
            if (!pet) {
                return res.status(404).json({ message: 'Pet não encontrado' });
            }

            const pertence = await Pertence.create({
                cama,
                coberta,
                brinquedo,
                vasilhaComida,
                vasilhaAgua,
                coleira,
                demaisPertences,
                idPet
            });

            res.status(201).json(pertence);
        } catch (error) {
            console.error('Erro ao criar pertence:', error);
            res.status(500).json({ message: 'Erro ao criar pertence' });
        }
    }

    // Listar todos os pertences
    static async getAll(req, res) {
        try {
            const pertences = await Pertence.findAll({
                include: [{
                    model: Pet,
                    attributes: ['nome']
                }]
            });

            // Formatar a resposta para incluir o nome do pet
            const pertencesFormatados = pertences.map(pertence => ({
                id: pertence.idPertence,
                cama: pertence.cama,
                coberta: pertence.coberta,
                brinquedo: pertence.brinquedo,
                vasilhaComida: pertence.vasilhaComida,
                vasilhaAgua: pertence.vasilhaAgua,
                coleira: pertence.coleira,
                demaisPertences: pertence.demaisPertences,
                petId: pertence.idPet,
                petNome: pertence.Pet ? pertence.Pet.nome : 'Pet não encontrado',
                createdAt: pertence.createdAt,
                updatedAt: pertence.updatedAt
            }));

            res.status(200).json(pertencesFormatados);
        } catch (error) {
            console.error('Erro ao listar pertences:', error);
            res.status(500).json({ message: 'Erro ao listar pertences' });
        }
    }

    // Buscar pertences por ID do pet
    static async getByPetId(req, res) {
        try {
            const { idPet } = req.params;

            const pertences = await Pertence.findAll({
                where: { idPet },
                include: [{
                    model: Pet,
                    attributes: ['nome']
                }]
            });

            if (!pertences.length) {
                return res.status(404).json({ message: 'Nenhum pertence encontrado para este pet' });
            }

            const pertencesFormatados = pertences.map(pertence => ({
                id: pertence.idPertence,
                cama: pertence.cama,
                coberta: pertence.coberta,
                brinquedo: pertence.brinquedo,
                vasilhaComida: pertence.vasilhaComida,
                vasilhaAgua: pertence.vasilhaAgua,
                coleira: pertence.coleira,
                demaisPertences: pertence.demaisPertences,
                petId: pertence.idPet,
                petNome: pertence.Pet ? pertence.Pet.nome : 'Pet não encontrado',
                createdAt: pertence.createdAt,
                updatedAt: pertence.updatedAt
            }));

            res.status(200).json(pertencesFormatados);
        } catch (error) {
            console.error('Erro ao buscar pertences do pet:', error);
            res.status(500).json({ message: 'Erro ao buscar pertences do pet' });
        }
    }

    // Atualizar um pertence
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { 
                cama, 
                coberta, 
                brinquedo, 
                vasilhaComida, 
                vasilhaAgua, 
                coleira, 
                demaisPertences, 
                idPet 
            } = req.body;

            const pertence = await Pertence.findByPk(id);
            if (!pertence) {
                return res.status(404).json({ message: 'Pertence não encontrado' });
            }

            // Verifica se o novo pet existe, se foi fornecido
            if (idPet) {
                const pet = await Pet.findByPk(idPet);
                if (!pet) {
                    return res.status(404).json({ message: 'Pet não encontrado' });
                }
            }

            await pertence.update({
                cama,
                coberta,
                brinquedo,
                vasilhaComida,
                vasilhaAgua,
                coleira,
                demaisPertences,
                idPet
            });

            res.status(200).json(pertence);
        } catch (error) {
            console.error('Erro ao atualizar pertence:', error);
            res.status(500).json({ message: 'Erro ao atualizar pertence' });
        }
    }

    // Deletar um pertence
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const pertence = await Pertence.findByPk(id);
            if (!pertence) {
                return res.status(404).json({ message: 'Pertence não encontrado' });
            }

            await pertence.destroy();
            res.status(200).json({ message: 'Pertence excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir pertence:', error);
            res.status(500).json({ message: 'Erro ao excluir pertence' });
        }
    }
}

module.exports = PertenceController; 