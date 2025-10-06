const fs = require('fs');
const path = 'src/components/admin/students/StudentTable.tsx';
let src = fs.readFileSync(path, 'utf8');
let orig = src;

// 1) Header controls container: add responsive widths
src = src.replace(/<div className="flex gap-2">/, '<div className=flex
