# <p align=center> Page-loader </p> 
### Hexlet tests and linter status:
[![Actions Status](https://github.com/ViktorFAlex/backend-project-4/workflows/hexlet-check/badge.svg)](https://github.com/ViktorFAlex/backend-project-4/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/dca3b6bfe7da0d7f91c7/maintainability)](https://codeclimate.com/github/ViktorFAlex/backend-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dca3b6bfe7da0d7f91c7/test_coverage)](https://codeclimate.com/github/ViktorFAlex/backend-project-4/test_coverage)
***
Asciinema with loading progress: [Loading-progress](https://asciinema.org/a/571588)  
Asciinema with debugging start: [Debug](https://asciinema.org/a/570874)  
Asciinema with errors example: [Error](https://asciinema.org/a/571242)
## Description of project:
Page Loader - scrapes web-page and saves all assets connected with into output folder.
#### Setup Guide: 
To install type:  
```bash
make install
npm link
```  
Usage:  
```bash  
  -V, --version   output the current version
  -h, --help      output help message
  -o  --output    choose output directory
```  

#### Launch Guide:
To start app, type in command line: "page-loader -o <folder to save> <url to scrap>".    
To get help and commands, type in command line: "page-loader -h".    
Every example of app use you can find in asciinemas above.        
## Описание проекта:
Page Loader - "скрейпит" вебстраницу и сохраняет все данные, включая связанные картинки, скрипты в указанную директорию.
#### Гайд по установке: 
Для установки наберите:  
```bash
make install
npm link
```
#### Инструкция по запуску: 
Для запуска, наберите в командной строке: "page-loader -o <директория для сохранения> <url страницы>".    
Для получения информации и доступных команды: "page-loader -h".    
Все примеры использования приложения, можно найти в аскинемах вверху.      

#### 💻 Tech Stack:  
![NodeJS](https://img.shields.io/badge/node.js-%23339933.svg?&style=flat-square&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E) ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=flat-square&logo=markdown&logoColor=white)
##### Key dependencies:
![Axios](https://img.shields.io/badge/Axios-purple?style=flat-square&logo=axios&badgeColor=FFFFFF) ![Cheerio](https://img.shields.io/badge/Cheerio.js-orange?style=flat-square&logo=cheerio.jsjs&badgeColor=FFFFFF)
