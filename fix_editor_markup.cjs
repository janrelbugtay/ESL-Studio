const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const regex = /<!-- Add Sentence Form -->[\s\S]*?(?=<!-- Global Settings Modal -->)/;

const replacement = `<!-- Add Sentence Form -->
                    <div class="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col gap-4">
                        <h4 class="font-bold text-gray-700 text-lg">Add New Sentence</h4>
                        <div class="flex gap-4 items-start">
                            <div class="flex-1 flex flex-col gap-1">
                                <input type="text" id="editor-new-sentence" placeholder="Type a sentence here..." class="w-full px-4 h-12 text-lg rounded-xl border-2 border-gray-300 focus:outline-none focus:border-blue-500" onkeydown="if(event.key==='Enter') Editor.addSentence()">
                            </div>
                            <div class="flex flex-col gap-1 w-32">
                                <select id="editor-new-diff" class="h-12 rounded-xl border-2 border-gray-300 font-bold px-2 focus:border-blue-500">
                                    <option value="1">Easy</option>
                                    <option value="2">Medium</option>
                                    <option value="3">Hard</option>
                                </select>
                            </div>
                            <button onclick="Editor.addSentence()" class="btn-premium green h-12 px-6">Add</button>
                        </div>
                    </div>
                    
                    <!-- Sentences List -->
                    <div id="editor-sentences" class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2 mt-4 pb-12"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Sentence Modal -->
    <div id="modal-sent" class="hidden fixed inset-0 justify-center items-center bg-black/50 backdrop-blur-sm z-[110]" style="display: none;">
        <div class="glass bg-white p-8 rounded-[30px] shadow-2xl w-full max-w-md border-4 border-gray-200">
            <h2 class="text-3xl font-black text-gray-800 mb-6 text-center">Edit Sentence</h2>
            <div class="space-y-4">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-bold text-gray-500">Sentence Text</label>
                    <input type="text" id="modal-sent-text" class="w-full px-4 h-12 text-lg rounded-xl border-2 border-gray-300 focus:outline-none focus:border-blue-500">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-bold text-gray-500">Difficulty</label>
                    <select id="modal-sent-diff" class="h-12 rounded-xl border-2 border-gray-300 font-bold px-2 focus:border-blue-500">
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
                <button onclick="Editor.closeSentModal()" class="px-6 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button onclick="Editor.saveSent()" class="btn-premium blue px-6 py-3">Save</button>
            </div>
        </div>
    </div>
    
    `;

code = code.replace(regex, replacement);

fs.writeFileSync('public/bubble-sentence.html', code);
