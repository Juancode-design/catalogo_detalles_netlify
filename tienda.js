        // --- CONFIGURACIÓN DE TASAS MANUALES (BACKUP) ---
        const manualExchangeRates = {
        'VES': 505.00, // Ejemplo: 45.50 Bolívares por Dólar
        'EUR': 0.92,  // Ejemplo: 0.92 Euros por Dólar
        'PEN': 3.75   // Ejemplo: 3.75 Soles por Dólar
        };
		
		const allProducts = [
            { id: 1, category: 'relojes', 
			name: "Chupones para vidrio", 
			priceUSD: 0.50, description: "Ventosas pequeñas transparentes de 1.2 pulgadas para vidrio.", 
			images: [
                           "./img/chupon-1.jpg",
			] },
			
            { id: 2, category: 'audio', 
			name: "Producto 2", 
			priceUSD: 249.50, 
			description: "Cancelación de ruido activa.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 3, category: 'camaras', 
			name: "Producto 3", 
			priceUSD: 899.00, 
			description: "Video profesional y enfoque automático.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 4, category: 'computacion', 
			name: "Producto 4", 
			priceUSD: 1250.00, 
			description: "Potencia extrema para creadores.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 5, category: 'relojes', 
			name: "Producto 5", 
			priceUSD: 999.00, 
			description: "Pantalla OLED y cámara de 108MP.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 6, category: 'audio', 
			name: "Producto 6", 
			priceUSD: 550.00, 
			description: "Perfecta para diseño y multimedia.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 7, category: 'camaras', 
			name: "Producto 7", 
			priceUSD: 120.00, 
			description: "Asistente inteligente con sonido 360.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 8, category: 'computacion', 
			name: "Producto 8", 
			priceUSD: 699.00, 
			description: "Vuelo estable y grabación 4K HDR.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 9, category: 'camaras', 
			name: "Producto 9", 
			priceUSD: 150.00, 
			description: "Elegancia clásica con mecanismo automático.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] },
			
            { id: 10, category: 'computacion', 
			name: "Producto 10", 
			priceUSD: 75.00, 
			description: "Resistentes al sudor y ajuste seguro.", 
			images: [
				           "https://placehold.co/800x800/ffc814/white?text=Imagen+1",
			] }
        ];

        const categories = [
            { id: 'all', 
			name: 'Todos', 
			img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100' },
			
            { id: 'relojes', 
			name: 'Relojes', 
			img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' },
			
            { id: 'audio', 
			name: 'Audio', 
			img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
			
            { id: 'camaras', 
			name: 'Camaras', 
			img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100' },
			
            { id: 'computacion', 
			name: 'Computacion', 
			img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100' }
        ];

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let currentCurrency = localStorage.getItem('currency') || 'USD';
        let currentCategory = 'all', exchangeRate = 1, itemsToShow = 8, searchQuery = '';

// --- LÓGICA DE MONEDA ACTUALIZADA ---
async function changeCurrency(newCurrency) {
    currentCurrency = newCurrency;
    localStorage.setItem('currency', newCurrency);

    if (newCurrency !== 'USD') {
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await res.json();
            
            if (data && data.rates && data.rates[newCurrency]) {
                exchangeRate = data.rates[newCurrency];
                console.log(`Tasa de ${newCurrency} actualizada vía API`);
            } else {
                throw new Error("Dato no encontrado en API");
            }

        } catch (e) { 
            // SI FALLA LA API: Usamos el valor manual que definiste arriba
            console.warn("Falla en API, usando tasa de respaldo manual.");
            exchangeRate = manualExchangeRates[newCurrency] || 1; 
        }
    } else { 
        exchangeRate = 1; 
    }
    
    renderApp();
}
        function formatPrice(priceUSD) {
            const converted = priceUSD * exchangeRate;
            const locales = { 'USD': 'en-US', 'EUR': 'de-DE', 'VES': 'es-VE', 'PEN': 'es-PE' };
            return new Intl.NumberFormat(locales[currentCurrency] || 'es-ES', { style: 'currency', currency: currentCurrency }).format(converted);
        }

        function renderApp() { renderCategories(); renderProducts(); updateCartUI(); }

        function renderCategories() {
            const container = document.getElementById('categories-container');
            container.innerHTML = categories.map(cat => `
                <div class="category-card ${currentCategory === cat.id ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
                    <div class="category-img-wrapper"><img src="${cat.img}"></div>
                    <span class="category-name">${cat.name}</span>
                </div>
            `).join('');
        }

        function renderProducts() {
            const container = document.getElementById('product-container');
            const filtered = allProducts.filter(p => 
                (currentCategory === 'all' || p.category === currentCategory) && 
                p.name.toLowerCase().includes(searchQuery)
            );
            const paginated = filtered.slice(0, itemsToShow);
            
            container.innerHTML = paginated.map(p => `
                <article class="product-card" onclick="verDetalle(event, ${p.id})">
                    <img src="${p.images[0]}" class="product-img">
                    <h4 style="margin:10px 0 0 0">${p.name}</h4>
                    <p style="font-size:0.85rem; color:#666; margin-bottom:0;">${p.description}</p>
                    <span class="price">${formatPrice(p.priceUSD)}</span>
                    <button class="btn-add" onclick="addToCart(event, ${p.id})">Añadir al carrito</button>
                </article>
            `).join('');

            document.getElementById('btn-load-more').style.display = (filtered.length > itemsToShow) ? 'inline-block' : 'none';
        }

        // --- FUNCIONES DE ACCIÓN ---

        function verDetalle(event, id) {
            // Evitamos que se dispare si el usuario hace clic en el botón de añadir
            if (!event.target.classList.contains('btn-add')) {
                window.location.href = `detalle.html?id=${id}`;
            }
        }

        function addToCart(event, id) {
            event.stopPropagation(); // ¡Vital! Detiene el evento para que no se abra la página de detalles
            const p = allProducts.find(prod => prod.id === id);
            const inCart = cart.find(item => item.id === id);
            if (inCart) inCart.quantity++; else cart.push({...p, quantity: 1});
            updateCartUI();
            if(!document.getElementById('side-cart').classList.contains('active')) toggleCart();
        }

        // --- RESTO DE FUNCIONES (Paginación, Carrito, etc.) ---
        function filterByCategory(id) { currentCategory = id; itemsToShow = 8; renderApp(); }
        function handleSearch() { searchQuery = document.getElementById('search-input').value.toLowerCase(); itemsToShow = 8; renderProducts(); }
        function loadMore() { itemsToShow += 4; renderProducts(); }

        function updateCartUI() {
            const list = document.getElementById('cart-list');
            list.innerHTML = cart.length === 0 ? '<p style="text-align:center; margin-top:50px; color:#999;">Vacío</p>' : 
                cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.images[0]}">
                        <div style="flex-grow:1">
                            <div style="font-weight:bold; font-size:0.9rem;">${item.name}</div>
                            <div class="qty-controls">
                                <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <div style="text-align:right">
                            <div style="font-weight:bold;">${formatPrice(item.priceUSD * item.quantity)}</div>
                            <button class="btn-remove" onclick="removeFromCart(${item.id})">🗑️</button>
                        </div>
                    </div>
                `).join('');

            const total = cart.reduce((acc, i) => acc + (i.priceUSD * i.quantity), 0);
            document.getElementById('total-price').innerText = formatPrice(total);
            document.getElementById('cart-count').innerText = cart.reduce((acc, i) => acc + i.quantity, 0);
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function changeQty(id, delta) {
            const item = cart.find(i => i.id === id);
            if (item) { item.quantity += delta; if (item.quantity <= 0) removeFromCart(id); else updateCartUI(); }
        }

        function removeFromCart(id) { cart = cart.filter(i => i.id !== id); updateCartUI(); }
        function toggleCart() { document.getElementById('side-cart').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }

        window.onload = () => {
            document.getElementById('currency-select').value = currentCurrency;
            changeCurrency(currentCurrency);
        };
