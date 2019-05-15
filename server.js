var express = require('express');
var routes  = require('./api/routes/api_routes');

// Instantiate express
const app = express();

// Configure app to user bodyParser
app.use(express.json());

// Set our port
const port = process.env.PORT || 8000;

// Register our routes in app
app.use(routes);

// Start our server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
// Export our app for testing purposes
module.exports = app;
