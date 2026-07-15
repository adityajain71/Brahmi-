const fs = require('fs');
const path = require('path');

const introPath = path.join(__dirname, '../lib/introModule.ts');
let introContent = fs.readFileSync(introPath, 'utf8');

// The best way to remove `isHindi`, `isKannada`, `isTamil` checks in introModule.ts
// We'll replace all occurences of `isHindi ? ... : isKannada ? ... : ...` with direct access.

introContent = introContent.replace(/const isHindi = .*\n/g, '');
introContent = introContent.replace(/const isKannada = .*\n/g, '');
introContent = introContent.replace(/const isTamil = .*\n/g, '');

introContent = introContent.replace(/isHindi \? ([^:]+) : isKannada \? ([^:]+) : (isTamil \? ([^:]+) : )?([^:]+)/g, (match, p1, p2, p3, p4, p5) => {
    return p5; // Just taking the fallback string for everything now? No, wait. 
    // The strings we want are actually in the JSON. But for dynamic building we need `data.swar.practice_time.sections...` etc.
});

// Since regex replacing code is hard, let's just do targeted replacements.
// Wait, I can just use `ts-node` or manually edit it.
