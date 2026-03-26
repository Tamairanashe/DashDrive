import os

path = r'c:\Users\jchit\Desktop\Services\DashDrive\dashdrive-admin-panel\src\components\ZoneSetup.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 169 is index 168.
# Based on current view_file (Step 1393):
# 165:  document.exitFullscreen();
# 166:  }
# 167:  };
# 168: 
# 169:  // Map Preview Helper Component
# 170:  const [isInternalFullscreen...
# ...
# 185:  previewRef.current.requestFullscreen().catch(err => {
# 186:  console.error(`Error attempting to enable full-screen mode: ${err.message}`);

# We want to remove lines 169 through 186.
# indices in python: 0..167 (lines 1..168) - KEEP
# index 168..185 (lines 169..186) - DELETE
# index 186.. (line 187 onwards) - KEEP

new_content = lines[0:168] + ['  // Map Helper Components\n'] + lines[186:]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print("Restored ZoneSetup.tsx successfully.")
