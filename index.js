#!/usr/bin/env node
import { queryRoots } from './source/gen_query.js';
import * as create from './source/create.js';

const initiateQuery = async ()=>{
  const selected = await queryRoots();
  await Promise.all([
    create.readme(selected),
    create.license(selected),
    create.misc(selected)
  ]);
};
initiateQuery();