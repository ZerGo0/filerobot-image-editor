#!/bin/bash

# Generate an indexed git file tree with truncated directories
# Directories with more than 50 direct files will show first 50 files and then truncate

git ls-tree -r --name-only HEAD | python3 -c "
import sys
from collections import defaultdict

# Read all files
files = []
for line in sys.stdin:
    files.append(line.strip())

# Count direct files in each directory (not including subdirectories)
direct_files = defaultdict(list)
for file in files:
    if '/' in file:
        dir_path = file.rsplit('/', 1)[0]
        direct_files[dir_path].append(file)
    else:
        direct_files[''].append(file)

def print_tree(prefix='', path='', level=0):
    # Get items at this level
    if path:
        path_prefix = path + '/'
        items = [f[len(path_prefix):] for f in files if f.startswith(path_prefix)]
    else:
        items = files
    
    # Separate into files and directories at this level
    level_files = []
    level_dirs = set()
    
    for item in items:
        if '/' in item:
            dir_name = item.split('/')[0]
            level_dirs.add(dir_name)
        else:
            level_files.append(item)
    
    # Sort directories and files
    sorted_dirs = sorted(level_dirs)
    sorted_files = sorted(level_files)
    
    # Print directories first
    for i, dir_name in enumerate(sorted_dirs):
        is_last_dir = (i == len(sorted_dirs) - 1) and len(sorted_files) == 0
        
        if level == 0:
            print(f'{dir_name}/')
            print_tree('  ', dir_name if not path else f'{path}/{dir_name}', level + 1)
        else:
            branch = '└── ' if is_last_dir else '├── '
            print(f'{prefix}{branch}{dir_name}/')
            
            new_prefix = prefix + ('    ' if is_last_dir else '│   ')
            print_tree(new_prefix, dir_name if not path else f'{path}/{dir_name}', level + 1)
    
    # Print files (show first 50, then truncate if needed)
    files_to_show = sorted_files[:50]
    remaining_files = len(sorted_files) - 50
    
    for i, file_name in enumerate(files_to_show):
        is_last = (i == len(files_to_show) - 1) and remaining_files <= 0
        
        if level == 0:
            print(file_name)
        else:
            branch = '└── ' if is_last else '├── '
            print(f'{prefix}{branch}{file_name}')
    
    # Show truncation message if there are more files
    if remaining_files > 0:
        if level == 0:
            print(f'... ({remaining_files} more files)')
        else:
            print(f'{prefix}└── ... ({remaining_files} more files)')

# Start printing the tree
print_tree()
"