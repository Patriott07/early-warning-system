import express from 'express';
import dotenv from 'dotenv';
import fileupload from 'express-fileupload';
import cors from 'cors';

// import route
import DataRoute from './router/data.route.js';

const app = express();
dotenv.config({path : './.env'});

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(fileupload());

// use routes
app.use('/api/data', DataRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
