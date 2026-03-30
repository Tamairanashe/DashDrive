const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changed = 0;

files.forEach(f => {
    const fp = path.join(dir, f);
    let original = fs.readFileSync(fp, 'utf8');
    let content = original;

    if (content.includes('activeTab') && (content.includes('.map((tab)') || content.includes('.map(tab'))) {

        // Match string array map
        const tabBlockRegex1 = /<div\s+className="[^"]*">\s*\{\s*(\[[^\]]+\])\.map\(\(tab\)(?:[\s\S]*?)<\/button>\s*\)\)\}\s*<\/div>/g;
        content = content.replace(tabBlockRegex1, (match, arrayStr) => {
            return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${arrayStr}.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />`;
        });

        // Match variable map
        const tabBlockRegex2 = /<div\s+className="[^"]*">\s*\{\s*([a-zA-Z0-9_]+)\.map\(\((?:tab|t|item)\)(?:[\s\S]*?)<\/button>\s*\)\)\}\s*<\/div>/g;
        content = content.replace(tabBlockRegex2, (match, varName) => {
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
    }
});

console.log('Total files changed:', changed);
