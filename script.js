// API 엔드포인트
const API_BASE_URL = '/api';

// DOM 요소
const inventoryForm = document.getElementById('inventoryForm');
const checkShortageBtn = document.getElementById('checkShortage');
const shortageList = document.getElementById('shortageList');
const shortageItems = document.getElementById('shortageItems');
const allItems = document.getElementById('allItems');

// 폼 제출 이벤트
inventoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        product_name: document.getElementById('productName').value,
        required_quantity: parseInt(document.getElementById('requiredQuantity').value),
        stock_quantity: parseInt(document.getElementById('stockQuantity').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('품목이 성공적으로 저장되었습니다.');
            inventoryForm.reset();
            loadAllItems();
        } else {
            const error = await response.json();
            alert('저장 실패: ' + error.message);
        }
    } catch (error) {
        alert('오류가 발생했습니다: ' + error.message);
    }
});

// 재고 파악 버튼 이벤트
checkShortageBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/shortage`);
        const shortageData = await response.json();

        if (response.ok) {
            displayShortageItems(shortageData);
        } else {
            alert('데이터 조회 실패: ' + shortageData.message);
        }
    } catch (error) {
        alert('오류가 발생했습니다: ' + error.message);
    }
});

// 부족품목 표시
function displayShortageItems(items) {
    shortageItems.innerHTML = '';
    
    if (items.length === 0) {
        shortageItems.innerHTML = '<p class="text-muted">부족한 품목이 없습니다.</p>';
    } else {
        items.forEach(item => {
            const shortageDiv = document.createElement('div');
            shortageDiv.className = 'shortage-item p-3 mb-2';
            shortageDiv.innerHTML = `
                <h6>${item.product_name}</h6>
                <div class="row">
                    <div class="col-md-4"><strong>소요량:</strong> ${item.required_quantity}</div>
                    <div class="col-md-4"><strong>재고량:</strong> ${item.stock_quantity}</div>
                    <div class="col-md-4"><strong>부족분:</strong> <span class="text-danger">${item.shortage}</span></div>
                </div>
            `;
            shortageItems.appendChild(shortageDiv);
        });
    }
    
    shortageList.style.display = 'block';
}

// 전체 품목 로드
async function loadAllItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory`);
        const items = await response.json();

        if (response.ok) {
            displayAllItems(items);
        }
    } catch (error) {
        console.error('전체 품목 로드 실패:', error);
    }
}

// 전체 품목 표시
function displayAllItems(items) {
    allItems.innerHTML = '';
    
    if (items.length === 0) {
        allItems.innerHTML = '<p class="text-muted">등록된 품목이 없습니다.</p>';
    } else {
        const table = document.createElement('table');
        table.className = 'table table-striped';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>품명</th>
                    <th>소요량</th>
                    <th>재고량</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        items.forEach(item => {
            const row = document.createElement('tr');
            const status = item.stock_quantity >= item.required_quantity ? 
                '<span class="badge bg-success">충분</span>' : 
                '<span class="badge bg-warning">부족</span>';
            
            row.innerHTML = `
                <td>${item.product_name}</td>
                <td>${item.required_quantity}</td>
                <td>${item.stock_quantity}</td>
                <td>${status}</td>
            `;
            tbody.appendChild(row);
        });
        
        allItems.appendChild(table);
    }
}

// 페이지 로드 시 전체 품목 표시
document.addEventListener('DOMContentLoaded', loadAllItems);
