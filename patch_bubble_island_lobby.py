import re

with open('public/bubble-sentence.html', 'r') as f:
    content = f.read()

# 1. Add screen-setup
lobby_html = """
    <!-- Lobby / Setup Screen -->
    <div id="screen-setup" class="screen bg-black/60 backdrop-blur-md justify-center items-center z-40 p-4">
        <div class="glass bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-2xl relative text-center border-4 border-gray-200">
            <button onclick="Game.showScreen('screen-menu')" class="absolute top-6 right-6 text-3xl hover:scale-110 transition-transform">❌</button>
            <h2 class="text-5xl font-black text-gray-800 mb-8 drop-shadow-sm">Game Setup Lobby</h2>
            
            <div class="flex flex-col md:flex-row gap-6 mb-8 justify-center">
                <!-- 1 Player -->
                <button onclick="Game.selectMode(false)" id="btn-mode-1" class="flex-1 p-8 rounded-3xl border-4 transition-all hover:scale-105 btn-premium">
                    <div class="text-6xl mb-4">👤</div>
                    <div class="text-2xl font-black text-gray-800">1 Player</div>
                    <div class="text-sm font-bold text-gray-500 mt-2">Solo practice</div>
                </button>
                
                <!-- Classroom -->
                <button onclick="Game.selectMode(true)" id="btn-mode-2" class="flex-1 p-8 rounded-3xl border-4 transition-all hover:scale-105 btn-premium">
                    <div class="text-6xl mb-4">👥</div>
                    <div class="text-2xl font-black text-gray-800">Classroom</div>
                    <div class="text-sm font-bold text-gray-500 mt-2">Team competition</div>
                </button>
            </div>
            
            <button onclick="Game.startGameFromLobby()" class="btn-premium green w-full py-4 text-2xl font-black shadow-lg">🚀 START GAME</button>
        </div>
    </div>

    <div id="screen-game" class="screen relative" style="transition: box-shadow 0.2s">
"""

content = content.replace('<div id="screen-game" class="screen relative" style="transition: box-shadow 0.2s">', lobby_html)

# 2. Add Game properties for the lobby
js_lobby_funcs = """
            selectedCatId: null,
            openLobby(catId) {
                this.selectedCatId = catId;
                this.selectMode(this.classroomMode); // Select current mode
                this.showScreen('screen-setup');
            },
            selectMode(isClassroom) {
                this.classroomMode = isClassroom;
                document.getElementById('ui-classroom-scores').classList.toggle('hidden', !isClassroom);
                
                document.getElementById('btn-mode-1').classList.toggle('border-blue-500', !isClassroom);
                document.getElementById('btn-mode-1').classList.toggle('border-gray-200', isClassroom);
                
                document.getElementById('btn-mode-2').classList.toggle('border-blue-500', isClassroom);
                document.getElementById('btn-mode-2').classList.toggle('border-gray-200', !isClassroom);
            },
            startGameFromLobby() {
                if (this.selectedCatId) {
                    this.start(this.selectedCatId);
                }
            },
            start(catId) {
"""

content = content.replace('            start(catId) {', js_lobby_funcs)

# 3. Change island onclick to openLobby instead of start
content = content.replace('island.onclick = () => this.start(cat.id);', 'island.onclick = () => this.openLobby(cat.id);')

with open('public/bubble-sentence.html', 'w') as f:
    f.write(content)
