AFRAME.registerComponent("add-buttons", {
    init: function(){
        var button1 = document.createElement("button");
        button1.innerHTML = "ORDER SUMMARY";
        button1.setAttribute("id", "summary-button");
        button1.setAttribute("class", "btn btn-danger ml-3 mr-3")

        var button2 = document.createElement("button");
        button2.innerHTML = "ORDER NOW";
        button2.setAttribute("id", "order-button");
        button2.setAttribute("class", "btn btn-danger ml-3");

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.appendChild(button1);
        buttonDiv.appendChild(button2)
    }
})