
$.get("/getData").done(function(data){
       
    for(let i = 0; i < data.length; i++){
        $("#maincontent").append(`
            <div class='panel panel-default col-lg-4 col-md-4 col-xs-12 text-center'>
                    <a href="${data[i].link}" target='_blank'>
                    <h3>${data[i].title}</h3>    
                    <img class="img-thumbnail img-responsive" src="${data[i].thumb}">
                </a>
                <button class="btn btn-success post-button" data-id="${data[i]._id}">Post Comment</button>
                <button class="btn btn-primary show-comment-button" data-id="${data[i]._id}">View Comments <span id="commentCount">${data[i].comments.length}</span></button>
                <div class="panel panel-default hidden commentPanel"></div>
            </div>`)
    }
});

$(".container").on('click', '.post-button', function(){
    let button = $(this);
    
    $(".panel").not(button.parent()).not(button.siblings()).animate({opacity: 0}, 500, function(){
        $(this).css("visibility", "hidden");
    });
    button.css("visibility", "hidden");
    $(this).siblings("form").remove();
    $(this).parent().append(`
        <form method="POST" action="/newcomment">
            <div class="form-group">
                
                    <input name="id" type="hidden" class="form-control" value="${button.data('id')}">        
                    <textarea placeholder="Type your comment here" maxlength="75" name="comment" class="form-control col-md-7" required></textarea>
                
            </div>
        
            <div class="form-group">
                
            <input required  maxlength="30" placeholder="Your name" name="author" class="form-control">
                
            
            </div>
            <button type="submit" class="btn btn-warning">Submit</button>
            <button type="button" class="btn btn-danger go-back-button">Go back</button>
            
        </form>`
    )
});


$(".container").on('click', '.show-comment-button', function(){
    let button = $(this);
    let commentDiv = button.siblings(".panel") 
    $.get(`/getcomments/${button.data('id')}`, function(data){
        if(!data.comments.length){
            
            commentDiv.html("<p>Be the first to comment!</p>");
            commentDiv.toggleClass("hidden");
        }else{
            commentDiv.html("");
        for(let i = 0; i < data.comments.length; i++){
            commentDiv.append("<p>" + data.comments[i].body + " -" + data.comments[i].author + "</p>");
            
        }
        commentDiv.toggleClass("hidden");
        }
    });
});

$(".container").on('click', '.go-back-button', function(){
    $(".panel").css("visibility", "visible");    
    $(".panel").animate({opacity: 1}, 500);
    $(".btn-success").css("visibility", "visible");
    $("form").remove();
});

document.getElementById("footerYear").innerHTML = "David Kanwisher &copy " + new Date().getFullYear();