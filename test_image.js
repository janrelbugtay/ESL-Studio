const res = await fetch('http://localhost:3000/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'happy dog' })
});
console.log(await res.json());
