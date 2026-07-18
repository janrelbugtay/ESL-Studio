with open('src/views/NeonChain.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '</button>\n          </div>\n          </div>\n        </div>\n      )}',
    '</button>\n          </div>\n        </div>\n      )}'
)

content = content.replace(
    '</div>\n                 </div>\n              </div>\n              </div>\n            </div>\n      )}',
    '</div>\n                 </div>\n              </div>\n            </div>\n      )}'
)

with open('src/views/NeonChain.tsx', 'w') as f:
    f.write(content)
