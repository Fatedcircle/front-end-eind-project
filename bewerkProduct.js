class ProductEditor {
    constructor(productId) {
        this.productId = productId;
        this.product = ProductEditor.getProductFromLocalStorage(this.productId) || {};
        this.initializeForm();
    }

    initializeForm() {
        this.productForm = document.getElementById('editProductForm');
        this.productForm.addEventListener('submit', (event) => this.handleFormSubmit(event));

        // Vul het formulier met bestaande gegevens
        this.fillFormWithProductData();
    }

    static getProductFromLocalStorage(productId) {
        const productsData = localStorage.getItem('products');
        const products = productsData ? JSON.parse(productsData) : [];

        // Zoek het product met het overeenkomstige product-id
        return products.find((product) => product.id === productId) || {};
    }

    fillFormWithProductData() {
        document.getElementById('naam').value = this.product.naam || '';
        document.getElementById('kortebeschrijving').value = this.product.kortebeschrijving || '';
        document.getElementById('langeBeschrijving').value = this.product.langebeschrijving || '';
        document.getElementById('prijs').value = this.product.prijs || '';
        document.getElementById('hoeveelheid').value = this.product.hoeveelheid || '';
        ProductEditor.setOptions(this.product.opties || []);
        if (this.product.afbeeldingen && this.product.afbeeldingen.length > 0) {
            document.getElementById('image1').value = this.product.afbeeldingen[0];
            document.getElementById('image2').value = this.product.afbeeldingen[1] || '';
            document.getElementById('image3').value = this.product.afbeeldingen[2] || '';
            document.getElementById('image4').value = this.product.afbeeldingen[3] || '';
            document.getElementById('image5').value = this.product.afbeeldingen[4] || '';
        }
    }

    static setOptions(selectedOptions) {
        const optionCheckboxes = document.querySelectorAll('input[name="optie"]');
        optionCheckboxes.forEach((checkbox) => {
            checkbox.checked = selectedOptions.includes(checkbox.value);
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();

        // Haal gegevens op van het formulier
        this.product.naam = document.getElementById('naam').value;
        this.product.kortebeschrijving = document.getElementById('kortebeschrijving').value;
        this.product.langebeschrijving = document.getElementById('langeBeschrijving').value;
        this.product.prijs = parseFloat(document.getElementById('prijs').value);
        this.product.hoeveelheid = parseInt(document.getElementById('hoeveelheid').value, 10);
        this.product.opties = this.getSelectedOptions();
        this.product.afbeeldingen[0] = document.getElementById('image1').value;
        this.product.afbeeldingen[1] = document.getElementById('image2').value;
        this.product.afbeeldingen[2] = document.getElementById('image3').value;
        this.product.afbeeldingen[3] = document.getElementById('image4').value;
        this.product.afbeeldingen[4] = document.getElementById('image5').value;

        // Haal alle producten op
        const productsData = localStorage.getItem('products');
        const products = productsData ? JSON.parse(productsData) : [];

        // Werk het bijgewerkte product bij in de array
        const updatedProducts = products.map((product) => {
            if (product.id === this.productId) {
                return this.product;
            }
            return product;
        });

        // Sla de bijgewerkte array op in de lokale opslag
        localStorage.setItem('products', JSON.stringify(updatedProducts));

        alert('Productgegevens zijn bijgewerkt en opgeslagen in de lokale opslag.');
        window.location.href = "admin.html";
    }

    static getSelectedOptions() {
        const selectedOptions = [];
        const optionCheckboxes = document.querySelectorAll('input[name="optie"]');
        optionCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedOptions.push(checkbox.value);
            }
        });
        return selectedOptions;
    }
}

// Haal het product-id op uit de URL
const urlSearchParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlSearchParams.get('id'), 10);

// Maak een instantie van ProductEditor met het opgehaalde product-id
window.addEventListener('load', () => {
    if (productId) {
        const productEditor = new ProductEditor(productId);
    }
});
