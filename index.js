import * as fs from 'node:fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import Mustache from 'mustache';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const genericValidate = (answers)=>{
  return answers.length > 0 ?
    true :
    'You must select at least one file or directory';
};
const waitUserInput = false;

const projectTemplates = {
  charsheet:{
    presets:{
      root:['README.md','license.txt','assets','source'],
      license:'mit',
      assets:['assets/images'],
      source:['source/scss','source/pug','source/js'],
      readme:['about','start','usage','roadmap','contributing','contact','acknowledgements','patreon','linkedin'],
      gitUserName:'Kurohyou',
      patreonName:'kurohyoustudios',
      linkedInName:'Kurohyou',
      noissues:true
    }
  },
  basic:{
    presets:{
      root:['README.md','license.txt','assets','source','index.html'],
      assets:['assets/js','assets/html','assets/css','assets/images'],
      readme:['about','start','usage','roadmap','contributing','contact','acknowledgements','patreon','linkedin'],
      gitUserName:'Kurohyou',
      patreonName:'kurohyoustudios',
      linkedInName:'Kurohyou'
    }
  },
  node:{
    presets:{
      root:['index.js','README.md','license.txt','assets','source'],
      assets:['assets/images'],
      readme:['about','start','usage','roadmap','contributing','contact','acknowledgements','patreon','linkedin'],
      gitUserName:'Kurohyou',
      patreonName:'kurohyoustudios',
      linkedInName:'Kurohyou'
    }
  },
}

const checkWhen = (answers,key,value) => answers[key]?.indexOf(value) > -1;

const queryRoots = async ()=>{
  const templateResponse = await inquirer.prompt(
    {
      waitUserInput,
      type:'list',
      message:'Use a project template?',
      name:'template',
      choices:[
        {name:'Roll20 Character Sheet',value:'charsheet'},
        {name:'Basic Site',value:'basic'},
        {name:'Node Project',value:'node'},
        {name:'Custom',value:'custom'}
      ]
    }
  );
  const selectedTemplate = templateResponse.template;
  const preAnswers = {year:(new Date()).getFullYear,...templateResponse,...(projectTemplates[selectedTemplate]?.presets || {})};
  return inquirer.prompt(
    [
      {
        waitUserInput,
        type:'checkbox',
        message:'Which Project Directories/Files do you want to create',
        name:'root',
        choices:[
          new inquirer.Separator(' = Root Files = '),
          {name:'README',value:'README.md',checked:true},
          {name:'license',value:'license.txt',checked:true},
          {name:'index.html',checked:true},
          {name:'index.js',checked:true},

          new inquirer.Separator(' = Directories = '),
          {name:'assets',value:'assets',checked:true},
          {name:'source',value:'source',checked:true},
        ],
        validate:genericValidate
      },
      {
        when:(answers)=>checkWhen(answers,'root','license.txt'),
        type:'list',
        message:'Which license do you want to use',
        name:'license',
        choices:[
          {name:'Nevermind',value:''},
          {name:'Apache 2.0',value:'apache-2.0'},
          {name:'GNU General Public License 3.0',value:'gpl-3.0'},
          {name:'MIT',value:'mit'}
        ]
      },
      {
        waitUserInput,
        when:(answers)=>checkWhen(answers,'root','assets'),
        type:'checkbox',
        message:'Which asset directories do you want to create',
        name:'assets',
        choices:[
          {name:'js',value:'assets/js',checked:true},
          {name:'html',value:'assets/html',checked:true},
          {name:'css',value:'assets/css',checked:true},
          {name:'images',value:'assets/images',checked:true},
        ]
      },
      {
        waitUserInput,
        when:(answers)=>checkWhen(answers,'root','source'),
        type:'checkbox',
        message:'Which source directories do you want to create',
        name:'source',
        choices:[
          {name:'js',value:'source/js',checked:true},
          {name:'html',value:'source/html',checked:true},
          {name:'css',value:'source/css',checked:true},
          {name:'images',value:'source/images',checked:true},
        ]
      },

      // Readme options
      {
        when:(answers)=>checkWhen(answers,'root','README.md'),
        validate:genericValidate,
        type:'checkbox',
        message:'What readme sections/badges do you want',
        name:'readme',
        choices:(answers)=>{
          return [
            new inquirer.Separator(' = Sections = '),
            {name:'About the Project',value:'about',checked:true},
            {name:'Getting Started',value:'start',checked:true},
            {name:'Usage',value:'usage',checked:true},
            {name:'Roadmap',value:'roadmap',checked:true},
            {name:'Contributing',value:'contributing',checked:true},
            {name:`${!answers.license ? 'No ' : ''}License`,value:'license',disabled:true,checked:false},
            {name:'Contact',value:'contact',checked:true},
            {name:'Acknowledgments',value:'acknowledgments',checked:true},
            new inquirer.Separator(' = Badges = '),
            {name:'Patreon',value:'patreon',checked:true},
            {name:'LinkedIn',value:'linkedin',checked:true}
          ]
        }
      },
      {
        when:(answers)=>checkWhen(answers,'root','README.md'),
        validate:(answers) => 
          /\s+/.test(answers.gitUserName) ?
            'Git user names should not have spaces in them' :
            true,
        type:'input',
        message:'The Git User Name for the repository',
        name:'gitUserName',
        default:'Kurohyou'
      },
      {
        when:(answers)=>checkWhen(answers,'root','README.md'),
        validate:(answers) => 
          /\s+/.test(answers.repositoryName) ?
            'Git repository names should not have spaces in them' :
            true,
        type:'input',
        message:'Project Repository',
        name:'repositoryName',
      },
      {
        when:(answers)=>checkWhen(answers,'root','README.md'),
        type:'input',
        message:'Project Name',
        name:'projectName'
      },
      {
        when:(answers)=>checkWhen(answers,'root','README.md'),
        type:'input',
        message:'Project Logo File',
        name:'logo',
      },
      {
        when:(answers)=>checkWhen(answers,'root','README.md'),
        type:'input',
        message:'Short Project Description',
        name:'projectDescription'
      },
      {
        when:(answers)=>checkWhen(answers,'readme','about'),
        type:'input',
        message:'About the Project',
        name:'aboutBlurb',
        default:'TODO'
      },
      {
        when:(answers)=>!!answers.aboutBlurb,
        type:'input',
        message:'Comma separated list of technologies used',
        name:'builtList',
        default:'TODO'
      },
      {
        when:(answers)=>checkWhen(answers,'readme','start'),
        type:'input',
        message:'How can users get started',
        name:'startBlurb',
        default:'TODO'
      },
      {
        when:(answers)=>!!answers.startBlurb,
        type:'input',
        message:'Are there any prerequisites (Leave blank for none)',
        name:'prerequisites'
      },
      {
        when:(answers)=>!!answers.startBlurb,
        type:'input',
        message:'How do users install the project (Leave blank for none)',
        name:'installation',
      },
      {
        when:(answers)=>checkWhen(answers,'readme','usage'),
        type:'input',
        message:'What are some example usages for the project (Leave blank for none)',
        name:'usage',
      },
      {
        when:(answers)=>checkWhen(answers,'readme','roadmap'),
        type:'input',
        message:'What do you have planned for the project',
        name:'roadmap',
        default:'TODO'
      },
      {
        when:(answers)=>checkWhen(answers,'readme','contact'),
        type:'checkbox',
        message:'How should users contact you',
        name:'contact',
        choices:[
          {name:'Twitter',value:'twitter',checked:true},
          {name:'Email',vlaue:'email',checked:true}
        ]
      },
      {
        when:(answers)=>answers.license || answers.contact,
        type:'input',
        message:'Comma separated list of the author(s)',
        name:'authorName',
      },
      {
        when:(answers)=>checkWhen(answers,'contact','twitter'),
        type:'input',
        message:'Author Twitter handles (comma separated list, in order author names were given)',
        name:'twitter'
      },
      {
        when:(answers)=>checkWhen(answers,'contact','twitter'),
        type:'input',
        message:'Author Emails (comma separated list, in order author names were given)',
        name:'email'
      },
      {
        when:(answers)=>checkWhen(answers,'readme','acknowledgments'),
        type:'input',
        message:'Who do you need to acknowledge?',
        name:'acknowledgments',
        default:'TODO'
      },
      {
        when:(answers)=>checkWhen(answers,'readme','patreon'),
        type:'input',
        message:'What is your Patreon account name',
        name:'patreonName',
        default:'kurohyoustudios'
      },
      {
        when:(answers)=>checkWhen(answers,'readme','linkedin'),
        type:'input',
        message:'What is your Linkedin account name',
        name:'linkedInName',
        default:'Kurohyou'
      }
    ]
  ,preAnswers);
};

