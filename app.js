const express = require('express');
const app = express();
const port = 3000;
// routes import 

const task = require('./routes/tasks')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', task)

app.get('/server/health', (req, resp) => {
    return resp.send("server happy and running ...");
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;