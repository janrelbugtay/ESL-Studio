const res = await fetch('http://localhost:3000/api/generate-mystery-box-questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'animals', level: 'B1', type: 'mcq' })
});
console.log(await res.json());
