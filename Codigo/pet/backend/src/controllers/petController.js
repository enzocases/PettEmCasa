const { Pet, Reserva } = require('../models');

// Criar um novo pet (associado ao tutor logado)
exports.createPet = async (req, res) => {
    try {
        const { nome, idade, raca, genero, porte } = req.body;
        
        // Pega o ID do tutor do token JWT
        const idTutor = req.user.id;
        
        const novoPet = await Pet.create({
            nome,
            idade,
            raca,
            genero,
            porte,
            idTutor // Associa o pet ao tutor logado
        });

        res.status(201).json(novoPet);
    } catch (error) {
        console.error("Erro ao criar pet:", error);
        res.status(500).json({ error: "Erro ao criar pet" });
    }
};

// Obter todos os pets do tutor logado
exports.getAllPets = async (req, res) => {
    try {
        const idTutor = req.user.id;
        
        const pets = await Pet.findAll({
            where: { idTutor }
        });

        console.log(`Pets encontrados para tutor ${idTutor}:`, pets.length);

        return res.status(200).json(pets);
    } catch (error) {
        console.error('Erro ao buscar pets:', error);
        return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
};

// Obter um pet específico (apenas se pertencer ao tutor)
exports.getPetById = async (req, res) => {
    try {
        const idTutor = req.user.id;
        const pet = await Pet.findOne({
            where: { 
                idPet: req.params.idPet,
                idTutor 
            }
        });

        if (!pet) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }

        return res.status(200).json(pet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar pet' });
    }
};

// Atualizar um pet (apenas se pertencer ao tutor)
exports.updatePet = async (req, res) => {
    try {
        const idTutor = req.user.id;
        const pet = await Pet.findOne({
            where: { 
                idPet: req.params.idPet,
                idTutor 
            }
        });

        if (!pet) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }

        // Atualiza os dados do pet (sem permitir mudança do idTutor)
        const { nome, idade, raca, genero, porte } = req.body;
        await pet.update({ nome, idade, raca, genero, porte });

        return res.status(200).json(pet);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar pet' });
    }
};

// Excluir um pet (apenas se pertencer ao tutor)
exports.deletePet = async (req, res) => {
    try {
        const idTutor = req.user.id;
        const pet = await Pet.findOne({
            where: { 
                idPet: req.params.idPet,
                idTutor 
            }
        });

        if (!pet) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }

        await pet.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir pet' });
    }
};

// Obter histórico de acomodações dos pets do tutor
exports.getPetAccommodationHistory = async (req, res) => {
  try {
      const idTutor = req.user.id;
      
      // Busca apenas reservas não ativas (finalizadas ou canceladas) dos pets do tutor
      const historico = await Reserva.findAll({
          where: {
              status: ['Finalizada', 'Cancelada'] // Filtra apenas reservas não ativas
          },
          include: [{
              model: Pet,
              where: { idTutor },
              attributes: ['idPet', 'nome', 'raca', 'porte']
          }],
          order: [['data_entrada', 'DESC']]
      });

      return res.status(200).json(historico);
  } catch (error) {
      console.error('Erro ao buscar histórico de acomodações:', error);
      return res.status(500).json({ error: 'Erro ao buscar histórico de acomodações' });
  }
};