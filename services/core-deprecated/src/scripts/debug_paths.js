const path = require('path');
console.log("__dirname:", __dirname);
console.log("Cwd:", process.cwd());
const target = path.join(__dirname, '../config/supabase.js');
console.log("Looking for:", target);
const fs = require('fs');
console.log("Exists:", fs.existsSync(target));
if (fs.existsSync(target)) {
    try {
        require(target);
        console.log("✅ Successfully required supabase.js");
    } catch (e) {
        console.error("❌ Failed to require supabase.js:", e.message);
    }
}
process.exit(0);
