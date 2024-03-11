const app = require('./app');
const port = process.env.PORT || 3000;

console.log(`DB_USERNAME: ${process.env.DB_USERNAME}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});