// Definieer een lege lijst van producten
const products = [];
// Definieer een klasse voor het product
class Product {
    constructor(naam, prijs) {
        this.naam = naam;
        this.prijs = prijs;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Haal de opgeslagen producten in het winkelwagentje op uit localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // ...

    // Voeg een eventlistener toe aan de knop om een product aan het winkelwagentje toe te voegen
    function addToCart(productName, productPrice) {
        // Zoek het product in de lijst van producten
        const selectedProduct = products.find(product => product.naam === productName);

        // Als het product gevonden is, voeg het toe aan het winkelwagentje
        if (selectedProduct) {
            const cartItem = new Product(selectedProduct.naam, selectedProduct.prijs);

            cart.push(cartItem);

            // Sla het bijgewerkte winkelwagentje op in localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
});
