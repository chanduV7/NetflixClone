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

window.onload = () =>{
    const token = localStorage.getItem("token");
    if(!token){
        window.location.assign("../html/signin.html")
    }
}
// --------------logout---------------------
document.getElementById("logOut").addEventListener("click",()=>{
    localStorage.clear();
    window.location.assign("../html/signin.html");
});

function init() {
    fetchAndBuildAllSections();
   fetchTrendingMovies()
   fetchTopRatedMovies()
}

function fetchTrendingMovies(){
  fetchAndBuildMovieSection(apiPaths.fetchTrending,'Trending Now')
  .then(list => {
    const randomIndex = Math.floor(Math.random()*list.length);
    // console.log(randomIndex)
    buildBannerSection(list[randomIndex]);
  }).catch(err =>  console.error(err))
}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById("banner-section");
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement("div");
    div.setAttribute("class","banner-content")
    div.innerHTML= ` 
                        <h4 class="banner_title">${movie.title}</h4>
                        <p class="banner_info">Trending in Movies | Released : ${movie.release_date}</p>
                        <p class="banner_overview">${movie.overview && movie.overview.length >200 ? movie.overview.slice(0,200).trim()+"..." : movie.overview}</p>
                       <div class="action-buttons-cont">
                          <button class="action-button"><ion-icon class="playbtn" name="play"></ion-icon> <span style="margin-top: 3px;">Play</span></button>
                            <button class="action-button"><ion-icon style="color:white" class="info-icon" name="information-circle-outline"></ion-icon><span style="margin-top: 3px; ">More Info</span></button>
                       </div>
                    `;
    bannerCont.append(div);
}
function fetchTopRatedMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTopRated,"Top Rated")
    fetchAndBuildMovieSection(apiPaths.fetchNetflixOriginals,"Netflix Originals") 
}


function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        const categories = res.genres;
        console.log(categories)
        if(Array.isArray(categories) && categories.length){
          categories.forEach(category =>                    //slice
            fetchAndBuildMovieSection(
                 apiPaths.fetchMoviesList(category.id),
                 category.name
            ));
        }
    }
    )
    .catch(err => console.log(err));
}

async function fetchAndBuildMovieSection(fetchUrl,categoryName){
    // console.log(fetchUrl);
   try {
        const res = await fetch(fetchUrl);
        const res_1 = await res.json();
        // console.log(res_1.results);
        const movies = res_1.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies, categoryName);
        }
        return movies;
    } catch (err) {
        return console.log(err);
    }
    }

function buildMoviesSection(list, categoryName){
    // console.log(list,categoryName);
    
    const moviesCont = document.getElementById("movies-cont");
    const modal_Ids = list.map(item => {
        return ` <div class="modal" id="m${item.id}">
                   <div class="modal-header" style="background-image:url('${imgPath}${item.backdrop_path}');">
                     <button data-close-button class="close-button">&times;</button>  
                     <div class="title" style="color:white; font-family: Garamond, serif; font-size:3.9rem;">${item.title}</div>
                   </div>
                  <div class="modal-body">
                      <div class="modal-overview">
                             <h3 style="color:red;">Description :</h3>
                             <h4 style="font-family:arial;">${item.overview}</h4>
                      </div>
                  <div>
                  <div class="modal-genres"><h4 style="color:red;">Genres :</h4> ${item.genre_ids} </div>
                  <div class="modal-date"> <h4 style="color:red;">Released Date :</h4> ${item.release_date} </div>
                  <div> <h4 style="color:red;">Ratings:</h4> <span style="background-color:yellow;color:red;" > &#9733;${item.vote_average}</span> </div>
                </div>
                </div>
               </div>
               
                `;
        }
        ).join("");

    // console.log(modal_Ids)
   const moviesListHtml= list.map(item => {
        return  `
              <img  class="movie-item" src="${imgPath}${item.poster_path}" alt="${item.title}" data-modal-target="#m${item.id}">
              `;
    }).join("");
    // console.log(moviesListHtml)
    const moviesSectionHTML = `
                           <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge">Explore all</span></h2>
                           <div class="movies-row">
                              <div class="container">
                                   <button class="handle left-handle">
                                     <div class="text"> &#8249; </div>
                                   </button>
                                   <div class="slider">
                                     ${moviesListHtml}  
                                  </div>
                                  <button class="handle right-handle">
                                     <div class="text"> &#8250; </div>
                                  </button>
                               </div>
                           </div>
                               `;
  
    const div = document.createElement("div");
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;
    const div1 = document.createElement("div");
    div1.innerHTML = modal_Ids;
    moviesCont.append(div,div1);

    const openModalButtons = document.querySelectorAll("[data-modal-target]");
    const closeModalButtons = document.querySelectorAll("[data-close-button]");
    const overlay = document.getElementById("overlay");  
    openModalButtons.forEach(button => {
        button.addEventListener('click',() => {
            const modal = document.querySelector(button.dataset.modalTarget);
            // console.log(modal)
            openModal(modal)
        })
    })
    
    overlay.addEventListener("click", ()=> {
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach(modal => {
            closeModal(modal)
        })
    })
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click',() => {
         const modal = button.closest(".modal");
            closeModal(modal)
        })
    })
    
    function openModal(modal) {
        if(modal == null) {return}
        else{
            modal.classList.add("active")
            overlay.classList.add("active")
        }
      
    }
    
    function closeModal(modal) {
        if(modal == null) return
        modal.classList.remove("active")
        overlay.classList.remove("active")
    }
}

window.addEventListener("load",function() {
    init();
    window.addEventListener('scroll', function(){
        //header ui update
        const header = document.getElementById('header');
        if(this.window.scrollY >5) header.classList.add('black-bg')
        else header.classList.remove('black-bg')
    })
})

// -----------------carousel----------------------------
document.addEventListener("click",e => {
    let handle;
    if(e.target.matches(".handle"))  {
        handle = e.target;
    }else{
        handle = e.target.closest(".handle")
    }
    if(handle != null) onHandleClick(handle)
})

function onHandleClick(handle) {
    const slider = handle.closest(".container").querySelector(".slider")
    // console.log(slider)
    const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--slider-index")
        )
        // console.log(sliderIndex)
    const itemCount = slider.children.length;
    const itemsPerScreen =  parseInt(
        getComputedStyle(slider).getPropertyValue("--items-per-screen")
    )
    // console.log(itemCount)
    // console.log(itemsPerScreen)
    if(handle.classList.contains("left-handle")){
        if(sliderIndex >0){
            slider.style.setProperty("--slider-index", sliderIndex - 1)
        }
        else{
            slider.style.setProperty("--slider-index", (itemCount/itemsPerScreen)-1)
        }
       
    }

    if(handle.classList.contains("right-handle")){
        if(sliderIndex >= (itemCount/itemsPerScreen)-1){
            slider.style.setProperty("--slider-index",0)
        }else{
            slider.style.setProperty("--slider-index",sliderIndex+1)
        }
    }
    // console.log(slider)
}
// =======================Profile account=======================
document.getElementById("details").addEventListener("mouseover",function(){
const profile = document.getElementById("profile");
   if(profile.classList.contains("active")){
    profile.classList.remove("active")
   }
   else{
    profile.classList.add("active")
   }
})
const movieBtn = document.getElementById("movieBtn");
movieBtn.addEventListener("click",() => {
    window.location.assign("../html/moviePage.html")
})


