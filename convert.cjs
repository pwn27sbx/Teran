const potrace = require('potrace');
const fs = require('fs');

potrace.trace('public/logos/NextGard.png', function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('public/logos/nexgard.svg', svg);
  console.log('Conversion successful!');
});
