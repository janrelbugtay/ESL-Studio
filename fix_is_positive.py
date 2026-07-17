import re

with open('public/mystery-box.html', 'r') as f:
    content = f.read()

old_is_pos = """        const isPositive = !["sub", "lose"].some((prefix) =>
          randomOutcome.id.startsWith(prefix),
        );"""
        
new_is_pos = """        const isPositive = !["sub", "lose", "minus", "give"].some((prefix) =>
          randomOutcome.id.startsWith(prefix),
        );"""
content = content.replace(old_is_pos, new_is_pos)

# Also let's check currentOutcome.type in the reveal modal to render the correct UI.
# It seems `currentOutcome.type === 'points'` is used somewhere. I didn't add a 'type' property!
# Let me check OUTCOMES definition again.
