// Verificar autenticação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    requireUserType('Funcionario');
    
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.nome;
    }

    carregarPetsHospedados();
});

// Função para carregar os pets com reservas ativas
async function carregarPetsHospedados() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas/active-pets-report`);
        const dados = await response.json();
        
        const tableBody = document.getElementById('petsTableBody');
        tableBody.innerHTML = '';

        if (!Array.isArray(dados) || dados.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        Não há pets hospedados no momento.
                    </td>
                </tr>
            `;
            return;
        }

        dados.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.pet.nome}</td>
                <td>${item.tutor.nome}</td>
                <td>${formatarData(item.data_entrada)}</td>
                <td>${formatarData(item.data_saida)}</td>
                <td><span class="badge bg-success">Ativo</span></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar os pets:', error);
        if (error.message.includes('401')) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            logout();
        } else {
            alert('Erro ao carregar os dados dos pets hospedados.');
        }
    }
}

// Função para formatar a data
function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

// Função para gerar o PDF
async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const elemento = document.getElementById('relatorio');
    
    try {
        // Adicionar classe para melhorar a aparência durante a captura
        elemento.classList.add('printing');
        
        const canvas = await html2canvas(elemento);
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Adicionar cabeçalho
        pdf.setFontSize(16);
        pdf.text('Relatório de Pets Hospedados', pdfWidth/2, 15, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pdfWidth/2, 25, { align: 'center' });
        
        // Adicionar a tabela
        pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, pdfHeight);
        
        pdf.save('relatorio-pets-hospedados.pdf');
        
        // Remover classe de impressão
        elemento.classList.remove('printing');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o PDF.');
        elemento.classList.remove('printing');
    }
}

// Função para alternar o menu mobile
function toggleMenu() {
    const menuMobile = document.getElementById("menu-mobile");
    if (menuMobile.className === "menu-mobile-active") {
        menuMobile.className = "menu-mobile";
    } else {
        menuMobile.className = "menu-mobile-active";
    }
} 