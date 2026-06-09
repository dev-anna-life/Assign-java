const fs = require('fs');

fs.readFile('script.json', 'utf8', (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    console.log(jsonData);

    // Check if image file exists
    jsonData.forEach(item => {
        const imagePath = item.image;
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`Image not found: ${imagePath}`);
            } else {
                console.log(`Image exists: ${imagePath}`);
            }
        });
    });
});
  