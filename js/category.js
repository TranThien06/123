let categories = [];
let currentPage = 1;
const itemsPerPage = 5;

function renderCategories() {
    const searchTerm = document.getElementById('searchCategory').value.toLowerCase();
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.description.toLowerCase().includes(searchTerm)
    );
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedCategories = filteredCategories.slice(start, end);

    const tableBody = document.getElementById('categoryTableBody');
    tableBody.innerHTML = '';
    paginatedCategories.forEach((cat, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cat.name}</td>
            <td>${cat.description}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditCategoryPopup(${cat.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="openDeleteCategoryPopup(${cat.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('categoryPagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.onclick = () => {
            currentPage = i;
            renderCategories();
        };
        pagination.appendChild(button);
    }
}

function openAddCategoryPopup() {
    document.getElementById('categoryPopupTitle').textContent = 'Thêm Danh Mục';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryPopup').style.display = 'flex';
    window.currentEditId = null; 
}

function closeCategoryPopup() {
    document.getElementById('categoryPopup').style.display = 'none';
}

function saveCategory() {
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;

    if (name && description) {
        if (window.currentEditId !== null) {
          
            const index = categories.findIndex(cat => cat.id === window.currentEditId);
            if (index !== -1) {
                categories[index] = { id: window.currentEditId, name, description };
            }
        } else {
          
            const id = categories.length > 0 ? Math.max(...categories.map(cat => cat.id)) + 1 : 1;
            categories.push({ id, name, description });
        }

        saveCategoriesToLocalStorage();
        closeCategoryPopup();
        renderCategories();
    }
}

function openEditCategoryPopup(id) {
    const category = categories.find(cat => cat.id === id);
    if (category) {
        document.getElementById('categoryPopupTitle').textContent = 'Chỉnh Sửa Danh Mục';
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description;
        document.getElementById('categoryPopup').style.display = 'flex';
        window.currentEditId = id;
    }
}

function openDeleteCategoryPopup(id) {
    document.getElementById('categoryDeletePopup').style.display = 'flex';
    window.currentDeleteId = id; 
}

function closeCategoryDeletePopup() {
    document.getElementById('categoryDeletePopup').style.display = 'none';
}

function confirmCategoryDelete() {
    const index = categories.findIndex(cat => cat.id === window.currentDeleteId);
    if (index !== -1) {
        categories.splice(index, 1);
        saveCategoriesToLocalStorage();
        closeCategoryDeletePopup();
        renderCategories();

        Swal.fire({
            title: 'Đã xóa!',
            text: 'Danh mục đã được xóa thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

function loadCategoriesFromLocalStorage() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    }
}

function saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

loadCategoriesFromLocalStorage();
renderCategories();