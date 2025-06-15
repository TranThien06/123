function showPage(page) {
    document.getElementById('home-page').style.display = 'none'; 
    document.getElementById('category-page').style.display = 'none';
    document.getElementById('vocabulary-page').style.display = 'none';
    document.getElementById('flashcards-page').style.display = 'none';
    document.getElementById('quiz-page').style.display = 'none';

    document.querySelector(".btn-login").style.display = 'none';
    document.querySelector(".btn-register").style.display = 'none';
    document.querySelector(".btn-logout").style.display = 'inline-block';

    if (page === 'category') { // hiển thị trang danh mục
        document.getElementById('category-page').style.display = 'block'; 
        renderCategories();
    } else if (page === 'vocabulary') {
        document.getElementById('vocabulary-page').style.display = 'block';
        renderVocabularies();
    } else if (page === 'dashboard') {
        document.getElementById('home-page').style.display = 'block';
    } else if (page === 'flashcards') {                                
        document.getElementById('flashcards-page').style.display = 'block';
        loadFlashcards();
    } else if (page === 'quiz') {
        document.getElementById('quiz-page').style.display = 'block';
        startQuiz();
    } else {
        Swal.fire({
            title: 'Chưa triển khai',
            text: `Tính năng ${page} chưa được triển khai.`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
        document.getElementById('home-page').style.display = 'block';
    }
}

function showForm(type) { 
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const homePage = document.getElementById("home-page");
    const categoryPage = document.getElementById("category-page");
    const vocabularyPage = document.getElementById("vocabulary-page");
    const flashcardsPage = document.getElementById("flashcards-page");
    const quizPage = document.getElementById("quiz-page");

    if (loginForm) loginForm.style.display = type === 'login' ? 'block' : 'none';
    if (registerForm) registerForm.style.display = type === 'register' ? 'block' : 'none';
    if (homePage) homePage.style.display = type === 'home' ? 'block' : 'none';
    if (categoryPage) categoryPage.style.display = type === 'category' ? 'block' : 'none';
    if (vocabularyPage) vocabularyPage.style.display = type === 'vocabulary' ? 'block' : 'none';
    if (flashcardsPage) flashcardsPage.style.display = type === 'flashcards' ? 'block' : 'none';
    if (quizPage) quizPage.style.display = type === 'quiz' ? 'block' : 'none';

    document.querySelector(".btn-login").style.display = type === 'login' || type === 'register' ? 'inline-block' : 'none';
    document.querySelector(".btn-register").style.display = type === 'login' || type === 'register' ? 'inline-block' : 'none';
    document.querySelector(".btn-logout").style.display = type === 'home' || type === 'category' || type === 'vocabulary' || type === 'flashcards' || type === 'quiz' ? 'inline-block' : 'none'; // hiển thị nút đăng xuất
}

window.onload = function () {
    const loggedInUser = localStorage.getItem("loggedInUser"); 
    const currentPath = window.location.pathname;
    if (loggedInUser) { // kiểm tra xem người dùng đã đăng nhập hay chưa
        if (currentPath.includes('index.html') || currentPath.includes('register.html')) {
            window.location.href = 'home.html';
        } else if (currentPath.includes('home.html')) {
            showPage('dashboard');
        }
    } else {
        if (currentPath.includes('home.html')) {
            window.location.href = 'index.html';
        } else if (currentPath.includes('register.html')) {
            showForm('register');
        } else {
            showForm('login');
        }
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        });
    });
};

function validateRegisterForm() { // xử lí kiểm tra và đăng ký tài khoản 
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');

    let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!firstName) {
        document.getElementById("errorFirstName").textContent = "Tên không được để trống";
        isValid = false;
    }

    if (!lastName) {
        document.getElementById("errorLastName").textContent = "Họ không được để trống";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("errorEmail").textContent = "Định dạng email không hợp lệ";
        isValid = false;
    } else {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some(user => user.email === email)) {
            document.getElementById("errorEmail").textContent = "Email đã tồn tại";
            isValid = false;
        }
    }

    if (!passwordRegex.test(password)) {
        document.getElementById("errorPassword").textContent =
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số";
        isValid = false;
    }

    if (confirmPassword !== password) {
        document.getElementById("errorConfirmPassword").textContent = "Mật khẩu không khớp";
        isValid = false;
    }

    if (!isValid) return false;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
        title: 'Thành công!',
        text: 'Đăng ký thành công! Chuyển hướng đến đăng nhập...',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
            document.querySelector("#register-form form").reset();
            window.location.href = 'index.html';
        }
    });

    return false;
}

function validateLoginForm() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    document.getElementById("errorLoginEmail").textContent = '';
    document.getElementById("errorLoginPassword").textContent = '';

    let isValid = true;

    if (!email) {
        document.getElementById("errorLoginEmail").textContent = "Email không được để trống";
        isValid = false;
    }

    if (!password) {
        document.getElementById("errorLoginPassword").textContent = "Mật khẩu không được để trống";
        isValid = false;
    }

    if (isValid) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email);

        if (!user) {
            document.getElementById("errorLoginEmail").textContent = "Email không tồn tại";
            isValid = false;
        } else if (user.password !== password) {
            document.getElementById("errorLoginPassword").textContent = "Mật khẩu không đúng";
            isValid = false;
        }
    }

    if (!isValid) return false;

    localStorage.setItem("loggedInUser", email);
    Swal.fire({
        title: 'Thành công!',
        text: 'Đăng nhập thành công!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        window.location.href = 'home.html';
    });

    return false;
}

function logout() {
    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn đăng xuất?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("loggedInUser");
            window.location.href = 'index.html';
            Swal.fire({
                title: 'Thành công!',
                text: 'Bạn đã đăng xuất thành công.',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}
