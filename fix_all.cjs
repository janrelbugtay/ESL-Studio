const Jimp = require('jimp');

async function fix(filename) {
  const image = await Jimp.read(filename);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  // We will crop 32 pixels from all sides to see if that removes the frame.
  // Actually, wait, let's just make the corner pixels transparent!
  // If the problem is just the corners, we can apply a mask.
  // But wait, the user says "do not include the pinkish background".
  // Maybe the entire background of the image is pinkish?
  // Let's crop it by 5% on all sides.
  const cropW = Math.floor(w * 0.95);
  const cropH = Math.floor(h * 0.95);
  const startX = Math.floor(w * 0.025);
  const startY = Math.floor(h * 0.025);
  
  image.crop(startX, startY, cropW, cropH);
  
  await image.writeAsync(filename.replace('.png', '-cropped.png'));
  console.log("Cropped", filename);
}

async function main() {
  await fix('public/images/mystery-box.png');
  await fix('public/images/bubble-pop.png');
  await fix('public/images/sumo.png');
}
main();
