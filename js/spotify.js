// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    notfound_templateSource = document.getElementById('notfound-template').innerHTML,
    notfound_template = Handlebars.compile(notfound_templateSource),
    loading_templateSource = document.getElementById('loading-template').innerHTML,
    loading_template = Handlebars.compile(loading_templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            callback(response);
        }
    });
};

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album',
            limit: 30,
        },
        beforeSend: function() {
            resultsPlaceholder.innerHTML = loading_template(query);
        },
        success: function (response) {
            setTimeout(function() {
                if (response.albums.total > 0) {
                    resultsPlaceholder.innerHTML = template(response);
                } else {
                    resultsPlaceholder.innerHTML = notfound_template(response);
                }
            }, 1250);
        }
    });
};

results.addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('play')) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('data-album-id'), function (data) {
                var tracks = data.tracks.items;
                var songNumber = Math.floor(Math.random() * (tracks.length)); // Shuffle Play
                audioObject = new Audio(tracks[songNumber].preview_url);
                audioObject.play();
                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function () {
                    target.classList.remove(playingCssClass);
                });
            });
        }
    }
});

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
}, false);
