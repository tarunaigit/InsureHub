Write-Host "Starting InsureHub PostgreSQL..."
docker compose up -d postgres

Write-Host "Open two terminals:"
Write-Host "1) cd backend; mvn spring-boot:run"
Write-Host "2) cd frontend; npm install; npm run dev"
Write-Host "Or run the complete stack with: docker compose up --build"
