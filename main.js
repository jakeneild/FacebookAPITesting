//SDK Package

myDashBoard = {}

let showDashBoard = function(){
    let todaysDate = Date.now();

    $("resultsDiv").html("");
    for(item in myDashBoard){
        $("resultsDiv").append(
                $("<article>").attr("id", `dashboardArticle${item}`).append(
                    $("<p>").text(`Author: ${myDashBoard[item].author}`),
                    $("<p>").text(`Description: ${myDashBoard[item].description}`),
                    $("<p>").text(`Pubdate: ${myDashBoard[item].publishedAt}`),
                    $("<p>").text(`Source: ${myDashBoard[item].source.name}`),
                    $("<p>").text(`URL: ${myDashBoard[item].url}`),
                    $("<img>").attr("src", `${myDashBoard[item].urlToImage}`),
                    $("<button>").attr("name", item).attr("id", `dashboardPost${item}`).text("Post now").on("click", function(){
                        //post to group now
                        //remove item from dashboard
                        saveDashBoard();
                        showDashBoard();

                    }),
                    $("<input>").attr("type", "text").attr("id", `scheduleInput${item}`).attr("placeholder", "Days out to schedule"),
                    $("<button>").attr("name", item).attr("id", `dashboardSchedule${item}`).text("Schedule post later").on("click", function(){
                        myDashBoard[e.target.name].schedule = todaysDate + (($(`scheduleInput${e.target.name}`).val()) * 86400000)
                        saveDashBoard();
                        showDashBoard();
                    })

            )
        )
        if(myDashBoard[item].schedule !== undefined){
            $("resultsDiv:last-child").append($("<p>").text(`Current scheduled time is ${myDashBoard[item].schedule}`))
        }
    }
}

let loadLocal = function(){
    if(localStorage.getItem('myDashBoard') !== null){
        myDashBoard = JSON.parse(localStorage.getItem('myDashBoard'));
    }
}

let saveDashBoard = function(){
    localStorage.setItem('myDashBoard', JSON.stringify(myDashBoard));
}

let addToDashboard = function(newItem){
    let largestId = -1
    for(item in myDashBoard){
        if(myDashBoard[item].id > largestId){
            largestId = myDashBoard[item].id
        }
    }
    largestId++;

    myDashBoard[largestId] = newItem

    saveDashBoard();
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '225023618130869',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.0'
    });

    console.log("check")

    loadLocal();
    newsFunction();
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

let newsFunction = function(){
    newObj = {};

    let newsApiKey = "1b6bb48e27d347cebbc57acd57f7bb3d";

    $("#utilDiv").append(
        $("<br>"),
        $("<input>").attr("type", "text").attr("id", "searchField").attr("placeholder", "Search Key words"),
        $("<button>").attr("type", "button").text("Search").attr("id", "searchButton").on("click", function(){
            $("#resultsDiv").html("")
            newsObj = {};

            let query = $("#searchField").val();
            query = query.split(" ").join("-")


            $.ajax({
                url: `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${newsApiKey}`,
                method: "GET",
            }).then(results => {
                console.log("search results: ", results)
                newsObj=results;
                for(let i = 0; i < results.articles.length; i++){
                    let myBool = false
                    for(item in myDashBoard){
                        console.log(myDashBoard[item])
                        if(myDashBoard[item].url === results.article[i].url){
                            console.log("check")
                            myBool = true;
                        }
                    }
                    if(myBool === false){
                        $("#resultsDiv").append(
                            $("<article>").attr("id", `article${i}`).append(
                                $("<p>").text(`Author: ${results.articles[i].author}`),
                                $("<p>").text(`Description: ${results.articles[i].description}`),
                                $("<p>").text(`Pubdate: ${results.articles[i].publishedAt}`),
                                $("<p>").text(`Source: ${results.articles[i].source.name}`),
                                $("<p>").text(`URL: ${results.articles[i].url}`),
                                $("<img>").attr("src", `${results.articles[i].urlToImage}`),
                                $("<button>").attr("id", i).text("Add to collection").on("click", function(){
                                    addToDashboard(newsObj.articles[event.target.id]),
                                    $(`#article${event.target.id}`).remove();
                                })

                            )
                        )
                    }



                }
            })
        }),
        $("<br>"),
        $("<br>")
    )
}
let myFunction = function () {
    let myAccessToken = "";
    let userId = "";
    let cubsGroupId = 766394103749626;



    FB.login(function (response) {
        console.log(response)
        myAccessToken = response.authResponse.accessToken
        userId = response.authResponse.userID
    },
        {
            scope: 'user_friends, user_posts, groups_access_member_info, publish_to_groups',
            return_scopes: true
        });




    $("#utilDiv").append($("<button>").text("Run").on("click", function () {

        //gets popular articles and lets user post them



        // $.ajax({
        //     url: `https://graph.facebook.com/${userId}/?redirect=false&access_token=${myAccessToken}`,
        //     method: "GET",
        // })


        // let contentObj = {}
        // let getPosts = function (results) {
        //     console.log(results)
        //     for (let i = 0; i < results[0].data.length; i++) {
        //         $.ajax({
        //             url: `https://graph.facebook.com/${results[0].data[i].id}/?redirect=false&access_token=${myAccessToken}`,
        //             method: "GET",
        //         })
        //             .then(myPost => {
        //                 console.log(myPost)
        //                 contentObj[myPost[id]] = {};
        //                 for (item in myPost) {
        //                     contentObj[myPost[id]][item] = myPost[item]
        //                 }
        //             })

        //     }
        // }


        // let getPostIds = function (pageId) {
        //     return $.ajax({
        //         url: `https://graph.facebook.com/${pageId}/feed/?redirect=false&access_token=${myAccessToken}`,
        //         method: "GET",
        //     })
        // }



        // Promise.all([getPostIds(cubsGroupId)]).then(results => {
        //     console.log("check")
        //     getPosts(results)
        // }).then(results => {

        //     console.log(contentObj)
        // })
    })
    )
}
