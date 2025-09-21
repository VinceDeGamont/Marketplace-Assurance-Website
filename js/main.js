document.addEventListener('DOMContentLoaded', () => {

    // helper function untuk format angka ke Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    // helper function untuk hitung umur dari tanggal lahir
    const hitungUmur = (tglLahir) => {
        const today = new Date();
        const birthDate = new Date(tglLahir);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };


    // logic untuk page asuransi mobil
    const formAsuransiMobil = document.getElementById('formAsuransiMobil');
    if (formAsuransiMobil) {
        formAsuransiMobil.addEventListener('submit', (e) => {
            e.preventDefault();

            const hargaMobil = parseFloat(document.getElementById('hargaMobil').value);
            const tahunMobil = parseInt(document.getElementById('tahunMobil').value);
            
            // pastikan harga dan tahun diisi
            if (isNaN(hargaMobil) || isNaN(tahunMobil)) {
                alert('Harga mobil dan tahun pembuatan harus diisi dengan angka.');
                return;
            }

            const tahunSekarang = new Date().getFullYear();
            const umurMobil = tahunSekarang - tahunMobil;
            
            let premi = 0;
            const x = hargaMobil;

            if (umurMobil >= 0 && umurMobil <= 3) {
                premi = 0.025 * x;
            } else if (umurMobil > 3 && umurMobil <= 5) {
                premi = (x < 200000000) ? (0.04 * x) : (0.03 * x);
            } else if (umurMobil > 5) {
                premi = 0.05 * x;
            }

            document.getElementById('hargaPremiMobil').textContent = formatRupiah(premi);
            document.getElementById('hasilPremi').style.display = 'block';

            // simpan data untuk dipakai ke checkout
            const checkoutData = {
                productName: 'Asuransi Mobil Premium',
                price: premi,
                type: 'Mobil',
                period: 'tahun'
            };
            localStorage.setItem('checkoutItem', JSON.stringify(checkoutData));
        });
    }


    // logic untuk page asuransi kesehatan
    const formAsuransiKesehatan = document.getElementById('formAsuransiKesehatan');
    if (formAsuransiKesehatan) {
        formAsuransiKesehatan.addEventListener('submit', (e) => {
            e.preventDefault();

            const tglLahir = document.getElementById('tglLahir').value;
            if (!tglLahir) {
                alert('Tanggal lahir harus diisi.');
                return;
            }

            const k1 = parseInt(document.getElementById('merokok').value);
            const k2 = parseInt(document.getElementById('hipertensi').value);
            const k3 = parseInt(document.getElementById('diabetes').value);
            const P = 2000000;
            
            const umur = hitungUmur(tglLahir);
            
            let m = 0;

            if (umur <= 20) {
                m = 0.1;
            } else if (umur > 20 && umur <= 35) {
                m = 0.2;
            } else if (umur > 35 && umur <= 50) {
                m = 0.25;
            } else if (umur > 50) {
                m = 0.4;
            }
            
            // rumus perhitungan premi sesuai ketentuan
            const hargaPremi = P + (m * P) + (k1 * 0.5 * P) + (k2 * 0.4 * P) + (k3 * 0.5 * P);

            document.getElementById('hargaPremiKesehatan').textContent = formatRupiah(hargaPremi);
            document.getElementById('hasilPremi').style.display = 'block';
            
            // simpan lagi datanya untuk checkout
            const checkoutData = {
                productName: 'Asuransi Kesehatan Keluarga',
                price: hargaPremi,
                type: 'Kesehatan',
                period: 'tahun'
            };
            localStorage.setItem('checkoutItem', JSON.stringify(checkoutData));
        });
    }


    // logic untuk page asuransi jiwa
    const formAsuransiJiwa = document.getElementById('formAsuransiJiwa');
    if (formAsuransiJiwa) {
        formAsuransiJiwa.addEventListener('submit', (e) => {
            e.preventDefault();

            const tglLahir = document.getElementById('tglLahirJiwa').value;
            if (!tglLahir) {
                alert('Tanggal lahir harus diisi.');
                return;
            }

            const pertanggungan = parseFloat(document.getElementById('pertanggungan').value);

            const umur = hitungUmur(tglLahir);
            
            let m = 0;
            if (umur <= 30) {
                m = 0.002;
            }
            else if (umur > 30 && umur <= 50) {
                m = 0.004;
            }
            else if (umur > 50) {
                m = 0.01;
            }

            const hargaPremi = m * pertanggungan;

            document.getElementById('hargaPremiJiwa').textContent = formatRupiah(hargaPremi);
            document.getElementById('hasilPremi').style.display = 'block';

            const checkoutData = {
                productName: 'Asuransi Jiwa Sejahtera',
                price: hargaPremi,
                type: 'Jiwa',
                period: 'bulan'
            };
            localStorage.setItem('checkoutItem', JSON.stringify(checkoutData));
        });
    }


    //logic untuk checkout page
    const tombolBayar = document.getElementById('tombol-bayar');
    if (tombolBayar) {
        // ambil data dari localStorage dan tampilkan di halaman
        const itemToCheckout = JSON.parse(localStorage.getItem('checkoutItem'));
        
        if (itemToCheckout) {
            document.getElementById('product-name').textContent = itemToCheckout.productName;
            const hargaText = `${formatRupiah(itemToCheckout.price)} / ${itemToCheckout.period}`;
            document.getElementById('total-harga').textContent = hargaText;
        } else {
            
            document.querySelector('.checkout-container').innerHTML = '<h1>Tidak ada item untuk di-checkout.</h1><p>Silakan pilih produk terlebih dahulu.</p>';
        }

        // event listener untuk tombol bayar
        tombolBayar.addEventListener('click', () => {
            if (itemToCheckout) {
                // ambil histori yang sudah ada, atau buat array baru jika belum ada
                let history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

                // ambil metode pembayaran yang dipilih user
                const paymentMethodInput = document.querySelector('input[name="payment"]:checked');
                const paymentMethod = paymentMethodInput ? paymentMethodInput.nextElementSibling.textContent : 'Tidak Diketahui';

                // tambah item baru ke histori
                const historyItem = {
                    ...itemToCheckout,
                    purchaseDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                    status: 'Lunas',
                    paymentMethod: paymentMethod
                };
                history.unshift(historyItem); // agar data terbaru di atas

                // simpan kembali ke localStorage
                localStorage.setItem('purchaseHistory', JSON.stringify(history));

                // hapus item dari checkout agar tidak diproses lagi jika sudah selesai
                localStorage.removeItem('checkoutItem');

                // tampilkan notifikasi dan arahkan ke histori page
                alert('Pembayaran berhasil!');
                window.location.href = 'histori.html';
            } else {
                alert('Tidak ada item untuk dibayar.');
            }
        });
    }


    // logic untuk histori page
    const historyBody = document.getElementById('history-body');
    if (historyBody) {
        const history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

        if (history.length > 0) {
            // kosongkan dulu isi tabel
            historyBody.innerHTML = '';

            // loop data histori dan buat baris tabel untuk masing-masing value
            history.forEach(item => {
                const row = document.createElement('tr');
                
                const statusClass = item.status === 'Lunas' ? 'lunas' : 'belum-lunas';
                
                row.innerHTML = `
                    <td>${item.productName}</td>
                    <td>${item.type}</td>
                    <td>${item.purchaseDate}</td>
                    <td>${formatRupiah(item.price)} / ${item.period}</td>
                    <td>${item.paymentMethod || 'N/A'}</td>
                    <td><span class="status ${statusClass}">${item.status}</span></td>
                `;

                historyBody.appendChild(row);
            });
        } else {
            // kalau histori kosong
            historyBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada riwayat pembelian.</td></tr>';
        }
    }

    // munculkan preview dari file yg di upload pada page formulir pembelian
    const customFileInputs = document.querySelectorAll('.custom-file-input'); 
    customFileInputs.forEach(input => {
        input.addEventListener('change', function() {
            // ambil elemen span untuk nama file yang sesuai
            const fileNameSpan = this.parentElement.querySelector('.file-name');
            
            if (this.files.length > 0) {
                // kalau ada file yang dipilih, tampilkan namanya
                fileNameSpan.textContent = this.files[0].name;
            } else {
                // kalau ga ada file (misal, user menekan cancel), kosongkan teks
                fileNameSpan.textContent = '';
            }
        });
    });

});