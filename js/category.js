    let categories = [];
    let currentPage = 1;
    const itemsPerPage = 5;
    

    function renderCategories() { // Lọc và phân trang danh sách danh mục
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
                <td>${cat.id}</td>

                <td>
                    <button class="action-btn edit-btn" onclick="openEditCategoryPopup(${start + index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="openDeleteCategoryPopup(${start + index})">Delete</button>
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
    }

    function closeCategoryPopup() {
        document.getElementById('categoryPopup').style.display = 'none';
    }

function saveCategory() {
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;

    if (name && description) {
        if (window.currentEditIndex !== undefined) {
            
            categories[window.currentEditIndex] = { name, description };
            window.currentEditIndex = undefined;
        } else {
     
            categories.push({ name, description });
        }

       
        localStorage.setItem('categories', JSON.stringify(categories));

        closeCategoryPopup();
        renderCategories();
    }
}



    function openEditCategoryPopup(index) {
        document.getElementById('categoryPopupTitle').textContent = 'Chỉnh Sửa Danh Mục';
        document.getElementById('categoryName').value = categories[index].name;
        document.getElementById('categoryDescription').value = categories[index].description;
        document.getElementById('categoryPopup').style.display = 'flex';

        window.currentEditIndex = index;
    }+

    function openDeleteCategoryPopup(index) {
        document.getElementById('categoryDeletePopup').style.display = 'flex';
        window.currentDeleteIndex = index;
    }

    function closeCategoryDeletePopup() {
        document.getElementById('categoryDeletePopup').style.display = 'none';
    }

function confirmCategoryDelete() {
    categories.splice(window.currentDeleteIndex, 1);
    localStorage.setItem('categories', JSON.stringify(categories)); 
    closeCategoryDeletePopup();
    renderCategories();
    saveCategoriesToLocalStorage();

}


function loadCategoriesFromLocalStorage() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    }
}
function saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
    saveCategoriesToLocalStorage();
}





    loadCategoriesFromLocalStorage(); 
    renderCategories();  
         
