import Tesseract from 'tesseract.js';

Tesseract.recognize('src/assets/detail.jpg', 'eng')
    .then(({ data: { text } }) => {
        console.log('--- OCR START ---');
        console.log(text);
        console.log('--- OCR END ---');
    })
    .catch(err => console.error(err));
