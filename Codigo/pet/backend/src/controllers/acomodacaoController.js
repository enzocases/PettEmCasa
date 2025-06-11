const Acomodacao = require('../models/acomodacao');

// Listar todas as acomodações
exports.listarAcomodacoes = async (req, res) => {
    try {
        const acomodacoes = await Acomodacao.findAll();
        res.status(200).json(acomodacoes);
    } catch (error) {
        console.error('Erro ao buscar acomodações:', error);
        res.status(500).json({ message: 'Erro ao buscar acomodações', error: error.message });
    }
};

// Buscar uma acomodação específica
exports.buscarAcomodacao = async (req, res) => {
    try {
        const acomodacao = await Acomodacao.findByPk(req.params.id);
        if (!acomodacao) {
            return res.status(404).json({ message: 'Acomodação não encontrada' });
        }
        res.status(200).json(acomodacao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar acomodação', error: error.message });
    }
};

// Criar nova acomodação
exports.criarAcomodacao = async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        
        // Validações básicas
        if (!req.body.nome || !req.body.descricao || !req.body.capacidade) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        if (req.body.capacidade <= 0) {
            return res.status(400).json({ error: 'A capacidade deve ser maior que zero' });
        }

        const novaAcomodacao = await Acomodacao.create({
            ...req.body,
            ocupacaoAtual: 0,
            status: 'disponivel'
        });
        
        console.log('Acomodação criada:', novaAcomodacao);
        res.status(201).json(novaAcomodacao);
    } catch (error) {
        console.error('Erro detalhado ao criar acomodação:', error);
        res.status(400).json({ error: error.message });
    }
};

// Atualizar acomodação
exports.atualizarAcomodacao = async (req, res) => {
    try {
        const acomodacao = await Acomodacao.findByPk(req.params.id);
        
        if (!acomodacao) {
            return res.status(404).json({ message: 'Acomodação não encontrada' });
        }

        // Validar se a nova capacidade máxima é menor que a ocupação atual
        if (req.body.capacidade && req.body.capacidade < acomodacao.ocupacaoAtual) {
            return res.status(400).json({ 
                message: 'A nova capacidade máxima não pode ser menor que a ocupação atual' 
            });
        }

        const [updated] = await Acomodacao.update(req.body, {
            where: { idAcomodacao: req.params.id }
        });

        const acomodacaoAtualizada = await Acomodacao.findByPk(req.params.id);
        res.status(200).json(acomodacaoAtualizada);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar acomodação', error: error.message });
    }
};

// Deletar acomodação
exports.deletarAcomodacao = async (req, res) => {
    try {
        const acomodacao = await Acomodacao.findByPk(req.params.id);
        
        if (!acomodacao) {
            return res.status(404).json({ message: 'Acomodação não encontrada' });
        }

        // Verificar se há pets na acomodação
        if (acomodacao.ocupacaoAtual > 0) {
            return res.status(400).json({ 
                message: 'Não é possível deletar uma acomodação que possui pets' 
            });
        }

        await acomodacao.destroy();
        res.status(200).json({ message: 'Acomodação removida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar acomodação', error: error.message });
    }
};

// Atualizar ocupação da acomodação
exports.atualizarOcupacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { acao } = req.body; // 'adicionar' ou 'remover'
        
        const acomodacao = await Acomodacao.findByPk(id);
        
        if (!acomodacao) {
            return res.status(404).json({ message: 'Acomodação não encontrada' });
        }

        let novaOcupacao = acomodacao.ocupacaoAtual;
        
        if (acao === 'adicionar') {
            if (acomodacao.ocupacaoAtual >= acomodacao.capacidade) {
                return res.status(400).json({ message: 'Acomodação está na capacidade máxima' });
            }
            novaOcupacao += 1;
        } else if (acao === 'remover') {
            if (acomodacao.ocupacaoAtual <= 0) {
                return res.status(400).json({ message: 'Acomodação já está vazia' });
            }
            novaOcupacao -= 1;
        } else {
            return res.status(400).json({ message: 'Ação inválida' });
        }

        // Atualizar status baseado na nova ocupação
        let novoStatus = acomodacao.status;
        if (novaOcupacao === 0) {
            novoStatus = 'disponivel';
        } else if (novaOcupacao === acomodacao.capacidade) {
            novoStatus = 'ocupada';
        }

        await Acomodacao.update(
            { 
                ocupacaoAtual: novaOcupacao,
                status: novoStatus
            },
            { where: { idAcomodacao: id } }
        );

        const acomodacaoAtualizada = await Acomodacao.findByPk(id);
        res.status(200).json(acomodacaoAtualizada);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar ocupação', error: error.message });
    }
};
