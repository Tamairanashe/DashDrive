const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\jchit\\Desktop\\Services\\DashDrive\\dashdrive-admin-panel\\src\\components\\ZoneSetup.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Line 522 
content = content.replace(
    '<MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} />',
    '<MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} variant="mini" />'
);

// 2. Line 604
content = content.replace(
    '<MapPreview type="polygon" data={points} status={isInvalid ? \'Inactive\' : \'Active\'} label={zoneName || \'New Zone\'} />',
    '<MapPreview type="polygon" data={points} status={isInvalid ? \'Inactive\' : \'Active\'} label={zoneName || \'New Zone\'} variant="mini" />'
);

// 3. Line 951
content = content.replace(
    '<MapPreview points={zone.points} status={zone.status} />',
    '<MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} variant="mini" />'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Synchronized MapPreview props successfully.');
