const express = require('express');

const app = express();
const port = 8080;

function getHomeMessage() {
    return 'Hello World!';
}

app.get('/', (req, res) => res.send(getHomeMessage()));

if (require.main === module) {
    app.listen(port);
    console.log(`App running on http://localhost:${port}`);
}

module.exports = {
    app,
    getHomeMessage
};
