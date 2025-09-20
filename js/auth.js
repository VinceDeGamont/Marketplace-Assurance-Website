document.addEventListener('DOMContentLoaded', () => {
    
    const navLinks = document.getElementById('main-nav-links');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (loggedInUser && navLinks) {
        // jika ada user yang loign, ubah nav button
        navLinks.innerHTML = `
            <li><a href="history.html">Hi, ${loggedInUser.fullName.split(' ')[0]}</a></li>
            <li><a href="#" id="logoutButton" class="btn-primary">Logout</a></li>
        `;

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Hapus data pengguna dari sessionStorage
                sessionStorage.removeItem('loggedInUser');
                
                // Beri notifikasi dan arahkan ke halaman utama
                alert('Anda telah berhasil logout.');
                window.location.href = 'index.html';
            });
        }
    }

    // logic untuk sign up
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // VALIDASSIIIIII
            if (!fullName || !phone || !email || !password || !confirmPassword) {
                showError('Semua field harus diisi.'); return;
            }
            if (!validateEmail(email)) {
                showError('Format email tidak valid.'); return;
            }
            if (password.length < 8) {
                showError('Kata sandi minimal 8 karakter.'); return;
            }
            if (password !== confirmPassword) {
                showError('Kata sandi dan konfirmasi tidak sesuai.'); return;
            }
            if (fullName.length < 3 || fullName.length > 32 || /\d/.test(fullName)) {
                showError('Nama lengkap minimal 3 & maksimal 32 karakter, tidak boleh mengandung angka.'); return;
            }
            if (!/^(08)\d{8,14}$/.test(phone)) {
                showError('Format nomor handphone salah (contoh: 081234567890).'); return;
            }
            
            // simpan data ke localstorage

            // 1. Ambil data pengguna yang sudah ada, atau buat array kosong jika belum ada
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // 2. Cek apakah email sudah terdaftar
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                showError('Email ini sudah terdaftar. Silakan gunakan email lain.');
                return;
            }

            // 3. Tambahkan pengguna baru ke array
            const newUser = { fullName, phone, email, password };
            users.push(newUser);

            // 4. Simpan kembali array pengguna ke localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // 5. Tampilkan notifikasi berhasil dan arahkan ke halaman login
            alert('Sign up berhasil! Anda akan diarahkan ke halaman login.');
            window.location.href = 'login.html';
        });
    }

    // logic untuk login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showError('Email dan kata sandi harus diisi.'); return;
            }
            if (!validateEmail(email)) {
                showError('Format email tidak valid.'); return;
            }

            // intagrate data dengan localStorage
            // collect data semua pengguna dari localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // cari user berdasarkan emailnya
            const user = users.find(user => user.email === email);

            // verif usrname & password
            if (user && user.password === password) {
                alert('Login berhasil!');
                
                // untuk simpan status login
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));

                window.location.href = 'index.html';
            } else {
                // Jika pengguna tidak ditemukan ATAU kata sandi salah
                showError('Email atau kata sandi salah. Login tidak berhasil.');
            }
        });
    }

    // helper function
    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});