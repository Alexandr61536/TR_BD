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

app.post('/api/LEDForm_response', (req, res) => {
    let path = lib_process.process_form_request(req.body);
    res.json(lib_process.generate_post_responce(path));
})