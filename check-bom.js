import fs from 'fs';
const d = fs.readFileSync('d:\\Portofolio Zian Wahidi\\package-lock.json');
console.log('First 3 bytes:', d[0], d[1], d[2]);
console.log('Size:', d.length);
console.log('Has BOM:', d[0] === 0xEF && d[1] === 0xBB && d[2] === 0xBF);
