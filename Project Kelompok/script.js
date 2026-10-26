
 // Inisialisasi Data Awal di localStorage jika belum ada
if (!localStorage.getItem('products')) {
    const defaultProducts = [
        {
            id: 1,
            category: 'mlbb',
            title: 'Akun MLBB Mythic Immortal (Skin Epic Banyak)',
            price: 'Rp 750.000',
            desc: 'Full badge, Emblem max, All unbind aman.',
            status: 'available'
        },
        {
            id: 2,
            category: 'valorant',
            title: 'Akun Valorant Bundle Kuronami + Reaver',
            price: 'Rp 1.200.000',
            desc: 'Rank Ascendant, Region SEA, Data lengkap.',
            status: 'available'
        },
        {
            id: 3,
            category: 'genshin',
            title: 'Akun Genshin Impact AR 58 (Nahida + Furina C2)',
            price: 'Rp 950.000',
            desc: 'Primogem aman, eksplorasi 100%.',
            status: 'sold'
        }
    ];

    localStorage.setItem('products', JSON.stringify(defaultProducts));
}

if (!localStorage.getItem('testimonials')) {
    const defaultTestimonials = [
        {
            name: 'Rizky Pratama',
            comment: 'Mantap banget! Transaksi cepat pakai Rekber, akun langsung dikasih tanpa kendala.',
            rating: '⭐⭐⭐⭐⭐'
        },
        {
            name: 'Dewi Lestari',
            comment: 'Respon admin cepat via WhatsApp, terpercaya dan ramah.',
            rating: '⭐⭐⭐⭐⭐'
        }
    ];

    localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
}

if (!localStorage.getItem('users')) {
    const defaultUsers = [
        {
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        }
    ];

    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// 1. Logika Tab Auth (index.html)
window.switchTab = function(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (!loginForm || !registerForm) return;

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');

        if (tabLogin) tabLogin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');

        if (tabRegister) tabRegister.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
    }
};

// 2. Logika Proses Login (index.html)
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(
            u => u.username === user && u.password === pass
        );

        if (foundUser) {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));

            if (foundUser.role === 'admin') {
                alert('Login Admin Berhasil!');
                window.location.href = 'admin.html';
            } else {
                alert('Login Berhasil! Selamat datang, ' + foundUser.username);
                window.location.href = 'user.html';
            }
        } else {
            alert('Username atau Password salah!');
        }
    });
}

// 3. Logika Registrasi (index.html)
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const user = document.getElementById('reg-user').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.username === user)) {
            alert('Username sudah terdaftar! Gunakan username lain.');
            return;
        }

        users.push({
            username: user,
            password: pass,
            role: 'customer'
        });

        localStorage.setItem('users', JSON.stringify(users));

        alert('Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.');

        registerForm.reset();
        window.switchTab('login');
    });
}

// 4. Logika Halaman User (user.html)
const productGrid = document.getElementById('product-grid');

if (productGrid) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'customer') {
        alert('Anda harus login terlebih dahulu sebagai user!');
        window.location.href = 'index.html';
    } else {
        const greetingEl = document.getElementById('user-greeting');

        if (greetingEl) {
            greetingEl.textContent = `Halo, ${currentUser.username}`;
        }
    }

    function renderPublicProducts(filter = 'all') {
        const products = JSON.parse(localStorage.getItem('products')) || [];

        productGrid.innerHTML = '';

        const filtered = filter === 'all'
            ? products
            : products.filter(p => p.category === filter);

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const isAvailable = p.status === 'available';

            const statusBadge = isAvailable
                ? `<span class="status-badge status-available">🟢 Masih Tersedia</span>`
                : `<span class="status-badge status-sold">🔴 Sudah Terjual</span>`;

            const buyButton = isAvailable
                ? `<a href="https://wa.me/628123456789?text=Halo%20Admin,%20saya%20tertarik%20dengan%20${encodeURIComponent(p.title)}" class="btn-buy" target="_blank" rel="noopener noreferrer">Beli via WhatsApp (Rekber)</a>`
                : `<a href="#" class="btn-buy disabled">Stok Habis / Terjual</a>`;

            card.innerHTML = `
                <div>
                    ${statusBadge}
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <div class="price">${p.price}</div>
                </div>
                ${buyButton}
            `;

            productGrid.appendChild(card);
        });
    }

    renderPublicProducts();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });

            e.currentTarget.classList.add('active');

            renderPublicProducts(
                e.currentTarget.getAttribute('data-filter')
            );
        });
    });

    // Testimonial
    const testimonialGrid = document.getElementById('testimonial-grid');

    function renderTestimonials() {
        const testimonials =
            JSON.parse(localStorage.getItem('testimonials')) || [];

        if (!testimonialGrid) return;

        testimonialGrid.innerHTML = '';

        testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';

            card.innerHTML = `
                <h4>${t.name}</h4>
                <p>${t.rating}</p>
                <p style="margin-top: 0.5rem; opacity: 0.9;">
                    "${t.comment}"
                </p>
            `;

            testimonialGrid.appendChild(card);
        });
    }

    renderTestimonials();

    const testimonialForm = document.getElementById('testimonial-form');

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reviewer-name').value;
            const rating = document.getElementById('reviewer-rating').value;
            const comment = document.getElementById('reviewer-comment').value;

            const testimonials =
                JSON.parse(localStorage.getItem('testimonials')) || [];

            testimonials.unshift({
                name,
                rating,
                comment
            });

            localStorage.setItem(
                'testimonials',
                JSON.stringify(testimonials)
            );

            renderTestimonials();
            testimonialForm.reset();

            alert('Terima kasih! Ulasan dan rating Anda berhasil ditambahkan.');
        });
    }
}


 // 5. Logika Halaman Admin (admin.html)

