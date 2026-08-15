const fs = require('fs');
const file = 'src/views/HamsterPopQuiz.tsx';
let code = fs.readFileSync(file, 'utf8');

const regexHandle = /const handleTimeUpdate = \(\) => \{[\s\S]*?^\s*\};\n/m;
const newHandle = `const handleTimeUpdate = (state: { playedSeconds: number, loadedSeconds: number }) => {
    const currentSeconds = state.playedSeconds;
    setCurrentTime(currentSeconds);
    const duration = videoDuration || 120;
    
    const currentProgress = (currentSeconds / duration) * 100;
    setProgress(currentProgress);

    const triggeredQuiz = questions.find((q: any) => 
      !quizHistory.includes(q.id) && 
      Math.abs(q.timeTrigger - currentSeconds) < 0.5 
    );

    if (triggeredQuiz && isPlaying && !activeQuiz) {
      setIsPlaying(false); 
      setActiveQuiz(triggeredQuiz);
      if (videoRef.current && typeof videoRef.current.seekTo === 'function') {
        videoRef.current.seekTo(triggeredQuiz.timeTrigger, 'seconds');
      }
    }
  };
`;
code = code.replace(regexHandle, newHandle);

const renderTarget1 = `{Math.floor(videoRef.current?.getCurrentTime() || 0)}s`;
const renderReplacement1 = `{Math.floor(currentTime)}s`;
code = code.replace(renderTarget1, renderReplacement1);

fs.writeFileSync(file, code);
