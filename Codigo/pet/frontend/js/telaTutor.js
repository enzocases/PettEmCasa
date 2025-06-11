function toggleMenu(){
    const menuMobile = document.getElementById("menu-mobile")
    if(menuMobile.className === "menu-mobile-active"){
        menuMobile.className = "menu-mobile"
    }else{
        menuMobile.className = "menu-mobile-active"
    }
}

document.addEventListener("DOMContentLoaded", function () {
    iniciarTour();
});
/* para quando tiver que deixar o tour os para primeiro acesso
document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("tourVisto")) {
        iniciarTour();
        localStorage.setItem("tourVisto", "true");
    }
});
*/ 

function iniciarTour() {
    introJs().setOptions({
        steps: [
            {
                title: "Seja bem-vindo à sua página!",
                intro: "Aqui um pequeno tour das nossas funcionalidades"
            },
            {
                element: document.querySelector(".editar"),
                intro: "Aqui você pode alterar informações cadastradas"
            },
            {
                element: document.querySelector(".gerenciarPet"),
                intro: "Aqui você pode adicionar informações do seu pet"
            },
            {
                element: document.querySelector(".reservas"),
                intro: "Aqui você adiciona e visualiza suas reservas"
            },
            {
                element: document.querySelector(".boletim"),
                intro: "Aqui você pode visualizar o boletim do seu pet"
            }
        ],
        nextLabel: "Próximo",
        prevLabel: "Voltar",
        doneLabel: "Concluir"
    }).start();
}

