//SDK Package

window.fbAsyncInit = function () {
    FB.init({
        appId: '225023618130869',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.0'
    });

    console.log("check")

    setTimeout(myFunction(), 3000);


};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";  //or use "https://connect.facebook.net/en_US/sdk/debug.js"
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//init
//setTimeout(function () { FB.init(); }, 2000);


/*setTimeout(function () {

    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                console.log('Good to see you, ' + response.name + '.');
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });

}, 5000);*/

//login


let myFunction = function () {
    let myAccessToken = "";
    let userId = "";



    FB.login(function(response){
        console.log(response)
        myAccessToken = response.authResponse.accessToken
        userId = response.authResponse.userID
      },
      {
        scope: 'user_friends, user_posts, groups_access_member_info, publish_to_groups',
        return_scopes: true
    });




    $("body").append($("<button>").text("Run").on("click", function(){

        $.ajax({
            url: `https://graph.facebook.com/${userId}/feed/?redirect=false&access_token=${myAccessToken}`,
            method: "GET",
        })
        .then(results => {
            console.log(results)
        })
    }))


}




