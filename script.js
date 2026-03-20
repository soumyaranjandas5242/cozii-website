console.log("COZII BOUQUET website running");

function requireLogin() {

    if (!currentUser) {

        document.getElementById("loginPopup").style.display = "flex";

        alert("Please Sign In or Sign Up first");

        return false;
    }

    return true;
}
/* --------------------------
OPEN / CLOSE PAGES
-------------------------- */

function openLogin() {
    document.getElementById("loginPopup").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginPopup").style.display = "none";
}

function openSearch() {
    document.getElementById("searchBox").style.display = "block";
}

function closeSearch() {
    document.getElementById("searchBox").style.display = "none";
}



/* -------------------------
LOAD DATA FROM STORAGE
------------------------- */

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();
updateWishlistCount();

/* -------------------------
SAVE DATA
------------------------- */

function saveData() {

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("cart", JSON.stringify(cart));

}

/* -------------------------
OPEN / CLOSE
------------------------- */

function openWishlist() {
    if (!requireLogin()) return;

    document.getElementById("wishlistPage").style.display = "block";
    displayWishlist();

}

function closeWishlist() {

    document.getElementById("wishlistPage").style.display = "none";

}

function openCart() {
    if (!requireLogin()) return;

    document.getElementById("cartPage").style.display = "block";
    displayCart();

}

function closeCart() {

    document.getElementById("cartPage").style.display = "none";

}

/* -------------------------
ADD TO WISHLIST
------------------------- */

function addToWishlist(icon) {

    let card = icon.parentElement;

    let name = card.querySelector("h3").innerText;
    let price = card.querySelector("p").innerText;
    let img = card.querySelector("img").src;

    let index = wishlist.findIndex(p => p.name === name);

    if (index === -1) {

        wishlist.push({ name, price, img });

        icon.innerHTML = '<i class="fa-solid fa-heart"></i>';
        icon.style.color = "red";

    } else {

        wishlist.splice(index, 1);

        icon.innerHTML = '<i class="fa-regular fa-heart"></i>';
        icon.style.color = "#555";

    }

    saveData();
    updateWishlistCount();

}
/* -------------------------
DISPLAY WISHLIST
------------------------- */

function displayWishlist() {

    let container = document.getElementById("wishlistContent");

    container.innerHTML = "";

    if (wishlist.length === 0) {

        container.innerHTML = "<p>Your Wishlist is empty</p>";
        return;

    }

    wishlist.forEach((item, index) => {

        container.innerHTML += `

<div class="wishlist-item">

<img src="${item.img}" width="70">

<div>
<h4>${item.name}</h4>
<p>${item.price}</p>
</div>

<button onclick="moveToCart(${index})">Add to Cart</button>
<button onclick="removeWishlist(${index})">Remove</button>

</div>

`;

    });

}

/* -------------------------
REMOVE WISHLIST
------------------------- */

function removeWishlist(index) {

    wishlist.splice(index, 1);

    saveData();
    displayWishlist();
    updateWishlistCount();

}
/* -------------------------
MOVE WISHLIST TO CART
------------------------- */

function moveToCart(index) {

    let item = wishlist[index];

    let exist = cart.find(p => p.name === item.name);

    if (exist) {

        exist.qty++;

    } else {

        cart.push({...item, qty: 1 });

    }

    removeWishlist(index);
    updateCartCount();
    saveData();

}

/* -------------------------
ADD TO CART
------------------------- */

function addToCart(btn) {

    let card = btn.parentElement;

    let name = card.querySelector("h3").innerText;
    let price = card.querySelector("p").innerText;
    let img = card.querySelector("img").src;

    let exist = cart.find(p => p.name === name);

    if (exist) {

        exist.qty++;

    } else {

        cart.push({ name, price, img, qty: 1 });

    }

    updateCartCount();
    saveData();

    alert("Product added to cart");

}

/* -------------------------
DISPLAY CART
------------------------- */

