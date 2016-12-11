// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    notfound_templateSource = document.getElementById('notfound-template').innerHTML,
    notfound_template = Handlebars.compile(notfound_templateSource),
    loading_templateSource = document.getElementById('loading-template').innerHTML,
    loading_template = Handlebars.compile(loading_templateSource),
    widgetTemplate = Handlebars.compile(document.getElementById('player-template').innerHTML),
    widgetPlaceholder = document.getElementById('player'),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing-album',
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
              var result;
              if (response.albums.total > 0) {
                  result = template(response);
              } else {
                  result = notfound_template(response);
              }

            setTimeout(function() {
                resultsPlaceholder.innerHTML = result;
            }, 300);

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
                widgetPlaceholder.innerHTML = widgetTemplate({
                   songName: tracks[songNumber].name,
                   artistName: tracks[songNumber].artists[0].name,
                   spotifyURL: data.external_urls.spotify,
                });
                audioObject = new Audio(tracks[songNumber].preview_url);
                audioObject.play();
                target.classList.add(playingCssClass);

                widgetPlaceholder.classList.add('playing')
                document.getElementById('player-control').addEventListener('click', function(e) {
                    songControl(e);
                })

                audioObject.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                    widgetPlaceholder.classList.remove('playing')
                });
                audioObject.addEventListener('pause', function () {
                    // target.classList.remove(playingCssClass);
                });

            });
        }
    }
});

var songControl = function(e) {

    var btn = e.target;

    if (btn.classList.contains('fa-play')) {
        btn.classList.remove('fa-play')
        audioObject.play();
        btn.classList.add('fa-pause')
    } else if (btn.classList.contains('fa-pause')) {
        btn.classList.remove('fa-pause')
        audioObject.pause();
        btn.classList.add('fa-play')
    }

}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
}, false);
