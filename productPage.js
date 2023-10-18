class ProductPage {
    constructor() {
        this.products = JSON.parse(localStorage.getItem("products"));
        this.urlParams = new URLSearchParams(window.location.search);
        this.productName = this.urlParams.get("product");
        this.product = this.findProductByName(this.productName);

        if (this.product) {
            this.titleElement = document.querySelector("h2");
            this.descriptionElement = document.querySelector("p");
            this.carouselInner = document.querySelector(".carousel-inner");
            this.carouselIndicators = document.querySelector(".carousel-indicators");
            this.productOptionsLabel = document.getElementById("optionsLabel");
            this.productOptions = document.querySelector("#productOptions");
            this.knopDiv = document.getElementById("knop");

            this.fillProductDetails();
            this.fillCarousel();
            this.fillProductOptions();

            if (this.product.hoeveelheid == 0) {
                this.disableAddToCartButton();
            } else {
                this.createAddToCartButton();
            }
        }
    }

    findProductByName(productName) {
        return this.products.find((p) => p.naam === productName);
    }

    fillProductDetails() {
        this.titleElement.textContent = this.product.naam;
        this.descriptionElement.textContent = this.product.langebeschrijving || this.product.kortebeschrijving;
    }

    fillCarousel() {
        this.carouselInner.innerHTML = "";
        this.carouselIndicators.innerHTML = "";

        if (this.product.afbeeldingen.length > 1) {
            this.product.afbeeldingen.forEach((image, index) => {
                const carouselItem = document.createElement("div");
                carouselItem.className = "carousel-item";
                if (index === 0) {
                    carouselItem.classList.add("active");
                }
                carouselItem.innerHTML = `<img src="${image}" class="d-block w-100" alt="Product Image ${index + 1}">`;
                this.carouselInner.appendChild(carouselItem);

                const indicator = document.createElement("button");
                indicator.type = "button";
                indicator.setAttribute("data-bs-target", "#productCarousel");
                indicator.setAttribute("data-bs-slide-to", index.toString());
                if (index === 0) {
                    indicator.classList.add("active");
                }
                indicator.style.width = "100px";
                indicator.innerHTML = `<img class="d-block w-100" src="${image}" alt="Thumbnail ${index + 1}">`;
                this.carouselIndicators.appendChild(indicator);
            });
        } else {
            const carouselItem = document.createElement("div");
            carouselItem.className = "carousel-item active";
            carouselItem.innerHTML = `<img src="${this.product.afbeeldingen[0]}" 
            class="d-block w-100" alt="Product Image 1">`;
            this.carouselInner.appendChild(carouselItem);
        }
    }

    fillProductOptions() {
        if (!this.product.opties || this.product.opties.length === 0) {
            this.productOptionsLabel.style.display = "none";
            this.productOptions.style.display = "none";
        } else {
            this.productOptionsLabel.textContent = "Opties:";
            this.productOptions.innerHTML = "";
            this.product.opties.forEach((optie) => {
                const option = document.createElement("option");
                option.value = optie;
                option.textContent = optie;
                this.productOptions.appendChild(option);
            });
        }
    }

    createAddToCartButton() {
        const addToCartButton = document.createElement("button");
        addToCartButton.className = "btn btn-primary";
        addToCartButton.textContent = "Voeg toe aan winkelmandje";
        addToCartButton.setAttribute("id", "addToCartButton"); // Voeg hier het ID toe
        this.knopDiv.appendChild(addToCartButton);
    }

    disableAddToCartButton() {
        const addToCartButton = document.createElement("button");
        addToCartButton.className = "btn btn-secondary";
        addToCartButton.textContent = "Uitverkocht";
        addToCartButton.disabled = true;
        this.knopDiv.appendChild(addToCartButton);
    }
    addToCartAndRefreshBadge() {
        // Voeg het geselecteerde product toe aan de winkelwagen
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(this.product);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Roep de showNotification-functie aan om een notificatie weer te geven
        ProductPage.showNotification();
        // Stuur een updatebericht naar de badge
        const event = new Event('updateCartBadge');
        document.dispatchEvent(event);
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
}

// Instantiate the ProductPage class
const productPage = new ProductPage();
document.addEventListener('DOMContentLoaded', function () {
    ProductPage.updateCartBadge();
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            // Roep de addToCartAndRefreshBadge methode aan wanneer de knop wordt geklikt
            productPage.addToCartAndRefreshBadge();
        });
    }

    // Voeg een event listener toe om te reageren op 'updateCartBadge' evenement
    document.addEventListener('updateCartBadge', function () {
        ProductPage.updateCartBadge();
    });
});
