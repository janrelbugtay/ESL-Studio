import re

with open('src/views/MysteryBox.tsx', 'r') as f:
    content = f.read()

# Add states for folders and iframeLoaded
states = """  const [isSaving, setIsSaving] = useState(false);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        const qFolders = query(collection(db, "gameFolders"), where("userId", "==", user.uid));
        const foldersSnap = await getDocs(qFolders);
        const f: any[] = [];
        foldersSnap.forEach(doc => f.push({ id: doc.id, ...doc.data() }));
        setFolders(f);
      };
      fetchFolders();
    }
  }, [user]);

  useEffect(() => {
    if (iframeLoaded && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "SET_FOLDERS", data: folders },
        "*"
      );
    }
  }, [folders, iframeLoaded]);
"""

content = content.replace('  const [isSaving, setIsSaving] = useState(false);', states)

# Modify handleIframeLoad
iframe_load = """    const handleIframeLoad = () => {
      setIframeLoaded(true);
      if (initialGame && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "LOAD_MYSTERY_BOX", data: initialGame },
          "*",
        );
      }
    };"""

content = re.sub(r'    const handleIframeLoad = \(\) => \{\n      if \(initialGame && iframeRef\.current\?\.contentWindow\) \{\n        iframeRef\.current\.contentWindow\.postMessage\(\n          \{ type: "LOAD_MYSTERY_BOX", data: initialGame \},\n          "\*",\n        \);\n      \}\n    \};', iframe_load, content)

with open('src/views/MysteryBox.tsx', 'w') as f:
    f.write(content)
