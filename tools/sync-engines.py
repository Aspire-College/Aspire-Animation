#!/usr/bin/env python3
"""Copy the shared engine code into every engine template.

Usage:  python3 tools/sync-engines.py [--check]

Each template marks the shared pieces it carries with
    /*@@shared:NAME@@*/ ... /*@@end:NAME@@*/
and this script replaces what sits between the markers with engines/shared/NAME.js.
Edit the shared file, run this, rebuild the reels that should get the change.
--check only reports templates that are out of date (exit code 1 if any).
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SHARED = ROOT / 'engines' / 'shared'
MARK = re.compile(r'/\*@@shared:([\w-]+)@@\*/\n(.*?)/\*@@end:\1@@\*/', re.S)

def main():
    check = '--check' in sys.argv
    stale = 0
    for tpl in sorted((ROOT / 'engines').glob('*/template.html')):
        src = tpl.read_text(encoding='utf-8')
        used = []
        def put(m):
            name = m.group(1)
            f = SHARED / f'{name}.js'
            if not f.exists():
                sys.exit(f'{tpl.relative_to(ROOT)} asks for engines/shared/{name}.js, which does not exist')
            used.append(name)
            body = f.read_text(encoding='utf-8').rstrip('\n') + '\n'
            return f'/*@@shared:{name}@@*/\n{body}/*@@end:{name}@@*/'
        out = MARK.sub(put, src)
        state = 'up to date' if out == src else ('STALE' if check else 'updated')
        if out != src:
            stale += 1
            if not check:
                tpl.write_text(out, encoding='utf-8')
        print(f'{str(tpl.relative_to(ROOT)):32s} {", ".join(used) or "(no shared code)":40s} {state}')
    if check and stale:
        sys.exit(1)

if __name__ == '__main__':
    main()
