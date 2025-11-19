const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 데이터베이스 연결
const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error('데이터베이스 연결 오류:', err.message);
    } else {
        console.log('SQLite 데이터베이스에 연결되었습니다.');
        initDatabase();
    }
});

// 데이터베이스 초기화
function initDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT NOT NULL,
        required_quantity INTEGER NOT NULL,
        stock_quantity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('테이블 생성 오류:', err.message);
        } else {
            console.log('inventory 테이블이 준비되었습니다.');
        }
    });
}

// API 라우트

// 전체 품목 조회
app.get('/api/inventory', (req, res) => {
    const sql = 'SELECT * FROM inventory ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: '데이터 조회 실패', error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 품목 추가
app.post('/api/inventory', (req, res) => {
    const { product_name, required_quantity, stock_quantity } = req.body;
    
    if (!product_name || required_quantity === undefined || stock_quantity === undefined) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    const sql = 'INSERT INTO inventory (product_name, required_quantity, stock_quantity) VALUES (?, ?, ?)';
    db.run(sql, [product_name, required_quantity, stock_quantity], function(err) {
        if (err) {
            res.status(500).json({ message: '저장 실패', error: err.message });
        } else {
            res.status(201).json({ 
                message: '품목이 성공적으로 저장되었습니다.',
                id: this.lastID 
            });
        }
    });
});

// 부족품목 조회
app.get('/api/shortage', (req, res) => {
    const sql = 'SELECT *, (stock_quantity - required_quantity) as shortage FROM inventory WHERE required_quantity > stock_quantity ORDER BY shortage ASC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: '데이터 조회 실패', error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 품명으로 재고 검색
app.get('/api/inventory/search', (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: '품명을 입력해주세요.' });
    }

    const sql = `
        SELECT 
            product_name,
            SUM(required_quantity) AS required_quantity,
            SUM(stock_quantity) AS stock_quantity
        FROM inventory
        WHERE product_name = ?
        GROUP BY product_name
    `;

    db.get(sql, [name], (err, row) => {
        if (err) {
            return res.status(500).json({ message: '데이터 조회 실패', error: err.message });
        }

        if (!row) {
            return res.status(404).json({ message: '해당 품목을 찾을 수 없습니다.' });
        }

        res.json(row);
    });
});

// 품목 삭제
app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM inventory WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ message: '삭제 실패', error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: '품목을 찾을 수 없습니다.' });
        } else {
            res.json({ message: '품목이 삭제되었습니다.' });
        }
    });
});

// 루트 경로 - 정적 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// 그레이스풀 종료
process.on('SIGINT', () => {
    console.log('\n서버를 종료합니다...');
    db.close((err) => {
        if (err) {
            console.error('데이터베이스 종료 오류:', err.message);
        } else {
            console.log('데이터베이스 연결이 종료되었습니다.');
        }
        process.exit(0);
    });
});
