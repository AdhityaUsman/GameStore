// Data Simulasi Produk Akun/Item Game
const products = [
    { id: 1, category: 'mlbb', title: 'Akun MLBB Mythic Immortal (Skin Epic Banyak)', price: 'Rp 750.000', desc: 'Full badge, Emblem max, All unbind aman.' },
    { id: 2, category: 'valorant', title: 'Akun Valorant Bundle Kuronami + Reaver', price: 'Rp 1.200.000', desc: 'Rank Ascendant, Region SEA, Data lengkap.' },
    { id: 3, category: 'genshin', title: 'Akun Genshin Impact AR 58 (Nahida + Furina C2)', price: 'Rp 950.000', desc: 'Primogem aman, eksplorasi 100%.' }
];

// Data Testimoni Pelanggan
const testimonials = [
    { name: 'Rizky Pratama', comment: 'Mantap banget! Transaksi cepat pakai Rekber, akun langsung dikasih tanpa kendala.', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Dewi Lestari', comment: 'Respon admin cepat via WhatsApp, terpercaya dan ramah.', rating: '⭐⭐⭐⭐⭐' }
];

// Fungsi Render Katalog Produk
function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <div class="price">${p.price}</div>
            <a href="https://wa.me/628123456789?text=Halo%20Admin,%20saya%20tertarik%20dengan%20${encodeURIComponent(p.title)}" class="btn-buy" target="_blank">Beli via WhatsApp (Rekber)</a>
        `;
        grid.appendChild(card);
    });
}

// Fungsi Render Testimoni
function renderTestimonials() {
    const grid = document.getElementById('testimonial-grid');
    grid.innerHTML = '';
    
    testimonials.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <h4>${t.name}</h4>
            <p>${t.rating}</p>
            <p style="margin-top: 0.5rem; opacity: 0.9;">"${t.comment}"</p>
        `;
        grid.appendChild(card);
    });
}

// Event Listener untuk Tombol Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts(e.target.getAttribute('data-filter'));
    });
});

// Fitur Ganti Tema (Theme Switcher)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        themeToggle.textContent = '🌙 Tema';
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Tema';
    }
});

// Inisialisasi Tampilan Awal
renderProducts();
renderTestimonials();