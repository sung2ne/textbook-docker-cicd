// 파일: mongo-init/init.js
db = db.getSiblingDB('myapp');

db.createCollection('todos');

db.todos.insertMany([
  {
    title: 'Docker Compose 배우기',
    completed: true,
    createdAt: new Date()
  },
  {
    title: 'CI/CD 파이프라인 구축하기',
    completed: false,
    createdAt: new Date()
  },
  {
    title: '프로덕션 배포 자동화하기',
    completed: false,
    createdAt: new Date()
  }
]);

print('초기 데이터 삽입 완료');
