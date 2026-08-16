const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

const errorCatcher = `
<script>
window.onerror = function(message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.fontSize = '16px';
    errorDiv.innerText = message + ' at ' + lineno + ':' + colno + ' ' + (error && error.stack ? error.stack : '');
    document.body.appendChild(errorDiv);
};
window.onunhandledrejection = function(event) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '50px';
    errorDiv.style.left = '0';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.backgroundColor = 'rgba(255,100,0,0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.fontSize = '16px';
    errorDiv.innerText = 'Unhandled Promise Rejection: ' + event.reason;
    document.body.appendChild(errorDiv);
};
</script>
`;

if (!code.includes('window.onerror = function')) {
    code = code.replace("</head>", errorCatcher + "\n</head>");
    fs.writeFileSync('public/bubble-sentence.html', code);
    console.log("Added error display");
}
