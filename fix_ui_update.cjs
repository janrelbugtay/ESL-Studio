const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

code = code.replace(/updateProfile\(\) \{(\s*)document\.getElementById\('ui-avatar'\)\.innerText = Storage\.data\.profile\.avatar;(\s*)document\.getElementById\('ui-coins-total'\)\.innerText = Storage\.data\.profile\.coins;(\s*)const gameCoins = document\.getElementById\('ui-coins-game'\);(\s*)if \(gameCoins\) gameCoins\.innerText = Storage\.data\.profile\.coins;/, `updateProfile() {
                const uiAvatar = document.getElementById('ui-avatar');
                if (uiAvatar) uiAvatar.innerText = Storage.data.profile.avatar;
                
                const uiCoinsTotal = document.getElementById('ui-coins-total');
                if (uiCoinsTotal) uiCoinsTotal.innerText = Storage.data.profile.coins;
                
                const gameCoins = document.getElementById('ui-coins-game');
                if (gameCoins) gameCoins.innerText = Storage.data.profile.coins;`);

fs.writeFileSync('public/bubble-sentence.html', code);
