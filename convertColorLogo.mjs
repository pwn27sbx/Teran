import fs from 'fs';
import ImageTracer from 'imagetracerjs';
import getPixels from 'get-pixels';

getPixels('public/logoteran.png', function(err, pixels) {
  if (err) {
    console.log("Bad image path");
    return;
  }
  
  const imgData = {
    width: pixels.shape[0],
    height: pixels.shape[1],
    data: pixels.data
  };

  const svgStr = ImageTracer.imagedataToSVG(imgData, { 
    numberofcolors: 64, // high color fidelity
    blurradius: 0,
    pathomit: 4
  });
  
  fs.writeFileSync('public/logoTeran.svg', svgStr);
  console.log('Converted successfully to public/logoTeran.svg');
});
