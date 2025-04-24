
window.onload = function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        showForm('home');
    } else {
        showForm('login');
    }
};

function validateRegisterForm() {
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
        document.getElementById("errorFirstName").textContent = "Không được để trống First Name";
        isValid = false;
    }

    if (!lastName) {
        document.getElementById("errorLastName").textContent = "Không được để trống Last Name";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("errorEmail").textContent = "Email không đúng định dạng";
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
            "Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số";
        isValid = false;
    }

    if (confirmPassword !== password) {
        document.getElementById("errorConfirmPassword").textContent = "Xác nhận mật khẩu không khớp";
        isValid = false;
    }

    if (!isValid) return false;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
        title: 'Thành công!',
        text: 'Đăng ký thành công! Bạn có muốn chuyển sang trang đăng nhập?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        document.querySelector("#register-form form").reset();
        if (result.isConfirmed) {
            showForm('login');
        }
    });

    return false;
}

function showForm(type) {
    document.getElementById("login-form").style.display = type === 'login' ? 'block' : 'none';
    document.getElementById("register-form").style.display = type === 'register' ? 'block' : 'none';
    document.getElementById("home-page").style.display = type === 'home' ? 'block' : 'none';
    document.querySelector(".btn-login").style.display = type === 'login' || type === 'register' ? 'inline-block' : 'none';
    document.querySelector(".btn-register").style.display = type === 'login' || type === 'register' ? 'inline-block' : 'none';
    document.querySelector(".btn-logout").style.display = type === 'home' ? 'inline-block' : 'none';
}

function validateLoginForm() {
    const emailInput = document.querySelector("#login-form input[type='email']").value.trim();
    const passwordInput = document.querySelector("#login-form input[type='password']").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.email === emailInput && user.password === passwordInput);

    if (!user) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return false;
    }


    localStorage.setItem("loggedInUser", emailInput);

    Swal.fire({
        title: 'Thành công!',
        text: 'Đăng nhập thành công!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("register-form").style.display = "none";
        document.getElementById("home-page").style.display = "block";

        document.querySelector(".btn-login").style.display = "none";
        document.querySelector(".btn-register").style.display = "none";
        document.querySelector(".btn-logout").style.display = "inline-block";
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
            document.getElementById("home-page").style.display = "none";
            document.getElementById("login-form").style.display = "block";
            document.getElementById("register-form").style.display = "none";
            document.querySelector(".btn-login").style.display = "inline-block";
            document.querySelector(".btn-register").style.display = "inline-block";
            document.querySelector(".btn-logout").style.display = "none";

            Swal.fire({ // thư viện SweetAlert2
                title: 'Thành công!',
                text: 'Bạn đã đăng xuất thành công.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
}