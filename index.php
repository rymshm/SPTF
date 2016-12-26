<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>SPTF</title>
        <link rel="stylesheet" href="/css/common.css">
        <link rel="stylesheet" href="//developer.spotify.com/web-api/static/css/cached.css">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome-animation/0.0.9/font-awesome-animation.css">
    </head>

    <body>
        <div class="container">
            <img src="/assets/spotify.png" alt="spotify logo">
            <form id="search-form">
              <div class="form-group">
                <input type="text" id="query" value="" class="form-control" placeholder="Type an Artist Name"/>
                <button type="submit" id="search" class="btn btn-primary" ><i class="fa fa-search" ></i>&nbsp;Search</button>
              </div>
            </form>
            <div id="results">
                <!-- resultsPlaceholder -->
            </div>
        </div>

        <div id="player">
            <!-- widgetPlaceholder -->
        </div>

        <script id="results-template" type="text/x-handlebars-template">
            {{#each albums.items}}
                <div style="background-image:url({{images.0.url}})" data-album-id="{{id}}" class="cover play" data-album-name="{{name}}"></div>
            {{/each}}
        </script>

        <script id="player-template"  type="text/x-handlebars-template">
          <div class="player-content"><i id="player-backward"  class="fa fa-backward" aria-hidden="true"></i></div>
          <div class="player-content"><i id="player-control"  class="fa fa-pause" aria-hidden="true"></i></div>
          <div class="player-content"><i id="player-forward"  class="fa fa-forward" aria-hidden="true"></i></div>
          <div class="player-content info"><span>{{songName}}</span><br/><span><i class="artist-name">{{artistName}}</i></span></div>
          <div class="player-content"><input id="volume-control" type="range" name="volume" min="0" max="1.0" step="0.1" /></div>
          <div class="player-content"><a href="{{spotifyURL}}" target="_blank"><i class="fa fa-spotify" aria-hidden="true"></i></a></div>
        </script>

        <script id="notfound-template" type="text/x-handlebars-template">
            <div class="notfound">
                <i class="fa fa-exclamation-circle"></i>
                <p>Sorry... Not Found</p>
            </div>
        </script>

        <script id="loading-template"  type="text/x-handlebars-template">
            <div class="loading">
                <i class="fa fa-spinner faa-spin animated"></i>
            </div>
        </script>


    </body>

    <script src="//code.jquery.com/jquery-1.10.1.min.js" charset="utf-8"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.1/handlebars.min.js" charset="utf-8"></script>
    <script src="/js/spotify.js" charset="utf-8"></script>
</html>
