import './pages.mjs';
import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

// GitHub project sites live under /repository-name/ rather than the domain root.
const repository=process.env.GITHUB_REPOSITORY?.split('/')[1];
const base=process.env.SITE_BASE_PATH ?? (repository ? `/${repository}` : '');
const prefix=base.replace(/\/$/,'');
function prepare(directory){
  for(const entry of readdirSync(directory,{withFileTypes:true})){
    const path=join(directory,entry.name);
    if(entry.isDirectory()){prepare(path);continue;}
    if(!entry.name.endsWith('.html'))continue;
    const html=readFileSync(path,'utf8').replace(/\b(href|src|poster|action)=(["'])\/(?!\/)/g,(_,attribute,quote)=>`${attribute}=${quote}${prefix}/`);
    writeFileSync(path,html);
  }
}
prepare('dist');
writeFileSync('dist/.nojekyll','');
console.log(`Prepared GitHub Pages site at ${prefix || '/'}`);
