const request = require('request');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const randomUUID = () => {
    let uuid = '';
    for (let i = 0; i < 36; i++) {
        const a = Math.random() * 16 | 0;
        uuid += (i === 14 ? 4 : (i === 19 ? (a & 3 | 8) : a)).toString(16);
    }
    return uuid;
};

class MakeMeAZombie {
    constructor() {}

    async transform(args) {
        return new Promise((resolve, reject) => {
            if (args.photo) {
                this.convertTo64(args.photo)
                    .then(async (res) => {
                        const nameFile = `${randomUUID()}.jpeg`;
                        const pathImage = path.join(__dirname, `../tmp/${nameFile}`);
                        const base64Image = res.split(';base64,').pop();
                        fs.writeFileSync(pathImage, base64Image, { encoding: 'base64' });

                        request.post({
                            url: 'https://zombieapi.azurewebsites.net/transform',
                            contentType: false,
                            formData: {
                                image: fs.createReadStream(pathImage),
                            },
                        }, async (error, response, body) => {
                            fs.unlinkSync(pathImage);

                            if (error) {
                                reject('An error occurred while trying to transform the image');
                            } else {
                                if (body === 'No face found') {
                                    reject('It was not possible to identify a face in the image, try sending a profile image');
                                } else {
                                    const imgBuffer = Buffer.from(body, 'base64');
                                    sharp(imgBuffer)
                                        .extract({ width: 512, height: 512, left: 512, top: 0 })
                                        .resize(720, 720)
                                        .toBuffer()
                                        .then((buffer) => {
                                            if (args.destinyFolder) {
                                                if (fs.existsSync(args.destinyFolder)) {
                                                    const finalImage = path.join(args.destinyFolder, nameFile);
                                                    fs.writeFileSync(finalImage, buffer.toString('base64'), { encoding: 'base64' });
                                                    resolve(finalImage);
                                                } else {
                                                    reject('Destiny Directory not found.');
                                                }
                                            } else {
                                                resolve(buffer.toString('base64'));
                                            }
                                        })
                                        .catch(() => {
                                            reject('An error occurred while trying to transform the image with sharp');
                                        });
                                }
                            }
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                reject('An image must be provided to transform...');
            }
        });
    }

    convertTo64(photo) {
        return new Promise((resolve, reject) => {
            resolve('base64String');
        });
    }
}

module.exports = MakeMeAZombie;