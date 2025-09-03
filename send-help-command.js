// Send AT+HELP command to stdin
process.stdin.write('AT+HELP\n');

// Wait a moment then send AT+ALARMLOG check
setTimeout(() => {
    process.stdin.write('AT+ALARMLOG\n');
}, 1000);

// Exit after testing
setTimeout(() => {
    process.stdin.write('exit\n');
    process.exit(0);
}, 2000);