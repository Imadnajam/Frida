const express = require('express');
const uploadRoutes = require('./routes/Api');

const app = express();

app.use(express.json());

app.use('/api', uploadRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
