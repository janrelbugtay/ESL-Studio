const Jimp = require('jimp');

async function check(filename) {
  const image = await Jimp.read(filename);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  console.log(filename, "top-left:", Jimp.intToRGBA(image.getPixelColor(0, 0)));
  console.log(filename, "center:", Jimp.intToRGBA(image.getPixelColor(w/2, h/2)));
  
  // Find where the pinkish background ends (where the actual art begins)
  // Let's scan from the middle top down until the color changes significantly from the top-left color
  const tlColor = Jimp.intToRGBA(image.getPixelColor(0, 0));
  
  let artTop = 0;
  for(let y=0; y<h/2; y++) {
    let color = Jimp.intToRGBA(image.getPixelColor(w/2, y));
    if (Math.abs(color.r - tlColor.r) > 10 || Math.abs(color.g - tlColor.g) > 10 || Math.abs(color.b - tlColor.b) > 10) {
      artTop = y;
      break;
    }
  }
  
  let artBottom = h-1;
  const blColor = Jimp.intToRGBA(image.getPixelColor(0, h-1));
  for(let y=h-1; y>h/2; y--) {
    let color = Jimp.intToRGBA(image.getPixelColor(w/2, y));
    if (Math.abs(color.r - blColor.r) > 10 || Math.abs(color.g - blColor.g) > 10 || Math.abs(color.b - blColor.b) > 10) {
      artBottom = y;
      break;
    }
  }

  let artLeft = 0;
  for(let x=0; x<w/2; x++) {
    let color = Jimp.intToRGBA(image.getPixelColor(x, h/2));
    if (Math.abs(color.r - tlColor.r) > 10 || Math.abs(color.g - tlColor.g) > 10 || Math.abs(color.b - tlColor.b) > 10) {
      artLeft = x;
      break;
    }
  }
  
  let artRight = w-1;
  for(let x=w-1; x>w/2; x--) {
    let color = Jimp.intToRGBA(image.getPixelColor(x, h/2));
    if (Math.abs(color.r - tlColor.r) > 10 || Math.abs(color.g - tlColor.g) > 10 || Math.abs(color.b - tlColor.b) > 10) {
      artRight = x;
      break;
    }
  }
  
  console.log(filename, "Art bounds:", {top: artTop, bottom: artBottom, left: artLeft, right: artRight});
}

async function main() {
  await check('public/images/mystery-box.png');
  await check('public/images/bubble-pop.png');
  await check('public/images/sumo.png');
}

main();
