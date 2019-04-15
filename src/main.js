import {getArticle} from './module/markdown';

getArticle(article =>{
    document.getElementById("article").innerHTML = article;
});