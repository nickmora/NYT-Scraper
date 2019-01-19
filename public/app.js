$.getJSON("/articles", data=>{
    console.log(data)
    data.forEach(element => {
        console.log(element)
        let title = $("<p>").attr({"data-id":element._id, "text":element.title+"<br />"+element.link});
        console.log(title);
        $("#articles").append(title)
    });
});