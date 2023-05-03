const express = require('express');
const session = require('express-session');
const cors = require('cors');
const createError = require('http-errors');
const app = express();
const userRouter = require('./routes/userRoutes.js');
const groupRoutes = require('./routes/groupRoutes');
const participantRoutes = require('./routes/participantRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const mongoose = require('mongoose');

const participantAuthRoutes = require('./routes/participantAuthRoutes');    
// Change to hostname after following schema: username:pw@host:port/dbname
//mongoose.connect('mongodb://dynamicteachingtools:wyhcR.7fDfPp@localhost:27017/dynamicteachingtools', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://0.0.0.0:27017/shiftplan', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://0.0.0.0:27017/biodidacticsDB', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("DB connected!")
  // we're connected!
});


app.use(express.json());
app.use(cors());


//register routes
app.get('/api', (req, res) => {
  res.send('Server is working!');
});
app.use('/api/users', userRouter);
app.use('/api/groups', groupRoutes);
app.use('/api/groups/:groupId/participants', participantRoutes);
app.use('/api/groups/:groupId/shifts', shiftRoutes);
app.use('/api/participants', participantAuthRoutes);

// //catch 404 and create error
app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3008, () => {
  console.log('Server started on port 3008');
});


module.exports = app;