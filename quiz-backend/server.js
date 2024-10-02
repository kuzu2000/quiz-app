const express = require('express');
const app = express();
const { createServer } = require('node:http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { initSocket } = require('./config/socketIo');
dotenv.config();
const PORT = process.env.PORT || 3500;

const server = createServer(app);

connectDB();

app.use(express.json());
app.use(cors({ origin: 'https://swan-quiz-app.vercel.app', credentials: true }));

app.use(cookieParser());

app.use('/auth', require('./routes/authRoute'));
app.use('/user', require('./routes/userRoute'));
app.use('/quiz', require('./routes/quizRoute'));
app.use('/notification', require('./routes/notificationRoute'));

initSocket(server);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
