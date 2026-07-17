const Jimp = require('jimp');

async function fix(filename) {
  const image = await Jimp.read(filename);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  let rightMostX = 0;
  
  // Find the bounding box of the text, ignoring edges (x from 100 to w - 100)
  for (let y = h - 150; y < h - 20; y++) {
    for (let x = 100; x < w - 100; x++) {
      const color = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(color);
      // Not white means it's text or icon. 
      // The text is typically black or dark brown.
      if (rgba.r < 150 && rgba.g < 150 && rgba.b < 150) {
        if (x > rightMostX) {
          rightMostX = x;
        }
      }
    }
  }
  
  console.log(filename, "Rightmost dark X:", rightMostX);
  
  // Now erase the colon which is presumably at the rightmost part.
  // The colon should be roughly from `rightMostX - 25` to `rightMostX + 5`.
  if (rightMostX > 0) {
    for (let y = h - 150; y < h; y++) {
      for (let x = rightMostX - 30; x <= rightMostX + 10; x++) {
        // Only paint over dark pixels (to avoid breaking the background if it's not perfectly white)
        // Wait, the background is white, so just paint it white!
        // But the text might overlap with the edge of the bubble or something? No, it's a white banner.
        image.setPixelColor(0xFFFFFFFF, x, y); 
      }
    }
  }
  
  await image.writeAsync(filename);
  console.log("Fixed", filename);
}

async function main() {
  await fix('public/images/mystery-box.png');
  await fix('public/images/bubble-pop.png');
  await fix('public/images/sumo.png');
}

main();
