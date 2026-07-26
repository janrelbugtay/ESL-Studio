const fs = require('fs');
const file = 'src/components/Navigation.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldDestruct = 'const { user, signInWithGoogle, logout, loading } = useAuth();';
const newDestruct = 'const { user, signInWithGoogle, linkWithGoogle, logout, loading } = useAuth();';
code = code.replace(oldDestruct, newDestruct);

const oldDropdown = `                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-2">`;
const newDropdown = `                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email || (user.isAnonymous ? "Guest Account" : "")}
                    </p>
                  </div>
                  <div className="py-2">
                    {user.isAnonymous && (
                      <button
                        onClick={() => {
                          linkWithGoogle();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-purple transition-colors flex items-center justify-between"
                      >
                        Connect Google
                      </button>
                    )}`;
code = code.replace(oldDropdown, newDropdown);

fs.writeFileSync(file, code);
console.log("Patched Navigation.tsx");
