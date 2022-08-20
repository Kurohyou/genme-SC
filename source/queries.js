import inquirer from 'inquirer';
import * as helper from './query_helpers.js';
export const waitUserInput = true;

export const prompts = [
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
    validate:helper.validate
  },
  {
    when:(answers)=>helper.checkWhen(answers,'root','license.txt'),
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
    when:(answers)=>helper.checkWhen(answers,'root','assets'),
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
    when:(answers)=>helper.checkWhen(answers,'root','source'),
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
    when:(answers)=>helper.checkWhen(answers,'root','README.md'),
    validate:helper.validate,
    type:'checkbox',
    message:'What readme sections/badges do you want',
    name:'readme',
    choices:(answers)=>{
      return [
        new inquirer.Separator(' = Sections = '),
        {name:'About the Project',value:'about',checked:true},
        {name:'Getting Started',value:'start',checked:true},
        {name:'Usage',value:'usage',checked:true},
        {name:'Tests',value:'tests',checked:true},
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
    when:(answers)=>helper.checkWhen(answers,'root','README.md'),
    validate:(answers) => 
      /\s+/.test(answers.gitUserName) ?
        'Git user names should not have spaces in them' :
        true,
    type:'input',
    message:'The Git User Name for the repository',
    name:'gitUserName'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'root','README.md'),
    validate:(answers) => 
      /\s+/.test(answers.repositoryName) ?
        'Git repository names should not have spaces in them' :
        true,
    type:'input',
    message:'Project Repository',
    name:'repositoryName',
  },
  {
    when:(answers)=>helper.checkWhen(answers,'root','README.md'),
    type:'input',
    message:'Project Name',
    name:'projectName'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'root','README.md'),
    type:'input',
    message:'Project Logo File',
    name:'logo',
  },
  {
    when:(answers)=>helper.checkWhen(answers,'root','README.md'),
    type:'input',
    message:'Short Project Description',
    name:'projectDescription'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'readme','about'),
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
    when:(answers)=>helper.checkWhen(answers,'readme','start'),
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
    when:(answers)=>helper.checkWhen(answers,'readme','usage'),
    type:'input',
    message:'What are some example usages for the project (Leave blank for none)',
    name:'usage',
  },
  {
    when:(answers)=>helper.checkWhen(answers,'readme','tests'),
    type:'input',
    message:'What tests should be run for the project',
    name:'tests',
    default:'TODO'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'readme','roadmap'),
    type:'input',
    message:'What do you have planned for the project',
    name:'roadmap',
    default:'TODO'
  },
  {
    when:(answers)=>answers.authorName?.toLowerCase() !== 'todo' && helper.checkWhen(answers,'readme','contact'),
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
    when:(answers)=>helper.checkWhen(answers,'contact','twitter'),
    type:'input',
    message:'Author Twitter handles (comma separated list, in order author names were given)',
    name:'twitter'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'contact','twitter'),
    type:'input',
    message:'Author Emails (comma separated list, in order author names were given)',
    name:'email'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'readme','acknowledgments'),
    type:'input',
    message:'Who do you need to acknowledge?',
    name:'acknowledgments',
    default:'TODO'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'readme','patreon'),
    type:'input',
    message:'What is your Patreon account name',
    name:'patreonName'
  },
  {
    when:(answers)=>helper.checkWhen(answers,'readme','linkedin'),
    type:'input',
    message:'What is your Linkedin account name',
    name:'linkedInName'
  }
];