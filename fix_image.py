import sys
from PIL import Image

def fix(filename):
    try:
        img = Image.open(filename).convert("RGBA")
    except Exception as e:
        print("Error opening", filename, e)
        return
        
    w, h = img.size
    pixels = img.load()
    
    # 1. Paint out the colon
    rightMostX = 0
    for y in range(h - 150, h - 20):
        for x in range(100, w - 100):
            r, g, b, a = pixels[x, y]
            if r < 150 and g < 150 and b < 150:
                if x > rightMostX:
                    rightMostX = x
                    
    print(filename, "Rightmost dark X:", rightMostX)
    
    if rightMostX > 0:
        for y in range(h - 150, h):
            for x in range(rightMostX - 30, rightMostX + 10):
                pixels[x, y] = (255, 255, 255, 255)
                
    # 2. Crop the image to remove the pinkish background
    # The pinkish background might be the outer border of the generated image.
    # Let's crop 5% from all sides, or find the actual bounding box.
    # We can just crop out 24 pixels from all sides.
    # Let's do 32 pixels.
    # The user says "show image in full do not include the pinkish background"
    # Wait, the pinkish background is probably the card background in CSS?
    # No, the screenshot shows the images themselves have a pinkish/beige rounded border!
    # They are 1000x791 images that have an inner image and a pinkish padded border.
    # Let's find the inner bounding box.
    
    # Let's just crop out the padding.
    # I will inspect the center row and column to find the edges.
    left_edge = 0
    bg_color = pixels[0, h//2]
    
    for x in range(0, w//2):
        if pixels[x, h//2] != bg_color:
            left_edge = x
            break
            
    right_edge = w - 1
    bg_color_r = pixels[w-1, h//2]
    for x in range(w-1, w//2, -1):
        if pixels[x, h//2] != bg_color_r:
            right_edge = x
            break
            
    top_edge = 0
    bg_color_t = pixels[w//2, 0]
    for y in range(0, h//2):
        if pixels[w//2, y] != bg_color_t:
            top_edge = y
            break
            
    bottom_edge = h - 1
    bg_color_b = pixels[w//2, h-1]
    for y in range(h-1, h//2, -1):
        if pixels[w//2, y] != bg_color_b:
            bottom_edge = y
            break
            
    print(filename, "Edges:", left_edge, right_edge, top_edge, bottom_edge)
    
    # Let's crop it safely (add a small margin)
    box = (left_edge, top_edge, right_edge, bottom_edge)
    
    # Actually if the edge detection fails, just use a heuristic 5%
    if left_edge < 10 or top_edge < 10:
        box = (40, 40, w - 40, h - 40)
        
    img = img.crop(box)
    img.save(filename, format="PNG")
    print("Saved", filename)

fix('public/images/mystery-box.png')
fix('public/images/bubble-pop.png')
fix('public/images/sumo.png')
