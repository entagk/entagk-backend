const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.PORT || 5500;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}/`)
  }))
  .catch((error) => console.log("The MongoDB Error is", error.message, "%n", error));

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);