Toastify({
    text: "Projeto ainda em desenvolvimento, podendo ocorrer bugs",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
        background: "#14B64A",
    },
}).showToast();

const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkOutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const optionalInput = document.getElementById("optional")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//abrir o modal do carrinho

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"

})

//quando fechar o modal clicando fora

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal)
        cartModal.style.display = "none"
})

//quando fechar o modal clicando em "fechar"

closeModalBtn.addEventListener("click", function (event) {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {

    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

    }
})

//função para add no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

//atualiza o carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
    <div class="flex items-center justify-between">
    <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
    </div>

        <button class="border p-1 rounded-md border-red-500 text-red-500 remove-from-cart-btn" data-name="${item.name}" >
        Remover
        </button

    </div>       
    `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}

// FUNÇÃO PARA REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }


}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.inputValue;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkOutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops, no momento estamos fechados",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o Pedido para API
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "61983586190"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} Opcional: ${optionalInput.value}`, "_blank")

    cart.length = 0
    updateCartModal();

})

// Verificar a hora e mainuplar o card do horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23 //true = restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();
if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")

} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

