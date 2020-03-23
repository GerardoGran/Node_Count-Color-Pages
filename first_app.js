const { exec } = require('child_process');

var fileName = "Thesis_TEST.pdf"
var colorCount = 0;
var greyCount;

exec(`gswin64c -q -o - -sDEVICE=inkcov ${fileName} | grep -v Page`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    var colorInfo = stdout.split("\n"); //Splits Output by line into a string array
    var docLength = colorInfo.length - 1;   //Length of Doc - 1 to account for null element at end of Array

    for (var i = 0; i < docLength; i++) {   //Check if page to see if it has color

        //Adding colors as numbers since any amount of color make it a color page
        var color = parseFloat(colorInfo[i].substring(1, 8));   //Turn Cyan coverage value into a float
        color += parseFloat(colorInfo[i].substring(10, 17));    //Adds Magenta coverage value to color
        color += parseFloat(colorInfo[i].substring(19, 26));    //Adds Yellow coverage value to color

        if (color > 0)
            ++colorCount;
    }

    greyCount = docLength - colorCount;

    console.log(`${fileName}:\n|-Pages: ${docLength}\n|-->B&W: ${greyCount}\n|-->Color: ${colorCount}`);
});


// GHOSTSCRIPT COLOR DETECTION: https://stackoverflow.com/questions/12299574/ghostscript-color-detection
// SHELL COMMANDS WITH NODE JS: https://stackabuse.com/executing-shell-commands-with-node-js/