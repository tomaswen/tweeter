/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Prevents XSS using escape method
const escape = str => {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//Creates a markup for a single element
const createTweetElement = tweetObject => {
  const date = new Date(tweetObject["created_at"]).toISOString();
  const markup = `
    <article class="tweet">
      <header>
        <img
          alt="Profile Avatar"
          class="tweet-avatar"
          src="${tweetObject.user.avatars}"
        />
        <label class="tweet-username"> ${tweetObject.user.name} </label>
        <label class="tweet-handle">${tweetObject.user.handle}</label>
      </header>
      <p class = "tweet-content"> ${escape(tweetObject.content.text)}</p>
      <footer>
        <time class="days-ago" datetime ="${date}">${date}</time>
        <label class="tweet-icons">🏳️ 🔁 🤍</label>
      </footer>
    </article>
  `;

  return markup;
};

//render the markup array of each element markup created through createTweetElement
const renderTweets = tweets => {
  const markupArr = [];

  for (const tweetObject of tweets) {
    const tweetElement = createTweetElement(tweetObject);
    markupArr.push(tweetElement);
  }
  markupArr.reverse();
  $("#tweets-container").html(markupArr.join(" "));
  $("time.days-ago").timeago(); //<--- CHANGES THE TIME STAMPS USING TIMEAGO()
};

//Ready the document
$(() => {
  // LOAD TWEET FUNCTION
  const loadTweets = () => {
    $.get("/tweets", data => {
      renderTweets(data);
    });
  };

  loadTweets(); //<----- load tweets at the beginniNG

  //AJAX POST ON FORM SUBMIT AND ERROR HANDLING
  $("form").submit(event => {
    event.preventDefault();
    $tweetText = $("#tweet-text");
    $error = $("#error-message");
    $error.slideUp("fast");
    if (!$tweetText.val()) {
      $error.text("❕❕❕ Your tweet is empty, please try again");
      $error.slideDown("slow");
      $error.css("display", "block");
    } else if ($tweetText.val().length > 140) {
      $error.text("❕❕❕ Your tweet exceeded the limit, please try again");
      $error.slideDown("slow");
      $error.css("display", "block");
    } else {
      const serializedTweet = $tweetText.serialize();
      $.post("/tweets/", serializedTweet, () => {
        //WHEN A POST IS MADE IT WILL EMPTY THE TEXT BOX, RESET COUNTER, LOAD TWEETS AGAIN, AND UPDATES THE TIMESTAMPS
        $("#tweet-text").val("");
        $(".counter").html("140");
        loadTweets();
        $("time.days-ago").timeago("update", new Date()); //<---- UPDATES THE POSTS TIME STAMP WHENEVER A POST IS SUBMITTED
      });
    }
  });
  // NAVIGATION BAR'S COMPOSE TWEET BUTTON EVENT LISTENER
  $button = $("nav").children("button");
  $button.click(() => {
    $(".new-tweet").slideToggle("slow");
    $("#tweet-text").focus();
  });
});
