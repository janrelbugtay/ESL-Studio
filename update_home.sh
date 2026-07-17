sed -i 's/icon: "🎁"/icon: "https:\/\/drive.google.com\/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn\&sz=w1000"/' src/views/Home.tsx
sed -i 's/{game.icon}/{game.icon?.startsWith("http") ? <img src={game.icon} alt="" className="w-20 h-20 object-contain drop-shadow-md" \/> : game.icon}/' src/views/Home.tsx
