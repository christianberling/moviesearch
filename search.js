const APIKEY = '516b29fe'; //CB key

document.addEventListener("DOMContentLoaded", function () {
    let searchBox = document.getElementById('search');
    let resultBox = document.getElementById('resultList');
    let movieBox = document.getElementById('moviePost');

    searchBox.addEventListener("input", (event) => {
        checkSearchInput();
    });

    resultBox.addEventListener("click", (event) => {
        handleResultClick(event.target);
    });

    function checkSearchInput() {
        searchString = searchBox.value.trim().replaceAll(' ', '+') + '*';
        let outputHTML = '';
        if (searchBox.value.length < 3) {
            resultBox.innerHTML = '';
            searchBox.classList.remove('noresult');
            return;
        }
        else {
            fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${searchString}`)
                .then((response) => response.json())
                .then(result => {
                    let movies = result['Search'];
                    //console.log(`search string: http://www.omdbapi.com/?apikey=${APIKEY}&s=${searchString}`);
                    movies.forEach(movie => {
                        let { imdbID, Poster, Title, Year } = movie;
                        let imgTag = (Poster !== 'N/A') ? `<img src="${Poster}" class="searchResult__thumbnail" data-id="${imdbID}"></img>` : '';
                        outputHTML += `
                            <div class="searchResult__post" data-id="${imdbID}">
                            <div class="searchResult__poster" data-id="${imdbID}">${imgTag}</div>
                            <div class="searchResult__title" data-id="${imdbID}">${Title} (${Year})</div>
                            </div>`;
                    });
                    resultBox.innerHTML = outputHTML;
                    searchBox.classList.remove('noresult');
                }).catch(error => {
                    // emty return, nothing found, clear results and add styling
                    resultBox.innerHTML = '';
                    searchBox.classList.add('noresult');
                    console.log(error);
                });
        }
    }

    function handleResultClick(target) {
        if (target.getAttribute('data-id')) {
            movieBox.classList.remove('displaynone');
            let searchString = target.getAttribute('data-id');
            let outputHTML = '';
            console.log('target' + target);
            fetch(`http://www.omdbapi.com/?apikey=516b29fe&i=${searchString}`) //CB key 
                .then((response) => response.json())
                .then(result => {
                    let { Poster, Title, Year, Genre, Director, Actors, Plot, imdbID } = result;
                    outputHTML += `<img src="${Poster}" class="poster">
                <h1>${Title}</h1>
                <p>(${Year})</p>
                <p>Genre: ${Genre}</p>
                <p>Director: ${Director}</p>
                <p>Actors: ${Actors}</p>
                <p>${Plot}</p>
                <p><a href="https://www.imdb.com/title/${imdbID}/" target="_new">View at IMDB</a></p>`;
                })
                .then(() => { movieBox.innerHTML = outputHTML })
                .catch(alert);
        }
    }
});
