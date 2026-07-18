with open('src/views/NeonChain.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className={`absolute inset-0 z-50 ${isLight ? \'bg-slate-50/90\' : \'bg-[#050816]/90\'} backdrop-blur-xl flex flex-col items-center p-4 sm:p-8 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-500 pt-16`}>',
    '<div className={`absolute inset-0 z-50 ${isLight ? \'bg-slate-50/90\' : \'bg-[#050816]/90\'} backdrop-blur-xl overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-500`}>\n            <div className="w-full min-h-full flex flex-col items-center p-4 sm:p-8 pt-16">'
)

content = content.replace(
    '<div className={`absolute inset-0 z-50 ${isLight ? \'bg-slate-50/95\' : \'bg-[#050816]/95\'} backdrop-blur-2xl flex flex-col items-center p-4 sm:p-8 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-700 pt-16`}>',
    '<div className={`absolute inset-0 z-50 ${isLight ? \'bg-slate-50/95\' : \'bg-[#050816]/95\'} backdrop-blur-2xl overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-700`}>\n              <div className="w-full min-h-full flex flex-col items-center p-4 sm:p-8 pt-16">'
)

content = content.replace(
    '</button>\n          </div>\n        </div>\n      )}',
    '</button>\n          </div>\n          </div>\n        </div>\n      )}'
)

content = content.replace(
    '</div>\n                 </div>\n              </div>\n            </div>\n      )}',
    '</div>\n                 </div>\n              </div>\n              </div>\n            </div>\n      )}'
)

with open('src/views/NeonChain.tsx', 'w') as f:
    f.write(content)
