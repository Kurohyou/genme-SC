import gitParse from 'parse-git-config';
import inquirer from 'inquirer';
import { prompts, waitUserInput } from './queries.js';
import projectTemplates from './project_templates.json' assert {type:'json'};

export const queryRoots = async ()=>{
  const repoInfo = await gitParse();
  const templateChoices = Object.keys(projectTemplates)
    .map(t =>{ return {name:t}});
  const templateResponse = await inquirer.prompt(
    {
      waitUserInput,
      type:'list',
      message:'Use a project template?',
      name:'template',
      choices:[...templateChoices,{name:'Custom',value:'custom'}]
    }
  );
  const selectedTemplate = templateResponse.template;
  const preAnswers = {year:(new Date()).getFullYear,...templateResponse,...(projectTemplates[selectedTemplate]?.presets || {})};
  if(repoInfo && repoInfo['remote "origin"']){
    [,preAnswers.gitUserName,preAnswers.repositoryName] = repoInfo['remote "origin"'].url
      .match(/([^\/]+)\/([^\/]+)\.git/) ||
      [];
  }
  return inquirer.prompt(prompts, preAnswers);
};