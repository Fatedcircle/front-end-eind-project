class ProductCard {
    constructor(product) {
        this.product = product;
        this.cardDiv = this.createCard();

        // Voeg event listener toe voor de knop "Meer details"
        const moreDetailsButton = this.cardDiv.querySelector('.btn-primary');
        moreDetailsButton.addEventListener('click', () => this.navigateToProductPage());

        // Voeg event listener toe voor de knop "Voeg toe aan winkelmandje"
        const addToCartButton = this.cardDiv.querySelector('#addToCart');
        if (this.product.hoeveelheid > 0) { // Controleer de voorraad
            addToCartButton.addEventListener('click', () => this.addToCartAndRefreshBadge());
        } else {
            addToCartButton.textContent = 'Uitverkocht'; // Knoptekst wijzigen
            addToCartButton.classList.add('btn-secondary'); // Voeg een andere stijl toe
            addToCartButton.disabled = true; // Maak de knop inactief
        }
    }

    createCard() {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col-md-2', 'align-items-stretch'); // Pas de gewenste kolomgrootte aan

        let optionsDropdown = '';
        if (this.product.opties && this.product.opties.length > 0) {
            optionsDropdown = ProductCard.createOptionsDropdown();
        }
        cardDiv.innerHTML = `
            <div class="card mb-2 h-100">
                <img src="${this.product.afbeeldingen[0]}" class="card-img-top" alt="${this.product.naam}">
                <div class="card-body">
                    <h5 class="card-title">${this.product.naam}</h5>
                    <p class="card-text">Prijs: ${this.product.prijs} punten</p>
                    <p class="card-text">${this.product.kortebeschrijving}</p>
                    
                    <!-- Dropdown voor productopties (indien van toepassing) -->
                    ${this.product.opties ? ProductCard.createOptionsDropdown() : ''}
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="this.navigateToProductPage()">Meer details</button>
                    <button class="btn btn-primary" id="addToCart">Voeg toe aan winkelmandje</button>
                </div>
            </div>
        `;

        return cardDiv;
    }
    static createOptionsDropdown() {
        // Hier kun je de code genereren voor de dropdown op basis van product.opties
        // Plaats de gewenste dropdown-items in de dropdown-menu
        return `
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" 
                id="productOptionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Selecteer optie
                </button>
                <ul class="dropdown-menu" aria-labelledby="productOptionsDropdown">
                    <li><a class="dropdown-item" href="#">Optie 1</a></li>
                    <li><a class="dropdown-item" href="#">Optie 2</a></li>
                    <li><a class="dropdown-item" href="#">Optie 3</a></li>
                </ul>
            </div>
        `;
    }


    navigateToProductPage() {
        const productPageURL = `product.html?product=${encodeURIComponent(this.product.naam)}`;
        window.location.href = productPageURL;
    }
    addToCartAndRefreshBadge() {
        // Controleer of het product al in het winkelwagentje zit
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const isProductInCart = cart.some(item => item.naam === this.product.naam);

        if (isProductInCart) {
            // Product zit al in het winkelwagentje, toon een melding
            ProductCard.showDuplicateProductNotification();
        } else {
            // Voeg het geselecteerde product toe aan de winkelwagen
            cart.push(this.product);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Roep de showNotification-functie aan om een notificatie weer te geven
            ProductCard.showNotification();

            // Stuur een updatebericht naar de badge
            const event = new Event('updateCartBadge');
            document.dispatchEvent(event);
        }
    }

    static showDuplicateProductNotification() {
        const container = document.querySelector('.container.alert');

        // Maak een nieuwe melding
        const notification = document.createElement('div');
        notification.classList.add('alert', 'alert-warning', 'alert-dismissable', 'text-center');

        const message = document.createTextNode('Dit product zit al in het winkelwagentje.');

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'Close');

        notification.appendChild(message);
        notification.appendChild(closeButton);

        container.appendChild(notification);
    }

    static showNotification() {
        const container = document.querySelector('.container.alert');

        // Maak een nieuwe melding
        const notification = document.createElement('div');
        notification.classList.add('alert', 'alert-success', 'alert-dismissable', 'text-center');

        const message = document.createTextNode('Product is toegevoegd aan het winkelmandje.');

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'Close');

        notification.appendChild(message);
        notification.appendChild(closeButton);

        container.appendChild(notification);
    }
    static updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const badge = document.getElementById('cart-badge');
        badge.textContent = cart.length;
        if (cart.length > 0) {
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productCardsContainer = document.getElementById('productCards');

    products.forEach(function (product) {
        const productCard = new ProductCard(product);
        productCardsContainer.appendChild(productCard.cardDiv);
    });
    ProductCard.createOptionsDropdown();
    // Roep de updateCartBadge-functie aan bij het laden van de pagina
    ProductCard.updateCartBadge();
    // Voeg een event listener toe om de badge bij te werken wanneer er een update wordt verzonden
    document.addEventListener('updateCartBadge', ProductCard.updateCartBadge);
});

// HTML-elementen
const openModalButton = document.getElementById('openModalButton');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeButton');
const modalContent = document.querySelector('.modal-content');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitLogin = document.getElementById('submitLogin');

// Verberg de modal bij het laden van de pagina
loginModal.style.display = 'none';

// Voeg een klikgebeurtenis toe aan de knop in de navbar om de modal te openen
openModalButton.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

// Voeg een klikgebeurtenis toe aan de close-knop om de modal te sluiten
closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Voeg een klikgebeurtenis toe om de modal te sluiten wanneer buiten de modal wordt geklikt
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Voorkom dat klikken in de modal zelf de modal sluit
modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Voeg een klikgebeurtenis toe aan de inlogknop
submitLogin.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Voer hier je authenticatielogica uit. Dit is een eenvoudig voorbeeld.
    if (username === 'admin' && password === 'admin') {
        window.location.href = 'admin.html'; // Doorsturen naar admin.html bij succesvol inloggen
    } else {
        alert('Onjuiste gebruikersnaam of wachtwoord. Probeer opnieuw.');
    }
});

