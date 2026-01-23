const { isMobilePhone } = require('validator');

const frontendRegex = /^01\d{9}$/;

const testNumbers = [
    { num: '01711111111', desc: 'Valid 11-digit BD number' },
    { num: '0123456789', desc: 'Invalid 10-digit number (starts with 01)' },
    { num: '1234567890', desc: 'Invalid 10-digit number' },
    { num: '017111111111', desc: 'Invalid 12-digit number' },
    { num: '8801711111111', desc: 'Valid BD number with country code (Frontend may reject, Backend accepts)' }
];

console.log('--- Frontend Regex Verification ---');
testNumbers.forEach(t => {
    const isMatch = frontendRegex.test(t.num);
    console.log(`Number: ${t.num} (${t.desc}) -> Accepted: ${isMatch}`);
});

console.log('\n--- Backend Validator Verification (bn-BD) ---');
testNumbers.forEach(t => {
    const isValid = isMobilePhone(t.num, 'bn-BD');
    console.log(`Number: ${t.num} (${t.desc}) -> Accepted: ${isValid}`);
});
