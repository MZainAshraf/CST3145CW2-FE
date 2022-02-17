let app = new Vue({
    el: "#app",
    data: {
        lessons: [],
        cart: [],
        order: {
            name: "",
            number: "",
            content: [],
        },
        displayLessons: true,
    },
    created: function () {
        fetch("https://cst3145cw2-be.herokuapp.com/collection/lessons").then(function (response) {
            response.json().then(function (json) {
                app.lessons = json;
                console.log("Now Displaying Lessons");
            });
        });
    },
     methods: {

        canAddToCart(lesson) {
            return lesson.spaces > this.cartCount(lesson.id);
        },

      addToCart(lesson) {
          console.log(lesson.title + " was just added to cart");
          this.cart.push(lesson);
          lesson.spaces -= 1;
      },
        
    
        removeItem(lesson, index) {
            this.cart.splice(index, 1);
            lesson.spaces += 1;
            console.log(lesson.title + " was removed from cart");
        },
        showCheckout() {
            this.displayLessons = !this.displayLessons;
        },
        
        cartCount(id) {
            let count = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    count++;
                }
            }
            return count;
        },
        
    
        checkout(){
             
          this.order.content.push(this.cart);
          console.log("proceeding for checkout");
          fetch('https://cst3145cw2-be.herokuapp.com/collection/orders',
          {
            method: 'POST', //Post request new order entry
          headers: {'Content-Type': 'application/json',
       
        },
        body: JSON.stringify(this.order)
       
          })
    
          for (var i = 0; i < this.cart.length; i++) {
             idheader = this.lessons[i]._id;
       
        N_Space = { spaces: this.lessons[i].spaces };
        console.log(N_Space);
        fetch("https://cst3145cw2-be.herokuapp.com/collection/lessons"+'/' + idheader, {
          method: "PUT",  //Put request for updating stock
          headers: {
            "Content-Type": "application/json",
          },
    
          body:JSON.stringify(N_Space),
        });
      }
        alert("Order Sucessfully Placed");   
        console.log("Order Placed Successfully");
        this.showCheckout();
        this.cart=[];
        this.order=[];
        },
     
    
        //sorting
        SortByAttribute() {
            var direc = document.querySelector('input[name="direction"]:checked');
            var attribute = document.querySelector('input[name="attribute"]:checked').value;
            if (direc != null && attribute != null ) {
                console.log("The attributed being sorted: " + attribute + " Direction: " + direc.value);
                if (direc.value == -1) {
                  this.lessons.sort((a, b) => (a[attribute] > b[attribute] ? -1 : a[attribute] < b[attribute] ? 1 : 0));
                   
                }
                else if (direc.value == 1) {
                  this.lessons.sort((a, b) => (a[attribute] < b[attribute] ? -1 : a[attribute] > b[attribute] ? 1 : 0));
                }
            }
            else {
                this.lessons.sort((a, b) => (a[attribute] < b[attribute] ? -1 : a[attribute] > b[attribute] ? 1 : 0));
            }
        }
    },
    computed: {
        canViewCart() {
            return this.cart.length > 0 ? false : true;
        },

        cartItemCount() {
            return this.cart.length || "";
        },
        
        numericName() {
            return /\d/.test(this.order.name);
        },
        
        canCheckout() {
            if (this.order.name != "") {
                if (this.order.number != "" && this.numericName == false) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (this.numericName == true) {
                return false;
            }
        }
        
    }
    
   });
    
   
