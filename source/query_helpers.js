export const validate = (answers)=>{
  return answers.length > 0 ?
    true :
    'You must select at least one file or directory';
};

export const checkWhen = (answers,key,value) => answers[key]?.indexOf(value) > -1;