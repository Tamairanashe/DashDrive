const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changed = 0;

files.forEach(f => {
    const fp = path.join(dir, f);
    let original = fs.readFileSync(fp, 'utf8');
    let content = original;

    // Check if it has activeTab and uses the array map pattern
    if (content.includes('activeTab') && content.includes('.map((tab)')) {
        // Regex to match the entire div containing the tabs map
        // It matches <div className="...">\s*{[...].map((tab) => ( ... </button>\s*))}\s*</div>
        const tabBlockRegex = /<div className="[^"]*">\s*\{\s*(\[[^\]]+\])\.map\(\(tab\)(?:[\s\S]*?)(?:<button[\s\S]*?<\/button>\s*)\)\)\}\s*<\/div>/g;

        content = content.replace(tabBlockRegex, (match, arrayStr) => {
            return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${arrayStr}.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />`;
        });

        // Some use tab.id or something else. Let's handle a second pattern where it maps over an array variable:
        // {tabs.map((tab) => ...
        const varTabBlockRegex = /<div className="[^"]*">\s*\{\s*([a-zA-Z0-9_]+)\.map\(\((?:tab|t|item)\)(?:[\s\S]*?)(?:<button[\s\S]*?<\/button>\s*)\)\)\}\s*<\/div>/g;
        content = content.replace(varTabBlockRegex, (match, varName) => {
            if (match.includes('tab.id') || match.includes('tab.name')) {
                return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${varName}.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />`;
            }
            return `<Tabs activeKey={activeTab} onChange={setActiveTab} items={${varName}.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />`;
        });

        // Ensure Tabs is imported from antd
        if (content !== original) {
            if (content.includes(`from 'antd'`)) {
                if (!content.includes('Tabs,')) {
                    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'antd';/, (match, imports) => {
                        if (!imports.includes('Tabs')) {
                            return `import { Tabs, ${imports} } from 'antd';`;
                        }
                        return match;
                    });
                }
            } else {
                content = `import { Tabs } from 'antd';\n` + content;
            }
        }
    }

    if (content !== original) {
        fs.writeFileSync(fp, content);
        changed++;
        console.log('Refactored Tabs in', f);
    }
});

console.log('Total files changed:', changed);
