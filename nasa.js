const count = 10;
const api_key = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=eYyTSRnpUt5BKq7KmjFV7igOp6uyR5YoimDewGIN
&count=${count}`;
const imageContainer = document.getElementById('images-container');
const favBtn = document.getElementById('favourites');
const loadMorebtn = document.getElementById('loadMorebtn');
const dot = document.getElementById('dot'); //dark dot between favorites and load more
const added = document.querySelector('.save-confirmed');    // used for removed as  well

let favourites = {};
let results = [];

function removeFromFavourites(itemUrl) {
    added.textContent = "Removed!";
    added.hidden = false;
    setTimeout(() => {
        added.hidden = true;
    }, 1000);

    if (favourites[itemUrl]) {
        delete favourites[itemUrl];

        localStorage.setItem('NASA_data', JSON.stringify(favourites));
        //imageContainer.textContent = '';
        favouritesData();
    }
}

function addToFavourites(itemUrl) {
    
    results.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;         //favourites is an object declared globally
            localStorage.setItem('NASA_data', JSON.stringify(favourites));
            added.textContent = "Added!";
            added.hidden = false;
            setTimeout(() => {
                added.hidden = true;
            }, 1000);
        }
        
    });

}

function getData(page)             // not necessary, can be embedded in displayFetchedData() only
{
    // currentArray = page === 'results' ? results : Object.values(favourites);
    // console.log("page is = ",page);
    // console.log('currentArray',currentArray);
    // console.log('currentArrayLength',currentArray.length);
    for (i = 0; i < page.length; i++) {

        // console.log(results[i]);
        const card = document.createElement('div');
        const imageLink = document.createElement('a');
        const image = document.createElement('img');
        const cardBody = document.createElement('div');
        const heading = document.createElement('h5');
        const saveFavorite = document.createElement('p');
        const desc = document.createElement('p');
        const date = document.createElement('small');


        //Assigning class list and attributes to newly created elements
        card.className = "card";
        // imageLink.setAttribute('href',page[i].url);
        // imageLink.setAttribute('title',"View Full Image");
        // imageLink.setAttribute('target',"_blank");
        imageLink.href = page[i].hdurl;
        imageLink.title = 'View Full Image';
        imageLink.target = '_blank';

        image.setAttribute('loading', 'lazy');
        image.classList.add('card-img-top');
        image.src = (page[i].url);
        cardBody.classList.add('card-body');
        heading.classList.add('card-title');
        saveFavorite.classList.add('clickable');
        if (page === results) {
            saveFavorite.textContent = "Add to Favourite";
            saveFavorite.setAttribute('onclick', `addToFavourites('${page[i].url}')`);
        }
        else {
            saveFavorite.textContent = "Remove from favourites";
            saveFavorite.setAttribute('onclick', `removeFromFavourites('${page[i].url}')`);
        }
        date.classList.add('text-muted');

        //Assigning data obtained from results[] to newly created elements
        heading.textContent = page[i].title;

        desc.textContent = page[i].explanation;
        date.textContent = page[i].date;


        //Appending new elements in an organized way
        imageLink.appendChild(image);

        cardBody.appendChild(heading);
        cardBody.appendChild(saveFavorite);
        cardBody.appendChild(desc);
        cardBody.appendChild(date);

        card.appendChild(imageLink);
        card.appendChild(cardBody);

        imageContainer.appendChild(card);
    }

}

function favouritesData() {
    dot.hidden = true;
    favBtn.textContent = "";
    loadMorebtn.textContent = "Home";
    if (localStorage.getItem('NASA_data')) {
        favourites = JSON.parse(localStorage.getItem('NASA_data'));     //favourites object
        // console.log("favourites "+ favourites);
        favouriteArray = Object.values(JSON.parse(localStorage.getItem('NASA_data')));
        imageContainer.textContent = '';
        getData(favouriteArray);
    }

}

async function fetchData() {
    dot.hidden = false;
    favBtn.textContent = "Favorites";
    loadMorebtn.textContent = "Load More";

    try {
        const response = await fetch(apiUrl);
        results = await response.json();
        imageContainer.textContent = '';

        getData(results);
        // console.log(results);
    }
    catch (e) {
        alert("Not working");
    }
    // loadMorebtn.addEventListener('click',()=> fetchData());
    favBtn.addEventListener('click', () => favouritesData());

}

//on load
fetchData();
