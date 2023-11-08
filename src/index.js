import fs from 'fs';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { basename } from 'path';

const __dirname = process.cwd();


const app = express();


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/public/views');

app.use('/public', express.static(__dirname + '/src/public'));
app.use('/libs', express.static(__dirname + '/node_modules'));
app.use('/static', express.static(__dirname + '/data'));


const router = express.Router({ caseSensitive: true });

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/models', (req, res) => {
    const models = JSON.parse(fs.readFileSync(__dirname + '/data/models.json', 'utf8'));
    res.json(models);
});

app.use(router);


app.listen(3000, () => {
    console.info('Server is running on http://localhost:3000');
});





/**
 * @returns {{ path: string; thumbnail: string; name: string; }[]}
 */
function getModels() {
    return fs.readdirSync(__dirname + '/data/models')
        .filter(file => file.endsWith('glb') || file.endsWith('gltf'))
        .map(file => {
            const path = basename(file);
            const name = path.replace(/[_-]/g, ' ').substring(0, path.lastIndexOf('.'));
            const thumbnail = path.replace(/\.[^.]+$/, '.png');

            return { path, thumbnail, name };
        });
}