function displayCart() {

    let container = document.getElementById("cartContent");

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = "<p>Your Cart is empty!</p>";
        return;

    }

    let total = 0;

    cart.forEach((item, index) => {

        let price = parseInt(item.price.replace("₹", ""));

        total += price * item.qty;

        container.innerHTML += `

<div class="cart-item">

<img src="${item.img}" width="70">

<div>
<h4>${item.name}</h4>
<p>${item.price}</p>
</div>

<div class="qty">

<button onclick="decreaseQty(${index})">-</button>

<span>${item.qty}</span>

<button onclick="increaseQty(${index})">+</button>

</div>

<button onclick="removeCart(${index})">Remove</button>

</div>

`;

    });

    container.innerHTML += `

<h3>Total: ₹${total}</h3>
<button onclick="checkout()">Checkout</button>

`;

}

/* -------------------------
QUANTITY
------------------------- */

function increaseQty(index) {

    cart[index].qty++;

    saveData();
    displayCart();
    updateCartCount();

}

function decreaseQty(index) {

    if (cart[index].qty > 1) {

        cart[index].qty--;

    } else {

        cart.splice(index, 1);

    }

    saveData();
    displayCart();
    updateCartCount();

}

/* -------------------------
REMOVE CART
------------------------- */

function removeCart(index) {

    cart.splice(index, 1);

    saveData();
    displayCart();
    updateCartCount();

}

/* -------------------------
COUNT UPDATE
------------------------- */

function updateCartCount() {

    let total = 0;

    cart.forEach(item => {
        total += item.qty;
    });

    let cartBox = document.getElementById("cartCount");

    if (cartBox) {
        cartBox.innerText = total;
    }

}

function updateWishlistCount() {

    let wishlistBox = document.getElementById("wishlistCount");

    if (wishlistBox) {
        wishlistBox.innerText = wishlist.length;
    }

}
/* -------------------------
CHECKOUT
------------------------- */
function checkout() {
    if (!requireLogin()) return;

    let total = 0;

    cart.forEach(item => {
        let price = parseInt(item.price.replace("₹", ""));
        total += price * item.qty;
    });

    if (total < 299) {
        alert("Minimum order amount is ₹299 to order");
        return;
    }

    document.getElementById("orderPage").style.display = "block";
    document.getElementById("cartPage").style.display = "none";
    loadSavedAddress();
}
/* --------------------------
SEARCH
-------------------------- */

