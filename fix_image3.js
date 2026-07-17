import { Jimp } from 'jimp';

async function fix(filename) {
  try {
    const image = await Jimp.read(filename);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    let rightMostX = 0;
    for (let y = h - 150; y < h - 20; y++) {
      for (let x = 100; x < w - 100; x++) {
        const color = image.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(color);
        if (rgba.r < 150 && rgba.g < 150 && rgba.b < 150) {
          if (x > rightMostX) rightMostX = x;
        }
      }
    }
    
    console.log(filename, "Rightmost dark X:", rightMostX);
    if (rightMostX > 0) {
      for (let y = h - 150; y < h; y++) {
        for (let x = rightMostX - 30; x <= rightMostX + 10; x++) {
          image.setPixelColor(0xFFFFFFFF, x, y);
        }
      }
    }
    
    const cropX = Math.floor(w * 0.045);
    const cropY = Math.floor(h * 0.045);
    const cropW = Math.floor(w * 0.91);
    const cropH = Math.floor(h * 0.91);
    
    image.crop({x: cropX, y: cropY, w: cropW, h: cropH}); // This will fail if Jimp doesn't accept objects
    
    await image.write(filename);
    console.log("Saved", filename);
  } catch(e) {
    console.error("Error with", filename, e);
  }
}
