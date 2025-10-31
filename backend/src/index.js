require('dotenv').config(); // MUST be first
const app = require('./app');
const { PORT = 4000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
