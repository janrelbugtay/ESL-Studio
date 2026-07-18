with open('src/views/NeonChain.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '</button>\n               </div>\n            </div>\n          </div>\n        )}\n\n        {/* === GAME HUD === */}',
    '</button>\n               </div>\n            </div>\n          </div>\n          </div>\n        )}\n\n        {/* === GAME HUD === */}'
)

content = content.replace(
    '</button>\n                 </div>\n               </div>\n            </div>\n          );\n        })()}',
    '</button>\n                 </div>\n               </div>\n            </div>\n            </div>\n          );\n        })()}'
)

with open('src/views/NeonChain.tsx', 'w') as f:
    f.write(content)
