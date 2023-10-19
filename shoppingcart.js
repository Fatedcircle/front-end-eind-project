class ShoppingCart {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartListElement = document.getElementById('cart-items');
        this.totalPriceElement = document.getElementById('total-price');
        this.placeOrderButton = document.getElementById('place-order');
        this.alertMessage = document.getElementById('alert-message');
        this.cartBadge = document.getElementById('cart-badge');
    }

    renderCart() {
        this.cartListElement.innerHTML = '';
        this.cartItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';

            const image = document.createElement('img');
            image.src = item.afbeeldingen[0];
            image.alt = item.naam;
            li.appendChild(image);

            const itemText = document.createElement('span');
            itemText.textContent = `${item.naam} - Prijs: ${item.prijs}`;
            li.appendChild(itemText);

            // Voeg een inputveld toe om de hoeveelheid te wijzigen
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.hoeveelheid;
            quantityInput.addEventListener('change', (event) => this.updateQuantity(item, event.target.value));
            li.appendChild(quantityInput);

            this.cartListElement.appendChild(li);
        });
    }

    calculateTotalPrice() {
        const totalPrice = this.cartItems.reduce((total, item) => total + item.prijs * item.hoeveelheid, 0);
        this.totalPriceElement.textContent = `Totaalprijs: ${totalPrice}`;
    }

    updateQuantity(item, newQuantity) {
        if (newQuantity <= 0) {
            // Als de hoeveelheid 0 of minder is, verwijder het item uit de winkelwagen
            this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
        } else {
            // Update de hoeveelheid van het item
            item.hoeveelheid = parseInt(newQuantity);
        }

        // Bijwerken van de lokale opslag met de bijgewerkte winkelwagen
        localStorage.setItem('cart', JSON.stringify(this.cartItems));

        this.renderCart(); // Herrender de winkelwagen
        this.calculateTotalPrice(); // Herbereken de totaalprijs
    }

    placeOrder() {
        const orders = JSON.parse(localStorage.getItem('bestellingen')) || [];
        const totalPrice = this.cartItems.reduce((total, item) => total + item.prijs * item.hoeveelheid, 0);
        orders.push({ items: this.cartItems, total: totalPrice });
        localStorage.setItem('bestellingen', JSON.stringify(orders));

        // Haal de huidige productgegevens op uit localStorage
        const productData = JSON.parse(localStorage.getItem('products')) || {};

        // Werk de productgegevens bij op basis van de huidige winkelwageninhoud
        this.cartItems.forEach(item => {
            const productID = item.id - 1; // De ID's beginnen bij 1, we passen ze aan naar een nulgebaseerde index
            if (productData[productID]) {
                productData[productID].hoeveelheid -= item.hoeveelheid;
                if (productData[productID].hoeveelheid < 0) {
                    productData[productID].hoeveelheid = 0; // Zorg ervoor dat de hoeveelheid niet negatief wordt
                }
            }
        });
        // Sla de bijgewerkte productgegevens op in localStorage
        localStorage.setItem('products', JSON.stringify(productData));


        localStorage.removeItem('cart');
        this.cartItems = []; // Maak de winkelwagen leeg

        this.alertMessage.textContent = 'Bedankt voor uw bestelling!';
        this.alertMessage.style.display = 'block';
        this.renderCart(); // Herrender de lege winkelwagen
    }
    createClearCartButton() {
        const clearCartButton = document.createElement('button');
        clearCartButton.textContent = 'Winkelwagen leegmaken';
        clearCartButton.addEventListener('click', () => this.clearCart());
        document.body.appendChild(clearCartButton);
    }

    clearCart() {
        localStorage.removeItem('cart');
        this.cartItems = [];
        this.renderCart(); // Herrender de lege winkelwagen
    }


    initialize() {
        this.renderCart();
        this.calculateTotalPrice();
        this.placeOrderButton.addEventListener('click', () => this.placeOrder());
        this.createClearCartButton();
    }
}

const shoppingCart = new ShoppingCart();
shoppingCart.initialize();
