const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT || 3010;
const path = require('node:path'); 

const app = express();
app.use(cors())
app.use(express.static(path.resolve('../frontend/build')));
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/api/LED_form', (req, res) => {
    res.json(lib_send.get_form());
});

app.post('/api/login', (req, res) => {
    console.log(JSON.stringify(req.body));
    res.json({"accepted": "y", "role": "client"});
})