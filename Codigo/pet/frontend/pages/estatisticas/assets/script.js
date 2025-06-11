document.addEventListener('DOMContentLoaded', function() {
    requireUserType('Funcionario');
    
    if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('userName').textContent = user.nome;
        }
        carregarEstatisticas();
    }
});

async function carregarEstatisticas() {
    try {
        const capacidadeMaxima = 12;
        // Carregar reservas ativas e finalizadas dos últimos 7 dias
        const responsePets = await authenticatedFetch("http://localhost:3060/api/reservas/active-pets-report");
        if (!responsePets.ok) {
            throw new Error(`HTTP error! status: ${responsePets.status}`);
        }
        const reservas = await responsePets.json();
        
        // Calcular reservas ativas atuais
        const reservasAtivas = reservas.filter(reserva => reserva.status === 'Ativa');
        document.getElementById('reservasAtivas').textContent = reservasAtivas.length;
        
        // Calcular ocupação atual
        const ocupacaoAtual = (reservasAtivas.length / capacidadeMaxima) * 100;
        document.getElementById('ocupacaoAtual').textContent = `${Math.round(ocupacaoAtual)}%`;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas

        // Calcular taxa de ocupação mensal usando os dados que já temos
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const reservasMes = reservas.filter(reserva => {
            const dataInicio = new Date(reserva.data_entrada);
            const dataFim = new Date(reserva.data_saida);
            const isReservaValida = (dataInicio >= inicioMes || dataFim >= inicioMes) && 
                   (reserva.status === 'Ativa' || reserva.status === 'Finalizada');
            return isReservaValida;
        });
        const taxaOcupacaoMensal = (reservasMes.length / capacidadeMaxima) * 100;
        document.getElementById('taxaOcupacaoMensal').textContent = `${Math.round(taxaOcupacaoMensal)}%`;

        // Criar gráfico de ocupação
        criarGraficoOcupacao(reservas, capacidadeMaxima);

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        if (error.message.includes("401")) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            logout();
        } else {
            alert("Erro ao carregar estatísticas. Por favor, tente novamente.");
        }
    }
}

function criarGraficoOcupacao(reservas, capacidadeMaxima) {
    const canvas = document.querySelector('#graficoOcupacao canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Preparar dados para os últimos 7 dias
    const labels = [];
    const dados = [];
    const cores = [];
    const coresFundo = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - i);
        labels.push(data.toLocaleDateString('pt-BR'));

        // Contar reservas ativas e finalizadas para este dia
        const reservasNoDia = reservas.filter(reserva => {
            const dataInicio = new Date(reserva.data_entrada);
            const dataFim = new Date(reserva.data_saida);
            dataInicio.setHours(0, 0, 0, 0);
            dataFim.setHours(0, 0, 0, 0);
            const isReservaNoDia = (dataInicio <= data && dataFim >= data) && 
                   (reserva.status === 'Ativa' || reserva.status === 'Finalizada');
            return isReservaNoDia;
        }).length;

        const ocupacao = (reservasNoDia / capacidadeMaxima) * 100;
        dados.push(Math.round(ocupacao));
        
        // Definir cores baseadas na ocupação
        let cor;
        if (ocupacao <= 40) {
            cor = '#28a745'; // Verde
        } else if (ocupacao <= 70) {
            cor = '#ffc107'; // Amarelo
        } else {
            cor = '#dc3545'; // Vermelho
        }
        cores.push(cor);
        coresFundo.push(`${cor}20`); // Versão transparente da cor
    }

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Taxa de Ocupação (%)',
                data: dados,
                borderColor: cores,
                backgroundColor: coresFundo,
                tension: 0.4,
                fill: true,
                segment: {
                    borderColor: ctx => cores[ctx.p0DataIndex],
                }
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Taxa de Ocupação dos Últimos 7 Dias',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            let status = '';
                            if (value <= 40) status = '(Baixa)';
                            else if (value <= 70) status = '(Média)';
                            else status = '(Alta)';
                            return `Ocupação: ${value}% ${status}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Ocupação (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            }
        }
    });
}

function toggleMenu() {
    const menuMobile = document.getElementById("menu-mobile")
    if(menuMobile.className === "menu-mobile-active") {
        menuMobile.className = "menu-mobile"
    } else {
        menuMobile.className = "menu-mobile-active"
    }
}
