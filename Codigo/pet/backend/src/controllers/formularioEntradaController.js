const { FormularioEntrada } = require('../models');

// Criar um novo formulário de entrada
exports.createFormularioEntrada = async (req, res) => {
    try {
        const {
            idPet,
            qtdVezesAlimentacao,
            castrado,
            locaisDeNecessidades,
            ambientesPreferenciais,
            temperamento,
            brinquedosPreferidos,
            permissaoGramado,
            conviveOutroPet,
            permissaoConvivencia,
            longeDosTutores,
            usaMedicacao,
            antipulgas,
            medoDeFogoArtificio,
            autorizaUsoImagem,
            complementoConforto
        } = req.body;

        const formulario = await FormularioEntrada.create({
            idPet,
            qtdVezesAlimentacao,
            castrado,
            locaisDeNecessidades,
            ambientesPreferenciais,
            temperamento,
            brinquedosPreferidos,
            permissaoGramado,
            conviveOutroPet,
            permissaoConvivencia,
            longeDosTutores,
            usaMedicacao,
            antipulgas,
            medoDeFogoArtificio,
            autorizaUsoImagem,
            complementoConforto,
        });

        return res.status(201).json(formulario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar formulário de entrada' });
    }
};

// Obter todos os formulários de entrada
exports.getAllFormularios = async (req, res) => {
    try {
        const formularios = await FormularioEntrada.findAll();
        return res.status(200).json(formularios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar formulários de entrada' });
    }
};

// Obter um formulário de entrada específico
exports.getFormularioById = async (req, res) => {
    try {
        const formulario = await FormularioEntrada.findByPk(req.params.idForm);

        if (!formulario) {
            return res.status(404).json({ error: 'Formulário de entrada não encontrado' });
        }

        return res.status(200).json(formulario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar formulário de entrada' });
    }
};

// Atualizar um formulário de entrada
exports.updateFormularioEntrada = async (req, res) => {
    try {
        const formulario = await FormularioEntrada.findByPk(req.params.idForm);

        if (!formulario) {
            return res.status(404).json({ error: 'Formulário de entrada não encontrado' });
        }

        await formulario.update(req.body);

        return res.status(200).json(formulario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar formulário de entrada' });
    }
};

// Excluir um formulário de entrada
exports.deleteFormularioEntrada = async (req, res) => {
    try {
        const formulario = await FormularioEntrada.findByPk(req.params.idForm);

        if (!formulario) {
            return res.status(404).json({ error: 'Formulário de entrada não encontrado' });
        }

        await formulario.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir formulário de entrada' });
    }
};
