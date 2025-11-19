# 재고 관리 시스템

품목별 소요량과 재고량을 관리하고 부족분을 파악하는 간단한 웹 애플리케이션입니다.

## 기능

- 품명, 소요량, 재고량 입력 및 저장
- 전체 품목 목록 조회
- 재고 파악: 소요량이 재고량보다 큰 품목들 나열
- 부족분 계산 (재고량 - 소요량)

## 기술 스택

- **프론트엔드**: HTML5, CSS3, JavaScript, Bootstrap 5
- **백엔드**: Node.js, Express.js
- **데이터베이스**: SQLite3
- **배포**: Railway

## 설치 및 실행

### 로컬 실행

1. 저장소 클론
```bash
git clone <repository-url>
cd inventory-management
```

2. 의존성 설치
```bash
npm install
```

3. 서버 시작
```bash
npm start
```

4. 브라우저에서 `http://localhost:3000` 접속

### Railway 배포

1. GitHub에 저장소 푸시
2. Railway에서 새 프로젝트 생성
3. GitHub 저장소 연결
4. 자동 배포 완료 후 애플리케이션 접속

## API 엔드포인트

- `GET /api/inventory` - 전체 품목 조회
- `POST /api/inventory` - 품목 추가
- `GET /api/shortage` - 부족품목 조회
- `DELETE /api/inventory/:id` - 품목 삭제

## 데이터베이스 스키마

```sql
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    required_quantity INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 사용 방법

1. 품명, 소요량, 재고량을 입력하고 "저장" 버튼 클릭
2. "재고 파악" 버튼을 클릭하여 부족한 품목 확인
3. 부족품목 목록에서 소요량, 재고량, 부족분 확인
4. 전체 품목 목록에서 모든 품목의 상태 확인
