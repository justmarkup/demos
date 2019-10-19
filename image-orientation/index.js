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

app.get('/show', auth.connect(basicAuth), async(req, res) => {
    const images = getImagesFromDir(path.join(__dirname, 'uploads'));

    res.render('show', {
        images: images
    });
});

app.get('/', auth.connect(adminAuth), async(req, res) => {
    res.render('index');
});


app.post('/upload', auth.connect(adminAuth), upload.array('file'), async(req, res, next) => {
    const images = req.files ? req.files : req.body.files ? req.body.files : false;

    if (!images) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        res.redirect('/');
    }

    for (image of images) {
        await correctOrientation(image);
    }

    res.redirect('./');
});


const readFileAsync = async(file) => {
    return await new Promise((resolve, reject) => {
        fs.readFile(file, async(err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};

const writeFileAsync = async(file, buffer) => {
    return await new Promise((resolve, reject) => {
        fs.open(file, 'w', function(err, fd) {
            if (err) {
                throw 'could not open file: ' + err;
            }

            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) reject(err);
                fs.close(fd, function(data) {
                    resolve(data);
                });
            });
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
                data["0th"]["274"] = 1;
            }
        }
    });

    if (imageOrientation) {
        await writeFileAsync(path.join(__dirname, "uploads") + '/' + image.filename, buffer);
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
        Jimp.read(path.join(__dirname, "uploads") + '/' + image.filename, (err, lenna) => {
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