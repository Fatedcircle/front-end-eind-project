class ProductManager {
    constructor() {
        ProductManager.initialize();
    }

    static initialize() {
        document.addEventListener("DOMContentLoaded", () => {
            const addProductForm = document.getElementById("addProductForm");
            addProductForm.addEventListener("submit", (event) => {
                event.preventDefault();
                ProductManager.addProduct();
            });
        });
    }

    static addProduct() {
        const productName = document.getElementById("naam").value;
        const productShortDescription = document.getElementById("korteBeschrijving").value;
        const productLongDescription = document.getElementById("langeBeschrijving").value;
        const productPrice = document.getElementById("prijs").value;
        const productAmount = document.getElementById("hoeveelheid").value;

        const image1 = document.getElementById("image1").value.trim();
        const image2 = document.getElementById("image2").value.trim();
        const image3 = document.getElementById("image3").value.trim();
        const image4 = document.getElementById("image4").value.trim();
        const image5 = document.getElementById("image5").value.trim();

        const selectedOptions = [];
        const optionElements = document.querySelectorAll("select option:checked");
        optionElements.forEach((option) => {
            selectedOptions.push(option.value);
        });

        if (image1 !== "") {
            const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
            const newProductId = ProductManager.generateProductId(existingProducts);

            const newProduct = {
                id: newProductId,
                naam: productName,
                kortebeschrijving: productShortDescription,
                langebeschrijving: productLongDescription,
                prijs: parseFloat(productPrice),
                hoeveelheid: productAmount,
                afbeeldingen: [image1, image2, image3, image4, image5].filter(Boolean),
                opties: selectedOptions,
            };

            existingProducts.push(newProduct);
            localStorage.setItem("products", JSON.stringify(existingProducts));
        } else {
            // Toon een foutmelding of voer andere logica uit als de URL voor image1 ontbreekt
        }

        window.location.href = "admin.html";
    }

    static generateProductId(existingProducts) {
        let highestId = 0;
        for (let i = 0; i < existingProducts.length; i++) {
            const productId = existingProducts[i].id;
            if (productId > highestId) {
                highestId = productId;
            }
        }
        return highestId + 1;
    }
}



// Maak een instantie van ProductManager om de functionaliteit te starten
const productManager = new ProductManager();