const express = require('express');
const dotenv = require('dotenv');
const shortenRouter = require('./api/shorten');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api', shortenRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
