    let vocabularies = [];
    let currentVocabPage = 1;
    const vocabItemsPerPage = 5;

    function renderVocabularies() { 
        const searchTerm = document.getElementById('searchVocabulary').value.toLowerCase();  
        const filteredVocabularies = vocabularies.filter(vocab =>
            vocab.word.toLowerCase().includes(searchTerm) ||
            vocab.meaning.toLowerCase().includes(searchTerm) ||
            vocab.category.toLowerCase().includes(searchTerm)
        );
        const totalPages = Math.ceil(filteredVocabularies.length / vocabItemsPerPage);
        const start = (currentVocabPage - 1) * vocabItemsPerPage;
        const end = start + vocabItemsPerPage;
        const paginatedVocabularies = filteredVocabularies.slice(start, end);

        const tableBody = document.getElementById('vocabularyTableBody');
        tableBody.innerHTML = '';
        paginatedVocabularies.forEach((vocab, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vocab.word}</td>
                <td>${vocab.meaning}</td>
                <td>${vocab.category}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="openEditVocabularyPopup(${start + index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="openDeleteVocabularyPopup(${start + index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        renderVocabularyPagination(totalPages);
    }

    function renderVocabularyPagination(totalPages) {
        const pagination = document.getElementById('vocabularyPagination');
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = i === currentVocabPage ? 'active' : '';
            button.onclick = () => {
                currentVocabPage = i;
                renderVocabularies();
            };
            pagination.appendChild(button);
        }
    }

function openAddVocabularyPopup() {
    document.getElementById('vocabularyPopupTitle').textContent = 'Thêm Từ Vựng';
    document.getElementById('vocabWord').value = '';
    document.getElementById('vocabMeaning').value = '';
    document.getElementById('vocabCategory').value = '';
    populateCategoryOptions(); 
    document.getElementById('vocabularyPopup').style.display = 'flex';
}

    function closeVocabularyPopup() {
        document.getElementById('vocabularyPopup').style.display = 'none';
    }

    function saveVocabulary() {
        const word = document.getElementById('vocabWord').value;
        const meaning = document.getElementById('vocabMeaning').value;
        const category = document.getElementById('vocabCategory').value;

        if (word && meaning && category) {
            if (window.currentEditVocabIndex !== undefined) {
                
                vocabularies[window.currentEditVocabIndex] = { word, meaning, category };
                window.currentEditVocabIndex = undefined; 
            } else {
              
                vocabularies.push({ word, meaning, category });
            }

       
            localStorage.setItem('vocabularies', JSON.stringify(vocabularies)); 
            closeVocabularyPopup();
            renderVocabularies();
        }
    }

    function openEditVocabularyPopup(index) {
        document.getElementById('vocabularyPopupTitle').textContent = 'Chỉnh Sửa Từ Vựng';
        document.getElementById('vocabWord').value = vocabularies[index].word;
        document.getElementById('vocabMeaning').value = vocabularies[index].meaning;
        document.getElementById('vocabCategory').value = vocabularies[index].category;
        document.getElementById('vocabularyPopup').style.display = 'flex';

        window.currentEditVocabIndex = index;
    }


    function openDeleteVocabularyPopup(index) {
        document.getElementById('vocabularyDeletePopup').style.display = 'flex';
        window.currentDeleteVocabIndex = index;
    }

    function closeVocabularyDeletePopup() {
        document.getElementById('vocabularyDeletePopup').style.display = 'none';
    }

    function confirmVocabularyDelete() {
    vocabularies.splice(window.currentDeleteIndex, 1);
    localStorage.setItem('vocabularies', JSON.stringify(vocabularies));
    closeVocabularyDeletePopup();
    renderVocabularies();
}


    function loadVocabulariesFromLocalStorage() {
        const storedVocabularies = localStorage.getItem('vocabularies');
        if (storedVocabularies) {
            vocabularies = JSON.parse(storedVocabularies);
        }
    }
function populateCategoryOptions() {
    const select = document.getElementById('vocabCategory');
    select.innerHTML = '<option value="">-- Chọn chủ đề --</option>';

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        const categoryList = JSON.parse(storedCategories);
        categoryList.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    }
}



    
    loadVocabulariesFromLocalStorage();
    renderVocabularies();
