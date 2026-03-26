import os

path = r'c:\Users\jchit\Desktop\Services\DashDrive\dashdrive-admin-panel\src\components\ZoneSetup.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 522 (0-indexed 521)
# Line 604 (0-indexed 603)
# Line 951 (0-indexed 950)

# 521: <MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} />
lines[521] = lines[521].replace('<MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} />', 
                                '<MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} variant="mini" />')

# 603: <MapPreview type="polygon" data={points} status={isInvalid ? 'Inactive' : 'Active'} label={zoneName || 'New Zone'} />
lines[603] = lines[603].replace('<MapPreview type="polygon" data={points} status={isInvalid ? 'Inactive' : 'Active'} label={zoneName || 'New Zone'} />',
                                '<MapPreview type="polygon" data={points} status={isInvalid ? 'Inactive' : 'Active'} label={zoneName || 'New Zone'} variant="mini" />')

# 950: <MapPreview points={zone.points} status={zone.status} />
lines[950] = lines[950].replace('<MapPreview points={zone.points} status={zone.status} />',
                                '<MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} variant="mini" />')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Synchronized MapPreview props in ZoneSetup.tsx successfully.")
