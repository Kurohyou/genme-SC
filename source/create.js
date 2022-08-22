import * as fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Mustache from 'mustache';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDir = (pathString) => fs.mkdir(path.resolve(pathString),{recursive:true});

const createFile = (pathString) => fs.open(path.resolve(pathString),'w+');

export const readme = async (data) => {
  // debugger;
  if(!data.readme) return;
  console.log('data',data);
  const keys = {...data};
  data.readme.forEach(key => keys[key] = keys[key] || true);
  const readmeFileHandle = await createFile('README.md');
  let template = await fs.readFile(path.resolve(__dirname,'./templates/readme.md'),{encoding:'utf8'});
  if(keys.builtList){
    keys.builtList = keys.builtList
      .split(/\s*,\s*/)
      .map(item => `- ${item}`)
      .join('\n');
  }
  if(keys.contact){
    keys.contact = true;
    if(keys.authorName){
      const nameArray = keys.authorName.split(',');
      const twitArray = keys.twitter?.split(',') || [];
      const emailArray = keys.email?.split(',') || [];
      const authors = nameArray.map((name,i)=>{
        return {
          name,
          twitter:twitArray[i] || undefined,
          email:emailArray[i] || undefined
        }
      });
      keys.authors = authors;
    }
  }
  const content = Mustache.render(template,keys);
  await readmeFileHandle.writeFile(content);
  readmeFileHandle.close();
};

export const license = async (data) => {
  if(!data.license) return;
  const templateConversions = {
    'yyyy':'year',
    'fullname':'authorName',
    'name of copyright owner':'authorName'
  }
  const licenseFileHandle = await createFile('LICENSE.txt');
  // Idea to use axios and the gitlab license api from Jerrod
  const template = await axios(`https://gitlab.com/api/v4/templates/licenses/${data.license}`)
    .then(response => response.data.content.replace(/\[([^\]]+)\]/g,(match,key)=>`{{${templateConversions[key]||key}}}`));
  const content = Mustache.render(template,data);
  licenseFileHandle.writeFile(content);
  licenseFileHandle.close();
};

export const misc = async (data) => {
  const paths = data.root.filter(p => !/\..+$/.test(p));
  for await (const thisPath of paths){
    const dirHandle = await createDir(thisPath);
    paths.push(...(data[thisPath]||[]));
  }
  const fileNames = data.root.filter(p => /\..+$/.test(p))
  for await (const thisName of fileNames){
    const fileHandle = await createFile(thisName);
    fileHandle.close();
  }
};