import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';


async function  getConfigFile(path:string){
    const file = await fs.readFile(path, 'utf-8')
    return JSON.parse(file.toString())
}

function generateTsConfigPathAliases(typescriptConfigPath: string) {
    const aliases = Object.entries(pathAlias).map(([key, value]) => {
      const newPathValue = value.replace(`${typescriptConfigPath}/`, '');
      return [`${key}/*`, [`${newPathValue}/*`]];
    });
  
    return Object.fromEntries(aliases);
  }
  
  async function generateTypescriptConfigFile(baseURL: string) {
    const rootPath = path.resolve(__dirname).split('/node_modules')[0];
    const tsConfigPath = path.join(rootPath, 'tsconfig.json');
  
    try {
      const typescriptConfigFile = await fs.readFile(tsConfigPath, 'utf-8');
      const parsedTypescriptconfigFile = JSON.parse(typescriptConfigFile);
  
      let typescriptConfigObject = {
        ...parsedTypescriptconfigFile,
      };
      typescriptConfigObject.compilerOptions.baseUrl = baseURL;
      typescriptConfigObject.compilerOptions.paths = generateTsConfigPathAliases(baseURL);
  
      await fs.writeFile(tsConfigPath, await prettier.format(JSON.stringify(typescriptConfigObject), { parser: 'json' }));
  
      console.log('tsconfig updated ✍️');
    } catch (error) {
      console.log(error);
    }
  }