const adminProductGrid = document.getElementById('admin-product-grid');

if (adminProductGrid) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'admin') {
        alert('Akses ditolak! Silakan login sebagai admin.');
        window.location.href = 'index.html';
    } else {
        const modal = document.getElementById('product-modal');
        const openAddModal = document.getElementById('open-add-modal');
        const closeModal = document.getElementById('close-modal');
        const productForm = document.getElementById('product-form');
        const modalTitle = document.getElementById('modal-title');

        // Menampilkan produk
        function renderAdminProducts() {
            const products =
                JSON.parse(localStorage.getItem('products')) || [];

            adminProductGrid.innerHTML = '';

            if (products.length === 0) {
                adminProductGrid.innerHTML =
                    '<p>Belum ada produk. Silakan tambah katalog baru.</p>';
                return;
            }

            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';

                const statusBadge = p.status === 'available'
                    ? '<span class="status-badge status-available">🟢 Masih Tersedia</span>'
                    : '<span class="status-badge status-sold">🔴 Sudah Terjual</span>';

                card.innerHTML = `
                    <div>
                        ${statusBadge}
                        <h3></h3>
                        <p></p>
                        <div class="price"></div>
                    </div>

                    <div class="admin-actions-card">
                        <button class="btn-edit">Edit</button>
                        <button class="btn-delete">Hapus</button>
                    </div>
                `;

                // Masukkan teks sebagai teks biasa
                card.querySelector('h3').textContent = p.title;
                card.querySelector('p').textContent = p.desc;
                card.querySelector('.price').textContent = p.price;

                card.querySelector('.btn-edit').addEventListener('click', () => {
                    window.editProduct(p.id);
                });

                card.querySelector('.btn-delete').addEventListener('click', () => {
                    if (!confirm(`Yakin ingin menghapus produk "${p.title}"?`)) {
                        return;
                    }

                    const updatedProducts =
                        (JSON.parse(localStorage.getItem('products')) || [])
                        .filter(item => item.id !== p.id);

                    localStorage.setItem(
                        'products',
                        JSON.stringify(updatedProducts)
                    );

                    renderAdminProducts();
                    alert('Produk berhasil dihapus!');
                });

                adminProductGrid.appendChild(card);
            });
        }

        // Membuka modal tambah produk
        openAddModal.addEventListener('click', () => {
            productForm.reset();
            document.getElementById('product-id').value = '';
            modalTitle.textContent = 'Tambah Katalog Produk';
            modal.classList.remove('hidden');
        });

        // Menutup modal
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Menutup modal jika klik area luar
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Fungsi edit produk
        window.editProduct = function(id) {
            const products =
                JSON.parse(localStorage.getItem('products')) || [];

            const product = products.find(p => p.id === id);

            if (!product) {
                alert('Produk tidak ditemukan!');
                return;
            }

            document.getElementById('product-id').value = product.id;
            document.getElementById('prod-title').value = product.title;
            document.getElementById('prod-category').value = product.category;
            document.getElementById('prod-price').value = product.price;
            document.getElementById('prod-status').value = product.status;
            document.getElementById('prod-desc').value = product.desc;

            modalTitle.textContent = 'Edit Katalog Produk';
            modal.classList.remove('hidden');
        };

        // Menyimpan produk baru atau hasil edit
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const idValue = document.getElementById('product-id').value;
            const title = document.getElementById('prod-title').value.trim();
            const category = document.getElementById('prod-category').value;
            const price = document.getElementById('prod-price').value.trim();
            const status = document.getElementById('prod-status').value;
            const desc = document.getElementById('prod-desc').value.trim();

            if (!title || !price || !desc) {
                alert('Semua kolom harus diisi!');
                return;
            }

            let products =
                JSON.parse(localStorage.getItem('products')) || [];

            if (idValue !== '') {
                // Update produk yang sudah ada
                const index = products.findIndex(
                    p => p.id === Number(idValue)
                );

                if (index !== -1) {
                    products[index] = {
                        ...products[index],
                        title,
                        category,
                        price,
                        status,
                        desc
                    };
                }
            } else {
                // Tambah produk baru
                const newId = products.length
                    ? Math.max(...products.map(p => Number(p.id) || 0)) + 1
                    : 1;

                products.push({
                    id: newId,
                    title,
                    category,
                    price,
                    status,
                    desc
                });
            }

            localStorage.setItem('products', JSON.stringify(products));

            modal.classList.add('hidden');
            productForm.reset();
            renderAdminProducts();

            alert(idValue !== ''
                ? 'Produk berhasil diperbarui!'
                : 'Produk berhasil ditambahkan!');
        });

        // Tombol tema terang/gelap
        const themeToggle = document.getElementById('theme-toggle');

        if (themeToggle) {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme =
                    document.documentElement.getAttribute('data-theme');

                const newTheme =
                    currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute(
                    'data-theme',
                    newTheme
                );

                localStorage.setItem('theme', newTheme);
            });
        }

        // Tombol keluar
        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Yakin ingin keluar dari akun admin?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                }
            });
        }

        // Tampilkan katalog saat halaman dibuka
        renderAdminProducts();
    }
}

// LOGOUT UNTUK SEMUA HALAMAN
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        const yakin = confirm('Yakin ingin keluar dari akun?');

        if (yakin) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });
}