const { PetUpdate, Pet, Funcionario, Reserva } = require('../models');

// Create a new pet update (Funcionario only)
exports.createPetUpdate = async (req, res) => {
    try {
        const { 
            idPet, 
            comeu_bem, 
            tomou_banho, 
            exercitou, 
            brincou, 
            descansou_bem, 
            observacoes
        } = req.body;
        
        const idFuncionario = req.user.id;

        // Verify that the pet is currently in a reservation
        const activeReservation = await Reserva.findOne({
            where: { 
                idPet, 
                status: 'Ativa' 
            }
        });

        if (!activeReservation) {
            return res.status(404).json({ error: 'Pet não está atualmente hospedado' });
        }

        // Check if an update for this pet on this date already exists
        const today = new Date().toISOString().split('T')[0];
        const existingUpdate = await PetUpdate.findOne({
            where: {
                idPet,
                data_update: today,
                idFuncionario
            }
        });

        if (existingUpdate) {
            // Update existing record
            await existingUpdate.update({
                comeu_bem: comeu_bem || false,
                tomou_banho: tomou_banho || false,
                exercitou: exercitou || false,
                brincou: brincou || false,
                descansou_bem: descansou_bem || false,
                observacoes: observacoes || ''
            });
            return res.status(200).json(existingUpdate);
        }

        // Create new update
        const newUpdate = await PetUpdate.create({
            idPet,
            idFuncionario,
            data_update: today,
            comeu_bem: comeu_bem || false,
            tomou_banho: tomou_banho || false,
            exercitou: exercitou || false,
            brincou: brincou || false,
            descansou_bem: descansou_bem || false,
            observacoes: observacoes || ''
        });

        return res.status(201).json(newUpdate);
    } catch (error) {
        console.error('Erro ao criar update do pet:', error);
        return res.status(500).json({ error: 'Erro ao criar update do pet' });
    }
};

// Get all pets currently in active reservations (for funcionario interface)
exports.getActivePets = async (req, res) => {
    try {
        const activePets = await Pet.findAll({
            include: [{
                model: Reserva,
                where: { status: 'Ativa' },
                required: true,
                include: [{
                    model: require('../models/tutor'),
                    attributes: ['nome']
                }]
            }],
            order: [['nome', 'ASC']]
        });

        // Get today's updates for these pets
        const today = new Date().toISOString().split('T')[0];
        const petsWithUpdates = await Promise.all(
            activePets.map(async (pet) => {
                const todayUpdate = await PetUpdate.findOne({
                    where: {
                        idPet: pet.idPet,
                        data_update: today
                    }
                });

                return {
                    ...pet.toJSON(),
                    todayUpdate: todayUpdate || null
                };
            })
        );

        return res.status(200).json(petsWithUpdates);
    } catch (error) {
        console.error('Erro ao buscar pets ativos:', error);
        return res.status(500).json({ error: 'Erro ao buscar pets ativos' });
    }
};

// Get all updates for pets owned by the logged-in tutor
exports.getTutorPetUpdates = async (req, res) => {
    try {
        const idTutor = req.user.id;

        const updates = await PetUpdate.findAll({
            include: [{
                model: Pet,
                where: { idTutor },
                attributes: ['idPet', 'nome', 'raca']
            }, {
                model: Funcionario,
                attributes: ['nome']
            }],
            order: [['data_update', 'DESC'], ['createdAt', 'DESC']]
        });

        return res.status(200).json(updates);
    } catch (error) {
        console.error('Erro ao buscar updates do tutor:', error);
        return res.status(500).json({ error: 'Erro ao buscar updates' });
    }
};

// Get updates for a specific pet (tutor can only access their own pets)
exports.getPetUpdates = async (req, res) => {
    try {
        const { idPet } = req.params;
        const idTutor = req.user.id;

        // Verify pet belongs to tutor
        const pet = await Pet.findOne({
            where: { idPet, idTutor }
        });

        if (!pet) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }

        const updates = await PetUpdate.findAll({
            where: { idPet },
            include: [{
                model: Funcionario,
                attributes: ['nome']
            }],
            order: [['data_update', 'DESC']]
        });

        return res.status(200).json(updates);
    } catch (error) {
        console.error('Erro ao buscar updates do pet:', error);
        return res.status(500).json({ error: 'Erro ao buscar updates do pet' });
    }
};

// Update a pet update (Funcionario only, same day only)
exports.updatePetUpdate = async (req, res) => {
    try {
        const { idUpdate } = req.params;
        const idFuncionario = req.user.id;

        const update = await PetUpdate.findOne({
            where: { 
                idUpdate,
                idFuncionario // Funcionario can only update their own updates
            }
        });

        if (!update) {
            return res.status(404).json({ error: 'Update não encontrado' });
        }

        // Check if update is from today (only allow editing today's updates)
        const today = new Date().toISOString().split('T')[0];
        const updateDate = update.data_update;

        if (updateDate !== today) {
            return res.status(403).json({ error: 'Só é possível editar updates do dia atual' });
        }

        await update.update(req.body);
        return res.status(200).json(update);
    } catch (error) {
        console.error('Erro ao atualizar update:', error);
        return res.status(500).json({ error: 'Erro ao atualizar update' });
    }
};

// Delete a pet update (Funcionario only, same day only)
exports.deletePetUpdate = async (req, res) => {
    try {
        const { idUpdate } = req.params;
        const idFuncionario = req.user.id;

        const update = await PetUpdate.findOne({
            where: { 
                idUpdate,
                idFuncionario
            }
        });

        if (!update) {
            return res.status(404).json({ error: 'Update não encontrado' });
        }

        // Check if update is from today
        const today = new Date().toISOString().split('T')[0];
        const updateDate = update.data_update;

        if (updateDate !== today) {
            return res.status(403).json({ error: 'Só é possível excluir updates do dia atual' });
        }

        await update.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir update:', error);
        return res.status(500).json({ error: 'Erro ao excluir update' });
    }
};