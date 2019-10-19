const express = require("express");
const path = require("path");
const fs = require("fs");
const Jimp = require('jimp');
const bodyParser = require('body-parser');
const multer = require('multer');

const modifyExif = require('modify-exif');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '__' + file.originalname);
    }
})

const app = express();
const upload = multer({ storage: storage });

const PORT = process.env.PORT || '3001';

app.engine("pug", require("pug").__express);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.get('/show', async(req, res) => {
    const images = getImagesFromDir(path.join(__dirname, 'uploads'));

    res.render('show', {
        images: images
    });
});

app.get('/', (req, res) => {
    res.render('index');
});


app.post('/upload', upload.array('file'), async(req, res, next) => {
    const images = req.files;

    for (image of images) {
        await correctOrientation(image);
    }

    res.redirect('./show');
});


const readFileAsync = async(file) => {
    return await new Promise((resolve, reject) => {
        fs.readFile(file, async(err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};

const correctOrientation = async(image) => {
    let imageOrientation = false;
    let rotateDeg = 0;

    const buffer = modifyExif(await readFileAsync(path.join(__dirname, "uploads") + '/' + image.filename), data => {
        imageOrientation = data && data["0th"] && data["0th"]["274"] ? data["0th"]["274"] : false;
        if (imageOrientation) {
            if (imageOrientation === 1) {
                imageOrientation = false;
            } else {
                data["0th"]["274"] = 1; // reset EXIF orientation value
            }
        }
    });

    if (imageOrientation) {
        switch (imageOrientation) {
            case 3:
                rotateDeg = 180;
                break;
            case 6:
                rotateDeg = 270;
                break;
            case 8:
                rotateDeg = 90;
                reak;
            default:
                rotateDeg = 0;
                break;
        }
        Jimp.read(buffer, (err, lenna) => {
            if (err) {
                console.log('err', err);
                return;
            }
            lenna
                .rotate(rotateDeg) // correct orientation
                .write(path.join(__dirname, "uploads") + '/' + image.filename); // save
        });
    }
};


const getImagesFromDir = (dirPath) => {
    let allImages = [];

    let files = fs.readdirSync(dirPath);

    for (file of files) {
        let fileLocation = path.join(dirPath, file);
        var stat = fs.statSync(fileLocation);
        if (stat && stat.isDirectory()) {
            getImagesFromDir(fileLocation);
        } else if (stat && stat.isFile() && ['.jpg', '.png', '.PNG', '.JPG', '.jpeg'].indexOf(path.extname(fileLocation)) != -1) {
            allImages.push(file);
        }
    }

    return allImages.reverse();
};

app.listen(PORT);
console.log('app running on port ', PORT);