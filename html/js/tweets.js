$(function() {

	var username = 'PacificRimGroup',  // Twitter username
		count = 10,  // How many tweets do you want to 
		list = null,

		// See http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    	url_regexp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

		$tweetsContainer = $("#tweets");

	$.getJSON("https://api.twitter.com/1/statuses/user_timeline/"+username+".json?count="+count+"&include_rts=1&include_entities=1&callback=?", function(data) {

			var $ul = $('<ul />');

			$ul.addClass('mk-stream');

			for (var i = 0; i < count; i++) {
					
				var tweet = data[i],
					$li = $('<li />'),
					$username = $('<h3 />'),
					$text = $('<p />'),
					$time = $('<div />'),

					tweet_time = parse_date(tweet.created_at),
					tweet_relative_time = format_relative_time(extract_relative_time(tweet_time)),

					entities = tweet.entities ? (tweet.entities.urls || []).concat(tweet.entities.media || []) : [],
		      		tweet_raw_text = tweet.text, // avoid '...' in long retweets
		      		tweet_text = $([linkURLs(tweet_raw_text, entities)]).linkUser().linkHash()[0],
		      		retweeted_tweet_text = $([linkURLs(tweet.text, entities)]).linkUser().linkHash()[0];

				$time.addClass('mk-stream-time icon-twitter');
        $text.addClass('mk-stream-text');

				$username.html( '<i class="icon-twitter"></i> @' + tweet.user.screen_name );
				//$text.text( tweet.text );
				$text.html( tweet_text );
				$time.text( tweet_relative_time );

				//$username.appendTo( $li );
				$time.appendTo( $li );
        $text.appendTo( $li );

				$li.appendTo( $ul );
			};
		
	    	$tweetsContainer.append( $ul );

	});

	function parse_date(date_str) {
      // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
      // cannot handle in IE. We therefore perform the following transformation:
      // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
      return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
    }

    function extract_relative_time(date) {
      var toInt = function(val) { return parseInt(val, 10); };
      var relative_to = new Date();
      var delta = toInt((relative_to.getTime() - date) / 1000);
      if (delta < 1) delta = 0;
      return {
        days:    toInt(delta / 86400),
        hours:   toInt(delta / 3600),
        minutes: toInt(delta / 60),
        seconds: toInt(delta)
      };
    }

    function format_relative_time(time_ago) {
      if ( time_ago.days > 2 )     return 'about ' + time_ago.days + ' days ago';
      if ( time_ago.hours > 24 )   return 'about a day ago';
      if ( time_ago.hours > 2 )    return 'about ' + time_ago.hours + ' hours ago';
      if ( time_ago.minutes > 45 ) return 'about an hour ago';
      if ( time_ago.minutes > 2 )  return 'about ' + time_ago.minutes + ' minutes ago';
      if ( time_ago.seconds > 1 )  return 'about ' + time_ago.seconds + ' seconds ago';
      return 'just now';
    }

    function replacer (regex, replacement) {
      return function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(regex, replacement));
        });
        return $(returning);
      };
    }

    function escapeHTML(s) {
      return s.replace(/</g,"&lt;").replace(/>/g,"^&gt;");
    }

    

    function linkURLs(text, entities) {
      return text.replace(url_regexp, function(match) {
        var url = (/^[a-z]+:/i).test(match) ? match : "http://"+match;
        var text = match;
        for(var i = 0; i < entities.length; ++i) {
          var entity = entities[i];
          if (entity.url === url && entity.expanded_url) {
            url = entity.expanded_url;
            text = entity.display_url;
            break;
          }
        }
        return "<a href=\""+escapeHTML(url)+"\">"+escapeHTML(text)+"</a>";
      });
    }

    $.fn.extend({
      linkUser: replacer(/(^|[\W])@(\w+)/gi, "$1<span class=\"at\">@</span><a href=\"http://twitter.com/$2\">$2</a>"),
      // Support various latin1 (\u00**) and arabic (\u06**) alphanumeric chars
      linkHash: replacer(/(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,
                         ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all'+
                         ((username && username.length === 1 && !list) ? '&from='+username.join("%2BOR%2B") : '')+
                         '" class="tweet_hashtag">#$1</a>'),
      makeHeart: replacer(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>")
    });

});