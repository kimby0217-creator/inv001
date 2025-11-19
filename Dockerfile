FROM node:18-alpine

# 작업 디렉토리 생성
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install --production

# 애플리케이션 코드 복사
COPY . .

# Railway에서 PORT 환경변수를 넘겨주므로 참고만
EXPOSE 3000

# 앱 시작
CMD ["npm", "start"]
