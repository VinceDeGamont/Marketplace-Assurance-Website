document.addEventListener('DOMContentLoaded', () => {
    // helper function
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    const setError = (inputElement, message) => {
        const inputGroup = inputElement.parentElement.parentElement;
        const errorDisplay = inputGroup.querySelector('.error-detail');
        errorDisplay.innerText = message;
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
    };
    
    const setSuccess = (inputElement) => {
        const inputGroup = inputElement.parentElement.parentElement;
        const errorDisplay = inputGroup.querySelector('.error-detail');
        errorDisplay.innerText = '';
        inputElement.classList.add('valid');
        inputElement.classList.remove('invalid');
    };
    

    const navLinks = document.getElementById('main-nav-links');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (loggedInUser && navLinks) {
        // jika ada user yang loign, ubah nav button
        navLinks.innerHTML = `
            <li class="nav-greeting">Hi, ${loggedInUser.fullName.split(' ')[0]}</li>
            <li><a href="histori.html">Histori</a></li>
            <li><a href="#" id="logoutButton" class="btn-primary">Logout</a></li>
        `;

        // aturan untuk tombol logOut
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                // hapus data user dari sessionStorage
                sessionStorage.removeItem('loggedInUser');
                
                alert('Anda telah berhasil logout.');
                window.location.href = 'index.html';
            });
        }
    } else if (navLinks) {
        // tampilan ketika user belum login
        navLinks.innerHTML = `
            <li><a href="login.html">Login</a></li>
            <li><a href="signup.html" class="btn-primary">Sign Up</a></li>
        `;
    }
    
    // aturan untuk tombol Beli Sekarang ketika melihat detail product
    const tombolBeli = document.getElementById('tombolBeli');
    if (tombolBeli) {
        tombolBeli.addEventListener('click', () => {
            const loggedInUser = sessionStorage.getItem('loggedInUser');
            
            if (loggedInUser) {
                // jika user SUDAH login, arahkan ke halaman pembelian
                const targetUrl = tombolBeli.getAttribute('data-target');
                window.location.href = targetUrl;
            } else {
                // jika user BELUM login, beri peringatan dan arahkan ke login
                alert('Anda harus login terlebih dahulu untuk melanjutkan pembelian.');
                window.location.href = '../login.html';
            }
        });
    }


    // logic untuk sign up
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const fullName = document.getElementById('fullName');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        const validateInputs = () => {
            let isValid = true;
            const fullNameValue = fullName.value.trim();
            const phoneValue = phone.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value;
            const confirmPasswordValue = confirmPassword.value;

            // validasi nama lengkap
            if (fullNameValue === '') {
                setError(fullName, 'Nama lengkap harus diisi.'); isValid = false;
            } else if (fullNameValue.length < 3 || fullNameValue.length > 32 || /\d/.test(fullNameValue)) {
                setError(fullName, 'Min 3, maks 32 karakter, tanpa angka.'); isValid = false;
            } else {
                setSuccess(fullName);
            }

            // validasi nomor handphone
            if (phoneValue === '') {
                setError(phone, 'Nomor handphone harus diisi.'); isValid = false;
            } else if (!/^(08)\d{8,14}$/.test(phoneValue)) {
                setError(phone, 'Format salah (contoh: 08123456789).'); isValid = false;
            } else {
                setSuccess(phone);
            }

            // validasi email
            if (emailValue === '') {
                setError(email, 'Email harus diisi.'); isValid = false;
            } else if (!validateEmail(emailValue)) {
                setError(email, 'Format email tidak valid.'); isValid = false;
            } else {
                setSuccess(email);
            }

            // validasi password
            if (passwordValue === '') {
                setError(password, 'Kata sandi harus diisi.'); isValid = false;
            } else if (passwordValue.length < 8) {
                setError(password, 'Kata sandi minimal 8 karakter.'); isValid = false;
            } else {
                setSuccess(password);
            }

            // validasi  comfirm password
            if (confirmPasswordValue === '') {
                setError(confirmPassword, 'Konfirmasi kata sandi harus diisi.'); isValid = false;
            } else if (passwordValue !== confirmPasswordValue) {
                setError(confirmPassword, 'Kata sandi tidak cocok.'); isValid = false;
            } else {
                setSuccess(confirmPassword);
            }
            
            return isValid;
        };

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateInputs()) {
                // Jika semua validasi lolos:
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const emailValue = email.value.trim();
                if (users.find(user => user.email === emailValue)) {
                    setError(email, 'Email ini sudah terdaftar.');
                    return;
                }
                const newUser = {
                    fullName: fullName.value.trim(),
                    phone: phone.value.trim(),
                    email: emailValue,
                    password: password.value.trim()
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Sign up berhasil! Anda akan diarahkan ke halaman login.');
                window.location.href = 'login.html';
            }
        });
        
        // Menambahkan event listener untuk validasi saat pengguna mengetik/meninggalkan input
        [fullName, phone, email, password, confirmPassword].forEach(input => {
            input.addEventListener('input', validateInputs);
        });
    }


    // logic untuk login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        const validateLoginInputs = () => {
            let isValid = true;
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();

            if (emailValue === '') {
                setError(email, 'Email harus diisi.'); isValid = false;
            } else if (!validateEmail(emailValue)) {
                setError(email, 'Format email tidak valid.'); isValid = false;
            } else {
                setSuccess(email);
            }

            if (passwordValue === '') {
                setError(password, 'Kata sandi harus diisi.'); isValid = false;
            } else {
                setSuccess(password);
            }
            return isValid;
        };
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateLoginInputs()) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email.value.trim());

                if (user && user.password === password.value.trim()) {
                    alert('Login berhasil!');
                    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                    window.location.href = 'index.html';
                } else {
                    setError(password, 'Email atau kata sandi salah.');
                }
            }
        });
        
        // apply
        [email, password].forEach(input => {
            input.addEventListener('input', validateLoginInputs);
        });
    }
});