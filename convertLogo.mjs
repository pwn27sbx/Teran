import potrace from 'potrace';
import fs from 'fs';

const input = 'public/logoteran.png';
const output = 'public/logoTeran.svg';

potrace.trace(input, {
    turdSize: 100,      // filter out speckles
    optTolerance: 0.2, // path simplification
    color: '#000000',
    background: 'transparent'
}, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync(output, svg);
  console.log('Converted successfully to ' + output);
});
