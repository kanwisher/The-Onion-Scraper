document.getElementById("footerYear").innerHTML = "David Kanwisher &copy " + new Date().getFullYear();

$.get("/getData").done(function(data){
        alert("hello");
        console.log(data);
    });
