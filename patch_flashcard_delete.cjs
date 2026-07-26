const fs = require('fs');
const file = 'src/views/FlashcardsMatch.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetState = `  const [activeActivity, setActiveActivity] = useState<any>(null);`;
const replacementState = `  const [activeActivity, setActiveActivity] = useState<any>(null);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);`;

code = code.replace(targetState, replacementState);

const targetHandleDelete = `  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('Delete this activity?')) {
      setActivities(activities.filter(a => a.id !== id));
    }
  }`;
const replacementHandleDelete = `  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivityToDelete(id);
  }

  const confirmDelete = () => {
    if (activityToDelete !== null) {
      setActivities(activities.filter(a => a.id !== activityToDelete));
      setActivityToDelete(null);
    }
  }`;

code = code.replace(targetHandleDelete, replacementHandleDelete);

const targetModal = `      {/* Main Content Area */}`;
const replacementModal = `      {/* Delete Confirmation Modal */}
      {activityToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Delete Activity?</h2>
            <p className="text-slate-500 font-medium mb-6">
              Are you sure you want to delete this activity?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActivityToDelete(null)}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}`;

code = code.replace(targetModal, replacementModal);

fs.writeFileSync(file, code);
console.log("Patched FlashcardsMatch.tsx for delete");
