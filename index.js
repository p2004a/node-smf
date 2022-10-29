import seven from 'node-7z';
import fs from 'node:fs/promises';
import stream from 'stream/promises';
import util from 'node:util';
import { spawnSync } from 'child_process';

async function extract(path, dir, opts) {
  return await util.promisify((c) => {
    const s = seven.extract(path, dir, opts);
    s.on('end', () => c(null, null))
    s.on('error', (err) => c(err, null));
  })();
}

async function getMapInfo(mapPath) {
  const dir = await fs.mkdtemp('map');
  try {
    await extract(mapPath, dir, {
      $cherryPick: "mapinfo.lua",
    });
    await fs.copyFile("json.lua", `${dir}/json.lua`);
    await fs.copyFile("print.lua", `${dir}/print.lua`);
    const child = spawnSync("lua5.1", ["print.lua"], {
      cwd: dir,
      encoding: 'utf-8',
    });
    const info = JSON.parse(child.stdout);
    let springname = info.name;
    if (!springname.endsWith(info.version)) {
      springname = `${info.name} ${info.version}`
    }
    console.log(springname);
  } finally {
    await fs.rm(dir, {recursive: true});
  }
}

await getMapInfo(process.argv[2]);
