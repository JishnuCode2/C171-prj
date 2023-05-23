AFRAME.registerComponent("marker-handler", {
    init: async function () {

      var toys = await this.getItems();
      var id = this.el.id;
  
      this.el.addEventListener("markerFound", () => {

        console.log("marker is found")
        this.handleMarkerFound(toys, id);
      });
  
      this.el.addEventListener("markerLost", () => {
        console.log("marker is lost")
        this.handleMarkerLost();
      });
    },

    askUserId: function(){
         swal({
            title: "Welcome to Toy Shop!!",
            icon: "none",
            content: {
              element: "input",
              attributes: {
                placeholder: "Type Your Customer Id",
                type: "number",
                min: 1
              }
            },
            closeOnClickOutside: false
        }).then(inputValue =>{
          return inputValue;
        })
    },

    handleMarkerFound: function (toys, id) {
      var toy = toys.filter(toy => toy.id === id)[0];
      if(toy.is_out_of_stock){
         swal({
          icon: "warning",
          title: toy.toy_name.toUpperCase(),
          text: `The Requested Toy - ${toy.toy_name} Is Currently Unavailable`,
          timer: 2500,
          button: false
         });
      }
      else{
        var model = document.querySelector(`#model-${toy.id}`);
        model.setAttribute("visible", true);
        
        var mainPlane = document.querySelector(`#main-plane-${toy.id}`);
        mainPlane.setAttribute("visible", true);

        var pricePlane = document.querySelector(`#main-plane-${toy.id}`);
        pricePlane.setAttribute("visible", true);

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "flex";
    
        var summaryButton = document.getElementById("rating-button");
        var orderButtton = document.getElementById("order-button");
      
        summaryButton.addEventListener("click", function () {
          swal({
            icon: "warning",
            title: "Order Summary",
            text: "Work In Progress"
          });
        });
    
        orderButtton.addEventListener("click", () => {
          var uid = this.askUserId();
          if(uid){
            this.handleOrder(uid, toy);
          }
          /*swal({
            icon: "https://i.imgur.com/4NZ6uLY.jpg",
            title: "Thanks For Order!",
            text: "Your order will soon be registered"
          });*/
        });
      }
    },

    handleMarkerLost: function () {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    },

    getItems: async function(){
      return await firebase.firestore()
      .collection("toys")
      .get()
      .then(snap =>{
        return snap.docs.map(doc => doc.data());
      })
    },

    handleOrder: function(uid, toy){

        firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
          var details = doc.data();
          if (details["current_orders"][toy.id]) {
            // Increasing Current Quantity
            details["current_orders"] [toy.id]["quantity"] += 1;
            //Calculating Subtotal of item
            var currentQuantity = details["current_orders"][toy.id]["quantity"];
            details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price;
          } else {
            details["current_orders"][toy.id] = {  
              item: toy.toy_name,
              price: toy.price,
              quantity: 1,
              subtotal: toy.price*1
            };
          };
          details.total_bill = toy.price;

          // Updating Db
          firebase
          .firestore()
          .collection("users").doc(doc.id)
          .update(details);
        });
    },
  
  });
  