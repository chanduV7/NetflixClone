const token = localStorage.getItem("token");


window.onload = () =>{

    if(!token){
        window.location.assign("../html/signin.html")
    }
}
// --------------logout---------------------
document.getElementById("logOut").addEventListener("click",()=>{
    localStorage.clear();
    window.location.assign("../html/signin.html");
});

document.getElementById("details").addEventListener("mouseover",function(){
    const profile = document.getElementById("profile");
       if(profile.classList.contains("active")){
        profile.classList.remove("active")
       }
       else{
        profile.classList.add("active")
       }
    })
    
document.getElementById("homePage").addEventListener("click",() => {
    window.location.assign("../html/homePage.html")
})


const apiKey = "66a961ade5dfafb744e8b742092dc30c";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath ="https://image.tmdb.org/t/p/original/";
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList : (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending : `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    fetchLatest : `${apiEndpoint}/movie/top_rated?api_key=${apiKey}&language=en-US`,
    fetchNetflixOriginals : `${apiEndpoint}/discover/tv?api_key=${apiKey}&with_networks=213`,
    fetchTopRated : `${apiEndpoint}/movie/top_rated?api_key=${apiKey}&language=en-US`,  
}

function init(){
    fetchAndBuildAllSection()
}

function fetchAndBuildAllSection(){

    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(resout => {
        const categories = resout.genres;
       
        if(Array.isArray(categories) && categories.length) {
            categories.forEach(category =>{
              fetchAndBuildMovieSection(
                apiPaths.fetchMoviesList(category.id)
                )
            })
        }
    })
     .catch(err => console.log(err))
}


async function fetchAndBuildMovieSection(fetchUrl){
    // console.log(fetchUrl);
   try {
        const res = await fetch(fetchUrl);
        const res_1 = await res.json();
        console.log(res_1.results);
        const movies = res_1.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies);
        }
        return movies;
    } catch (err) {
        return console.log(err);
    }
    }

function buildMoviesSection(list){
    const movieSection = document.getElementById("movieSection");
   console.log(list)
   const moviesListHtml= list.map(item => {
        return `
              <img  class="movie-item" src="${imgPath}${item.poster_path}" alt="${item.title}" data-modal-target="#m${item.id}">
              
              `;
    }).join("");

    const div = document.createElement("div");
    div.className = "movies-item";
    div.innerHTML = moviesListHtml;
    movieSection.appendChild(div);
   
}


window.addEventListener("load",()=> {
    init()
})