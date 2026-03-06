const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = ['FleetView.tsx', 'FoodDeliveryZones.tsx', 'SupportTickets.tsx', 'ThirdPartyConfig.tsx', 'ZoneSetup.tsx'];

let changed = 0;

files.forEach(f => {
    const fp = path.join(dir, f);
    if (!fs.existsSync(fp)) return;

    let original = fs.readFileSync(fp, 'utf8');
    let content = original;

    // Match string array map with "as const"
    const tabBlockRegex1 = /<div\s+className="[^"]*">\s*\{\s*\(\s*(\[[^\]]+\])\s*as\s+const\s*\)\.map\(\(tab\)(?:[\s\S]*?)<\/button>\s*\)\)\}\s*<\/div>/g;
    content = content.replace(tabBlockRegex1, (match, arrayStr) => {
        return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${arrayStr}.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />`;
    });

    // Another generic matcher for buttons inside a div
    const genericBlockRegex = /<div\s+className="[^"]*">\s*\{\s*(\[[^\]]+\])\s*\.map\(\(tab\)(?:[\s\S]*?)<\/button>\s*\)\)\}\s*<\/div>/g;
    content = content.replace(genericBlockRegex, (match, arrayStr) => {
        return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${arrayStr}.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />`;
    });

    // Match thirdPartyConfig which has `tabs.map(tab => ...`
    const varTabBlockRegex2 = /<div\s+className="[^"]*">\s*\{\s*([a-zA-Z0-9_]+)\.map\(\((?:tab|t|item)\)(?:[\s\S]*?)<\/button>\s*\)\)\}\s*<\/div>/g;
    content = content.replace(varTabBlockRegex2, (match, varName) => {
        return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${varName}.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />`;
    });

    if (content !== original) {
        // Add Tabs to antd import if not present
        if (content.match(/import\s+\{([^}]+)\}\s+from\s+'antd'/)) {
            if (!content.includes('Tabs,')) {
                content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'antd'/, (match, imports) => {
                    if (!imports.includes('Tabs')) {
                        return `import { Tabs, ${imports} } from 'antd'`;
                    }
                    return match;
                });
            }
        } else {
            // Find last import
            const lastImportMatch = content.match(/^import.*$/gm);
            if (lastImportMatch && lastImportMatch.length > 0) {
                const lastImport = lastImportMatch[lastImportMatch.length - 1];
                content = content.replace(lastImport, `${lastImport}\nimport { Tabs } from 'antd';`);
            } else {
                content = `import { Tabs } from 'antd';\n` + content;
            }
        }
        changed++;
        fs.writeFileSync(fp, content);
        console.log('Refactored Tabs in', f);
    }
});

console.log('Total files changed:', changed);
