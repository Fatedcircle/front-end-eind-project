document.addEventListener('DOMContentLoaded', function () {
    class AdminPage {
        constructor() {
            this.loadProductsButton = document.getElementById('loadProductsButton');
            this.productsContainer = document.getElementById('productsContainer');

            this.loadProductsButton.addEventListener('click', () => this.loadProducts());
        }

        displayProducts(products) {
            const table = document.createElement('table');
            table.classList.add('table');
            const tableHead = document.createElement('thead');
            const headRow = tableHead.insertRow();
            const headers = ['ID', 'Naam', 'kortebeschrijving', 'Prijs', 'Hoeveelheid', 'Bewerk', 'Verwijder'];

            headers.forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headRow.appendChild(th);
            });

            table.appendChild(tableHead);

            const tableBody = document.createElement('tbody');

            products.forEach((product) => {
                const row = tableBody.insertRow();
                row.setAttribute('data-product-id', product.id);

                headers.forEach((header) => {
                    const cell = row.insertCell();

                    if (header.toLowerCase() === 'hoeveelheid') {
                        if (product[header.toLowerCase()] == 0) {
                            cell.textContent = 'Uitverkocht';
                        } else {
                            cell.textContent = product[header.toLowerCase()];
                        }
                    } else if (header.toLowerCase() === 'bewerk') {
                        const editButton = document.createElement('button');
                        editButton.textContent = 'Bewerk';
                        editButton.classList.add('edit-button');
                        editButton.setAttribute('data-product-id', product.id);
                        editButton.addEventListener('click', () => AdminPage.editProduct(product));
                        cell.appendChild(editButton);
                    } else if (header.toLowerCase() === 'verwijder') {
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Verwijder';
                        deleteButton.setAttribute('data-product-id', product.id);
                        deleteButton.addEventListener('click', () => AdminPage.deleteProduct(deleteButton));
                        cell.appendChild(deleteButton);
                    } else {
                        cell.textContent = product[header.toLowerCase()];
                    }
                });
            });

            table.appendChild(tableBody);
            this.productsContainer.innerHTML = '';
            this.productsContainer.appendChild(table);
        }

        displayProductsFromLocalStorage() {
            const storedProducts = JSON.parse(localStorage.getItem('products'));
            if (storedProducts) {
                this.displayProducts(storedProducts);
            }
        }

        loadProducts() {
            localStorage.removeItem('products');

            fetch('./producten.json')
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem('products', JSON.stringify(data));
                    this.displayProducts(data);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Er is een fout opgetreden bij het laden van producten: ' + error);
                });
        }

        static displayOrders(orders) {
            const ordersContainer = document.querySelector('.orders-container');

            ordersContainer.innerHTML = '';
            orders.forEach((order, index) => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order');

                const orderHeader = document.createElement('h2');
                orderHeader.textContent = `Bestelling #${index + 1} - Totale prijs: ${order.total} punten`;

                const orderItemsList = document.createElement('ul');

                order.items.forEach((item) => {
                    const itemLi = document.createElement('li');
                    itemLi.innerHTML = `${item.hoeveelheid}x ${item.naam} - Prijs per stuk: ${item.prijs} punten`;
                    orderItemsList.appendChild(itemLi);
                });

                const hr = document.createElement('hr');

                orderDiv.appendChild(orderHeader);
                orderDiv.appendChild(orderItemsList);
                orderDiv.appendChild(hr);

                ordersContainer.appendChild(orderDiv);
            });
        }

        static displayOrdersFromLocalStorage() {
            const storedOrders = JSON.parse(localStorage.getItem('bestellingen'));
            if (storedOrders) {
                AdminPage.displayOrders(storedOrders);
            }
        }

        static deleteProduct(deleteButton) {
            const productId = deleteButton.getAttribute('data-product-id');
            let storedProducts = JSON.parse(localStorage.getItem('products'));
            storedProducts = storedProducts.filter((product) => product.id !== parseInt(productId, 10));
            localStorage.setItem('products', JSON.stringify(storedProducts));

            const row = deleteButton.closest('tr');
            if (row) {
                row.remove();
            }
        }

        static editProduct(product) {
            window.location.href = `bewerkProduct.html?id=${product.id}`;
        }
    }

    const adminPage = new AdminPage();
    adminPage.displayProductsFromLocalStorage();
    AdminPage.displayOrdersFromLocalStorage();

    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('edit-button')) {
            const productId = event.target.getAttribute('data-product-id');
            const storedProducts = JSON.parse(localStorage.getItem('products'));
            if (storedProducts) {
                const product = storedProducts.find(p => p.id === parseInt(productId, 10));
                if (product) {
                    AdminPage.editProduct(product);
                }
            }
        }
    });
});
