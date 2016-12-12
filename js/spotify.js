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

songNumber = 0;

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

var play = function(callback) {
    setTimeout(function() {
      audioObject.play();
      audioObject.addEventListener('ended', callback);
    }, 350)
}

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

                songNumber = 0;

                $('#nowplaying').removeClass(playingCssClass).removeAttr('id');

                var tracks = data.tracks.items;
                target.classList.add(playingCssClass);
                $(target).attr('id', 'nowplaying');

                function recursive_play() {

                  audioObject = null;

                  // Player Info
                  widgetPlaceholder.innerHTML = widgetTemplate({
                     songName: tracks[songNumber].name,
                     artistName: tracks[songNumber].artists[0].name,
                     spotifyURL: data.external_urls.spotify,
                  });

                  // Player appear
                  widgetPlaceholder.classList.add('playing')
                  document.getElementById('player-control').addEventListener('click', function(e) {
                      songControl(e);
                  });

                  // Volume Control
                  document.getElementById('volume-control').addEventListener('input', function(e) {
                      volumeControl(this.value);
                  });

                  // Forward Event
                  document.getElementById('player-forward').addEventListener('click', function(e) {
                    audioObject.pause();
                    if (songNumber < tracks.length - 1) {
                      songNumber++;
                      recursive_play();
                    } else {
                      target.classList.remove(playingCssClass);
                      widgetPlaceholder.classList.remove('playing')
                      widgetPlaceholder.innerHTML = '';
                      songNumber = 0;
                    }
                  });

                  // Backword Event
                  document.getElementById('player-backward').addEventListener('click', function(e) {
                    if (songNumber > 0) {
                      audioObject.pause();
                      songNumber--;
                      recursive_play();
                    }
                  });


                  // Manage Queue
                  if (songNumber + 1 === tracks.length) { //queue end
                    audioObject = new Audio(tracks[songNumber].preview_url);
                    play(function() {
                      target.classList.remove(playingCssClass);
                      widgetPlaceholder.classList.remove('playing')
                      widgetPlaceholder.innerHTML = '';
                      songNumber = 0;
                    });

                  } else {
                    audioObject = new Audio(tracks[songNumber].preview_url);
                    play(function() {
                      target.classList.add(playingCssClass);
                      songNumber++;
                      recursive_play();
                    });
                  }
                }

                recursive_play();
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

var volumeControl = function(volume) {
  audioObject.volume = volume;
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
}, false);