function searchProducts() {

    let input = document.getElementById("searchInput").value.toLowerCase();

    let products = document.getElementsByClassName("product-card");

    for (let i = 0; i < products.length; i++) {

        let name = products[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

        if (name.includes(input)) {

            products[i].style.display = "block";

        } else {

            products[i].style.display = "none";

        }

    }

}

/* --------------------------
BANNER SLIDER
-------------------------- */

let slideIndex = 0;
document.addEventListener("DOMContentLoaded", function() {
    showSlides();
});


function showSlides() {

    let slides = document.getElementsByClassName("slide");

    for (let i = 0; i < slides.length; i++) {

        slides[i].style.display = "none";

    }

    slideIndex++;

    if (slideIndex > slides.length) {

        slideIndex = 1;

    }

    slides[slideIndex - 1].style.display = "block";

    setTimeout(showSlides, 3000);

}

function closeCart() {
    document.getElementById("cartPage").style.display = "none";
}
/* --------------------------
SEARCH SUGGESTIONS
-------------------------- */

let products = [
    { name: "Earrings", page: "earrings.html" },
    { name: "Jewellery Set", page: "jewellery set.html" },
    { name: "Neckpieces", page: "neckpieces.html" },
    { name: "Bracelets", page: "bracelets.html" },
    { name: "Scrunchies", page: "scrunchies.html" },
    { name: "Snap Clips", page: "snapclips.html" },
    { name: "Claw Clips", page: "clawclips.html" },
    { name: "Bangles", page: "bangles.html" },
    { name: "Rings", page: "rings.html" }
];

function showSuggestions() {

    let input = document.getElementById("searchInput").value.toLowerCase();
    let suggestionBox = document.getElementById("suggestions");

    suggestionBox.innerHTML = "";

    if (input === "") return;

    products.forEach(function(product) {

        if (product.name.toLowerCase().includes(input)) {

            suggestionBox.innerHTML +=
                "<div class='suggest-item' onclick='openProduct(\"" + product.page + "\")'>🔎 " + product.name + "</div>";

        }

    });

}

function selectProduct(product) {

    document.getElementById("searchInput").value = product;

    document.getElementById("suggestions").innerHTML = "";

}

function openProduct(page) {

    window.location.href = page;

}

function showSignup() {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("signupPopup").style.display = "flex";
}

function showLogin() {
    document.getElementById("signupPopup").style.display = "none";
    document.getElementById("loginPopup").style.display = "flex";
}

function closeSignup() {
    document.getElementById("signupPopup").style.display = "none";
}

function closeOrder() {
    document.getElementById("orderPage").style.display = "none";
}

function submitAddress() {

    let first = document.getElementById("firstName").value.trim();
    let last = document.getElementById("lastName").value.trim();
    let email = document.getElementById("emailAddress").value.trim();
    let mobile = document.getElementById("mobileNumber").value.trim();
    let pin = document.getElementById("pinCode").value.trim();
    let address = document.getElementById("fullAddress").value.trim();
    let state = document.getElementById("state").value;

    if (first == "" || last == "" || email == "" || mobile == "" || pin == "" || address == "") {
        alert("Please fill all details");
        return;
    }

    if (mobile.length != 10) {
        alert("Enter valid mobile number");
        return;
    }

    if (pin.length != 6) {
        alert("Enter valid PIN Code");
        return;
    }

    let customer = {
        first,
        last,
        email,
        mobile,
        pin,
        address,
        state
    };

    localStorage.setItem("customerAddress", JSON.stringify(customer));

    alert("Address Saved Successfully");

    document.getElementById("continuePayment").style.display = "block";
    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("changeBtn").style.display = "block";
    document.getElementById("continuePayment").style.display = "block";

}

function openPayment() {

    document.getElementById("orderPage").style.display = "none";
    document.getElementById("paymentPage").style.display = "block";

    let total = 0;

    cart.forEach(item => {
        let price = parseInt(item.price.replace("₹", ""));
        total += price * item.qty;
    });

    document.getElementById("paymentTotal").innerText = "₹" + total;

}

function closePayment() {
    document.getElementById("paymentPage").style.display = "none";
}

function completePayment() {

    let address = JSON.parse(localStorage.getItem("customerAddress"));

    let total = 0;

    cart.forEach(item => {
        let price = parseInt(item.price.replace("₹", ""));
        total += price * item.qty;
    });

    let orderData = {
        customerName: address.first + " " + address.last,
        email: address.email,
        mobile: address.mobile,
        address: address.address,
        state: address.state,
        products: cart,
        totalAmount: total
    };

    fetch("http:https://cozii-backend.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(res => res.text())
        .then(data => {
            console.log(data); // 👈 IMPORTANT
            alert("Order Saved Successfully 🎉");
        })
        .catch(err => console.log(err));

    document.getElementById("paymentPage").style.display = "none";
    document.getElementById("successPage").style.display = "block";

    cart = [];
    saveData();
    updateCartCount();
}

function continueShopping() {

    document.getElementById("successPage").style.display = "none";
    window.location.href = "index.html";

}

function loadSavedAddress() {

    let saved = localStorage.getItem("customerAddress");

    if (saved) {

        let data = JSON.parse(saved);

        document.getElementById("firstName").value = data.first;
        document.getElementById("lastName").value = data.last;
        document.getElementById("emailAddress").value = data.email;
        document.getElementById("mobileNumber").value = data.mobile;
        document.getElementById("pinCode").value = data.pin;
        document.getElementById("fullAddress").value = data.address;
        document.getElementById("state").value = data.state;

        document.getElementById("continuePayment").style.display = "block";

    }

}

function changeAddress() {

    document.getElementById("submitBtn").style.display = "block";
    document.getElementById("changeBtn").style.display = "none";
    document.getElementById("continuePayment").style.display = "none";

} /* SIDE MENU */

function openMenu() {
    document.getElementById("sideMenu").style.left = "0";
}

function closeMenu() {
    document.getElementById("sideMenu").style.left = "-300px";
}

function logoutUser() {

    firebase.auth().signOut().then(() => {

        alert("You have been logged out");

        currentUser = null;

    }).catch((error) => {

        alert(error.message);

    });

}

function sendOrder() {
    fetch("https://cozii-backend.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "Customer",
                product: "Bouquet"
            })
        })
        .then(response => response.text())
        .then(data => console.log(data));
}

function exploreProducts() {
    window.location.href = "index.html";
}

function order() {
    checkout();
}