const createDir = (pathString) => fs.mkdir(path.resolve(__dirname,pathString),{recursive:true});

const createFile = (pathString) => fs.open(path.resolve(__dirname,pathString),'w+');

const createItem = async (name) => {
  const action = name.startsWith('/') ?
    createDir :
    createFile;
  const handle = await action(name);
  return pathPrompts(name);
};

const createReadme = async (data) => {
  if(!data.readme) return;
  const keys = {...data};
  data.readme.forEach(key => keys[key] = keys[key] || true);
  const readme = await createFile('README.md');
  let template = await fs.readFile(path.resolve(__dirname,'templates/readme.template'),{encoding:'utf8'});
  if(keys.builtList){
    keys.builtList = keys.builtList
      .split(/\s*,\s*/)
      .map(item => `- ${item}`)
      .join('\n');
  }
  if(keys.contact && keys.authorName){
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
  const content = Mustache.render(template,keys);
  await readme.writeFile(content);
  readme.close();
};

const createLicense = async (data) => {
  if(!data.license) return;
  const templateConversions = {
    'yyyy':'year',
    'fullname':'authorName',
    'name of copyright owner':'authorName'
  }
  const license = await createFile('LICENSE.txt');
  const template = await fetch(`https://gitlab.com/api/v4/templates/licenses/${data.license}?project=My+Cool+Project`)
    .then(response => response.json())
    .then(response => response.content.replace(/\[(.+?)\]/g,(match,key)=>`{{${templateConversions[key]||key}}}`));
  const content = Mustache.render(template,data);
  license.writeFile(content);
  license.close();
};

const createSubs = async (data) => {
  const paths = data.root.filter(p => !/\..+$/.test(p));
  for await (const thisPath of paths){
    const dirHandle = await createDir(thisPath);
    paths.push(...(data[thisPath]||[]));
  }
};

const initiateQuery = async ()=>{
  const selected = await queryRoots();
  await Promise.all([
    createReadme(selected),
    createLicense(selected),
    createSubs(selected)
  ]);
};
initiateQuery();