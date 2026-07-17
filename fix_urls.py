import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Revert image URLs
    content = content.replace('"/images/mystery-box.png?v=3"', '"https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w1000"')
    content = content.replace('"/images/bubble-pop.png?v=3"', '"https://drive.google.com/thumbnail?id=1AHwLQ7lCIsKt9fzMlWAJWMnRCfFE4mE-&sz=w1000"')
    content = content.replace('"/images/sumo.png?v=3"', '"https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000"')

    # Increase scale to crop out pinkish border
    # In Home.tsx: className="w-full h-full object-cover scale-[1.04] group-hover:scale-110 transition-transform duration-700"
    content = content.replace('scale-[1.04]', 'scale-[1.12]')
    
    with open(filepath, 'w') as f:
        f.write(content)

fix_file('src/views/Home.tsx')
fix_file('src/views/GamesLibrary.tsx')
