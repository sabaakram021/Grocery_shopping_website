const apiurl = "https://iws.admin.impulsewebsolution.com/clients/multivendor/multivendors/AjiHan/api/api.php";

const imgurl = `https://iws.admin.impulsewebsolution.com/clients/multivendor/multivendors/AjiHan/ADMIN_PANEL/assets/`;

// login checkup

function getRandomNumber() {
    const numbers = [3, 4, 5];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
}

// console.log(getRandomNumber());

const onestar = `<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill "></i>
<i class="ri-star-s-fill "></i>
<i class="ri-star-s-fill "></i>
<i class="ri-star-s-fill "></i>`;

const twostar = `
<i class="ri-star-s-fill israting"></i>
 <i class="ri-star-s-fill israting"></i>
 <i class="ri-star-s-fill "></i>
<i class="ri-star-s-fill "></i>
<i class="ri-star-s-fill "></i>
`;

const threestar = `
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill "></i>
<i class="ri-star-s-fill "></i>
`;

const fourstar = `
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill"></i>
`;

const fivestar = `
<i class="ri-star-s-fill israting"></i>
 <i class="ri-star-s-fill israting"></i>
 <i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
<i class="ri-star-s-fill israting"></i>
`;


function loginStatusCheck() {
    var login_status = localStorage.getItem("login_status");
    if (login_status != 'true') {
        location.href = "login.html";
    }
}


// user login signup

const showPopup = (msg) => {
    $(".popup").addClass("popup-active");
    $(".popup").html(`${msg}`);
    setTimeout(hidePopup, 1500)
}
const hidePopup = () => {
    $(".popup").removeClass("popup-active");
}

async function signUp() {
    await subscribe();
    let DeviceToken = localStorage.getItem('DeviceToken');
    // let DeviceToken = 'testing';
    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var mobile = $("#mobile").val();
    var password = $("#password").val();

    if (fullname == "") {
        showPopup("please enter full name")
        return;
    }
    else if (fullname.length <= 2) {
        showPopup("please enter valid full name")
        return;
    }
    // else if (email == "") {
    //     showPopup("please enter email address")
    //     return;
    // }
    // else if (email.length <= 10) {
    //     showPopup("please enter valid email address")
    //     return;
    // }
    else if (mobile == "") {
        showPopup("please enter mobile number")
        return;
    }
    else if (mobile.length < 10 || mobile.length > 10) {
        showPopup("please enter valid mobile number")
        return;
    }
    else if (password == "") {
        showPopup("please enter password")
        return;
    }
    else if (password.length <= 3) {
        showPopup("password should be atleast four word")
        return;
    }

    else {
        $.ajax({
            url: apiurl,
            type: "POST",
            data: { 'type': 'usersignup', 'fullname': fullname, 'email': email, 'mobile': mobile, 'password': password, 'DeviceToken': DeviceToken },
            success: function (response) {
                console.log(response);
                if (response == "success") {
                    localStorage.setItem("login_status", true);
                    localStorage.setItem("username", fullname);
                    localStorage.setItem("mobile", mobile);
                    localStorage.setItem("email", email);
                    location.href = "location.html";
                } else {
                    // alert("user already exists");
                    showPopup("user already exist");
                }
            }
        })
    }
}


const login = async () => {
    var mobileNumber = $("#mobileNumber").val();
    var loginPassword = $("#loginPassword").val();
    // await subscribe();
    let DeviceToken = localStorage.getItem('DeviceToken');

    $.ajax({
        url: apiurl,
        type: "POST",
        data: { 'type': 'login', 'mobileNumber': mobileNumber, 'loginPassword': loginPassword, 'DeviceToken': 'DeviceToken'},
        success: function (response) {
            console.log(response);
            if (response != "error") {
                var data = JSON.parse(response);
                data.forEach(item => {
                    localStorage.setItem("login_status", true);
                    localStorage.setItem("username", item.full_name);
                    localStorage.setItem("mobile", mobileNumber);
                    localStorage.setItem("email", item.email);
                    localStorage.setItem("s_city_id", item.s_city_id);
                });
                showPopup("successfully login");
                setTimeout(() => {
                    location.href = "home.html";
                }, 1500);

            } else {
                showPopup("user does not exist");
            }
        }
    })
}

const loaduserdeatils = () => {
    var userid = localStorage.getItem("mobile");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loaduserdeatils', 'userid': userid },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                localStorage.setItem("s_city", data[0].city_name);
                localStorage.setItem("s_area", data[0].area);
                localStorage.setItem("s_pincode", data[0].pin_code);

                $(".del_address").html(`${data[0].area} ${data[0].city_name} , ${data[0].pin_code}`);
            }
        }
    })
}


const loadallCity = () => {
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadallCity' },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var scitygrid = "";
                data.forEach(item => {
                    scitygrid += `
                    <option value="${item.city_id},${item.city_name}">${item.city_name}</option>
                    `;
                })
                $("#scity").append(scitygrid);
            } else {
                $("#scity").append("no data found");
            }
        }
    })
}

const selectCity = () => {
    var city = $("#scity").val();
    var citiidname = city.split(',');
    // var city_name=$("#scity").html();
    var cityid = citiidname[0];
    var city_name = citiidname[1];
    $("#s_city_id").val(cityid);
    $("#s_city").val(city_name);
    // $("#s_area").val("")
    // $("#s_pincode").val("")
    $("#sarea").html("<option value='' selected disabled hidden>select area</option>");
    console.log(cityid, city_name);
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadaCityArea', 'cityid': cityid },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var scitygrid = "";
                data.forEach(item => {
                    scitygrid += `
                    <option value="${item.area_name},${item.area_pincode}">${item.area_name} ,${item.area_pincode}</option>
                    `;
                })
                $("#sarea").append(scitygrid);
            } else {
                $("#sarea").html("<option value=''>no data found</option>");
            }
        }
    })
}

const selectArea = () => {
    var sarea = $("#sarea").val();
    var sareanamepincode = sarea.split(',');
    console.log(sareanamepincode);
    $("#s_area").val(sareanamepincode[0])
    $("#s_pincode").val(sareanamepincode[1])
}

const locationChoosed = (action='none') => {
    var s_city_id = $("#s_city_id").val();
    var s_city = $("#s_city").val();
    var s_area = $("#s_area").val()
    var s_pincode = $("#s_pincode").val()
    var userid = localStorage.getItem("mobile");
    console.log(
        "s_city :", s_city,
        "s_area :", s_area,
        "s_pincode :", s_pincode,
    )
    //    exit;
    if (s_city == '') {
        showPopup("please select city");
        return;
    }
    else if (s_area == '') {
        showPopup("please select area");
        return;
    } else {

        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'saveAdress', 'userid': userid, 's_city': s_city, 's_area': s_area, 's_pincode': s_pincode, 's_city_id': s_city_id , 'action': action},
            success: function (response) {
                if (response != 'error') {
                    localStorage.setItem("s_city_id", s_city_id);
                    localStorage.setItem("s_city", s_city);
                    localStorage.setItem("s_area", s_area);
                    localStorage.setItem("s_pincode", s_pincode);
                    location.href = "home.html";
                }
            }
        })

    }
}




var upperbannerdata = [];
const backGroundWorker = () => {
    $(".loder").show();
    $(".mainlayer").hide();
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadBanner' },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                // console.log("banner data : ", data);

                data.forEach((item) => {

                    if (item.banner_type == 'main') {
                        $(".upper-img").html(`
                        <img src="${imgurl + item.banner_imgurl}" alt="bg">
                        `);
                        $(".category-header").append(`
                        <h1>${item.banner_title}</h1>
                        `);
                        $(".category-header").append(`
                        <p>${item.banner_desc}</p>
                        `);

                        $(".category-header").css("color", item.color_code);
                    }


                    else if (item.banner_type == 'upper') {
                        upperbannerdata.push(item);
                    }

                    // else if (item.banner_type == 'occassion') {
                    //     $(".occasionally-banner").html(`
                    //     <img src="${imgurl + item.banner_imgurl}" alt="img">
                    //     `);
                    // }

                })

            }
        }

    })




    // load super category

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'superCategory' },
        success: function (response) {

            if (response != 'error') {
                var data = JSON.parse(response);
                // console.log("superCategory data : ", data);
                var supercategorygrid = "";
                data.forEach(item => {

                    supercategorygrid += `
                    <div class="cat-box flex flex-col space-between" onclick="goToSuperCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                    <div class="cat-name">
                        <p>${item.cat_name}</p>
                    </div>
                    <div class="cat-img">
                        <img src="${imgurl + item.cat_photourl}" alt="grocery">
                    </div>
                </div>
                    `;

                })
                $(".category-grid").html(supercategorygrid);


            } else {
                // console.log(response);
            }
        }
    })


    // load top category

    // $.ajax({
    //     url: apiurl,
    //     type: 'POST',
    //     data: { 'type': 'loadTopCategory' },
    //     success: function (response) {

    //         if (response != 'error') {
    //             var data = JSON.parse(response);
    //             // console.log("top category : ", data);
    //             var topcategorygrid = "";
    //             data.forEach(item => {
    //                 topcategorygrid += `
    //                 <div class="vendor-box flex flex-col">
    //                 <div class="vendor-cat" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
    //                     <img src="${imgurl + item.cat_photourl}" alt="img">
    //                 </div>
    //                 <div class="vendor-cat-name">
    //                     <p>${item.cat_name}</p>
    //                 </div>
    //             </div>
    //                 `;
    //             })
    //             $(".vendor-category").html(topcategorygrid);
    //         }
    //     }
    // })


    // load daily deals

    // $.ajax({
    //     url: apiurl,
    //     type: 'POST',
    //     data: { 'type': 'loadDailyDealsCategory' },
    //     success: function (response) {

    //         if (response != 'error') {
    //             var data = JSON.parse(response);
    //             // console.log("top category : ", data);
    //             var topcategorygrid = "";
    //             data.forEach(item => {
    //                 topcategorygrid += `
    //                 <div class="deals-box flex flex-col gap-5 dailydealsbox">
    //                 <div class="deals-img" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
    //                     <img src="${imgurl + item.cat_photourl}" alt="img">
    //                 </div>
    //                 <div class="deals-name">
    //                     <p>${item.cat_name}</p>
    //                 </div>
    //                 </div>
    //                 `;
    //             })
    //             $(".dialy-deals-grid").html(topcategorygrid);
    //         }
    //     }
    // })


    // load offer event loadOfferEvent

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadOfferEvent' },
        success: function (response) {
            $(".mainlayer").show();
            if (response != 'error') {
                var data = JSON.parse(response);
                // console.log("top category : ", data);
                var offereventgrid = "";
                data.forEach(item => {
                    offereventgrid += `
                    <div class="top-product-box">
                    <div class="top-product-box-overlay" onclick="goToOfferProduct('${item.offer_event_id}' ,'${item.offer_event_name}')"></div>
                    <img src="${imgurl + item.offer_event_img}" alt="img" >

                    <div class="top-product-info">
                        <h4>${item.offer_event_name}</h4>
                        <p>${item.offer_event_desc}</p>
                    </div>
                </div>
                    `;
                })
                $(".offereventgrid").html(offereventgrid);
            }
        }
    })


    // newly launch product

    var cityId = localStorage.getItem("s_city_id");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'newlylaunchProduct', 'cityId': cityId },
        success: function (response) {
            $(".loder").hide();
            if (response != 'error') {
                var prodata = localStorage.setItem("prodata", response);
                var data = JSON.parse(response);
                console.log("loadCategoryProduct : ", data);
                var newlylaunchproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    // console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }
                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    // console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }

                    var outOfStock;
                    (item.stock == 'false') ? outOfStock = ` <div class="product-box-overlay flex"><p>Out Of Stock</p></div>` : outOfStock = "";

                    var disabled = 'disabled';
                    (item.stock == 'false') ? disabled = 'disabled' : disabled = "";

                    newlylaunchproductgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                    ${outOfStock}
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button ${disabled} class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".newly-launch-grid").html(newlylaunchproductgrid);

                checkWishlist();
            } else {
                $(".newly-launch-grid").html("no items found");
            }

        }
    })






}


function loadupperbanner() {

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadupperbanner' },
        success: function (response) {

            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upperbanneritem data : ", data);
                var upperbannergrid = "";
                data.forEach(item => {
                    var gotocatbt = "";
                    if (item.c_id != null) {
                        console.log("yes happen");
                        gotocatbt = `
                       onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')"
                        `;
                    }
                    console.log("upperbanneritem:", item);
                    upperbannergrid += `
                        <div class="banner-img" ${gotocatbt}>
                        <img src="${imgurl + item.banner_imgurl}" alt="img">
                        </div>
                    `;
                })
                $('#first-banner').html(upperbannergrid);
                $('#first-banner').owlCarousel({
                    loop: true,
                    margin: 10,
                    // nav:true,
                    items: 1,
                    autoplay: true,
                    autoplayHoverPause: true
                })


            } else {
                $('#first-banner').hide();
            }
        }
    })
    // console.log("upperbannerdata",upperbannerdata.length);




}

function loadLowerbanner() {

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadLowerbanner' },
        success: function (response) {

            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upperbanneritem data : ", data);
                var upperbannergrid = "";
                data.forEach(item => {
                  
                    
                    upperbannergrid += `
                        <div>
                        <img src="${imgurl + item.banner_imgurl}" alt="img">
                        </div>
                    `;
                })
                $('.occasionally-banner').html(upperbannergrid);
                $('.occasionally-banner').owlCarousel({
                    loop: true,
                    margin: 10,
                    // nav:true,
                    items: 1,
                    autoplay: true,
                    autoplayHoverPause: true
                })


            } else {
                $('#first-banner').hide();
            }
        }
    })
    // console.log("upperbannerdata",upperbannerdata.length);




}


function loadtopRatedProduct() {
    // top rated product

    var cityId = localStorage.getItem("s_city_id");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'topRatedProduct', 'cityId': cityId },
        success: function (response) {

            if (response != 'error') {
                var prodata = localStorage.setItem("prodata", response);
                var data = JSON.parse(response);
                var topratedgrid = "";
                data.forEach(item => {

                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    // console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = `   <p class="top-rated-offer">
                         <span>${offer}%</span> OFF
                       </p> `;
                    } else {
                        offerdiv = "";
                    }

                    var outOfStock;
                    (item.stock == 'false') ? outOfStock = ` <div class="product-box-overlay flex"><p>Out Of Stock</p></div>` : outOfStock = "";

                    var disabled = 'disabled';
                    (item.stock == 'false') ? disabled = 'disabled' : disabled = "";

                    topratedgrid += `
                  <div class="top-rated-box">
                  <div class="top-rated-img">
                  ${outOfStock}
                      <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
  
                      <div class="top-rated-rating flex gap-5">
                          <p>${item.rating_val}</p>
                          <i class="ri-star-s-fill israting"></i>
                      </div>
                      <div class="top-rated-cart-btn flex">
                          <div class="addtocartdiv${item.p_id}">
                          <i class="ri-add-fill" onclick='addToCart2(${items})'></i>
                      </div>
                      </div>
                  </div>
  
                  <div class="top-rated-info flex space-between">
                      <p class="top-rated-name">
                         ${item.p_name}
                      </p>
                      ${offerdiv}
                  </div>
  
                  <div class="top-rated-price flex justify-start gap-10">
                      <p class="top-rated-fake-price"><del>₹${item.mrp}</del></p>
                      <p class="top-rated-real-price">₹${item.price}</p>
                  </div>
  
              </div>
                  `;
                })
                $(".top-rated-grid").html(topratedgrid);
            }

        }
    })
}
function loadBestSeller() {
    // top rated product

    var cityId = localStorage.getItem("s_city_id");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadBestSeller', 'cityId': cityId },
        success: function (response) {

            if (response != 'error') {
                var prodata = localStorage.setItem("prodata", response);
                var data = JSON.parse(response);
                var bestsellergrid = "";
                data.forEach(item => {

                    var items = JSON.stringify(item);

                    var ratingval;
                    (item.seller_rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.seller_rat_val / item.seller_rat_nop;
                    ratingval = ratingval.toFixed(1);

                    bestsellergrid += `
                   <div class="best-seller-box">
                    <div class="best-seller-img" onclick="goToStore('${item.admin_id}','${item.shop_name}')">
                        <img src="${imgurl + item.admin_img}" alt="img">
                    </div>
                    <div class="best-seller-info flex space-between">
                        <p class="best-seller-name">${item.shop_name}</p>
                        <div class="flex gap-2 best-seller-rating">
                            <i class="ri-star-s-fill israting"></i>
                            <p>${ratingval}</p>
                        </div>
                    </div>
                </div>
                  `;
                })
                $(".best-seller-grid").html(bestsellergrid);
            }

        }
    })
}


const goToSingleProduct = (p_id) => {
    location.href = `single-product.html?id=${p_id}`;
}

function loadSingleProduct() {
    $(".loder").show();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const p_id = urlParams.get('id')
    console.log(p_id);


    // load product data
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSingleProduct', 'p_id': p_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                data.forEach(item => {
                    var items = JSON.stringify(item);

                    $(".product-price span").html(item.price);
                    $(".product-fake-price").html(`<del>₹${item.mrp}</del>`);
                    $(".stotal").html(item.price);
                    $(".product-weight").html(`${item.quantity}`);
                    var originaldata = `<p class="wvarientdetail ovarientdetail varrrient-choose" onclick='originatVarintData(${items})'>${item.quantity}</p>`;
                    console.log("originaldata : ", originaldata);
                    // $(".woriginal").html(``);
                    $(".woriginal").html(originaldata);
                    $(".pro-name p").html(`${item.p_name}`);
                    $(".pro-descp p").html(`${item.description}`);
                    $(".whislistbtndiv").html(`
                    <div class="whislistbtns whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                    <i class="ri-heart-3-fill "></i>
                    </div>
                    `);
                    $(".addtocartbtn").html(`
                    <button onclick='singleProductaddtoCart(${items})'>Add To Cart </button>
                    `)

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }

                    $(".proratingdiv").html(star);
                    $(".ratingval").html(ratingval);


                })

                checkWishlist();
            }
        }
    });


    $(".loder").hide();

}


const loadSingleProductimg = () => {
    $(".loder").show();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const p_id = urlParams.get('id')

    // load proudt img

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSingleProductimg', 'p_id': p_id },
        success: function (response) {
            if (response != 'error') {
                // console.log("yes i run");
                var data = JSON.parse(response);
                console.log("multi img data : ", data);
                var imggrid = "";
                data.forEach(item => {
                    // singleimgurl.push(item.multi_imgurl);
                    imggrid += `<div class="productimg">
                    <img class="productimgchange" src="${imgurl + item.multi_imgurl}" alt="img">
                    </div>`;
                })

                $(".productimg-grid").html(imggrid);
                $('.productimg-grid').owlCarousel({
                    loop: true,
                    margin: 10,
                    // nav:true,
                    items: 1,
                    autoplay: true,
                    autoplayHoverPause: true
                })

                $(".loder").hide();
            } else {
                // $(".multiimg").hide();
            }
        }
    })
    // $(".loder").hide();
}

async function loadSingleProductVarient() {
    // load product Varirnt

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const p_id = urlParams.get('id')

    var sizevdata = [];
    var weightvdata = [];
    var colorvdata = [];
    await $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSingleProductVarient', 'p_id': p_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("varient data : ", data);

                data.forEach(item => {

                    if (item.var_title == 'size') {
                        sizevdata.push(item);
                    }
                    else if (item.var_title == 'weight') {
                        weightvdata.push(item);
                    }
                    else if (item.var_title == 'color') {
                        colorvdata.push(item);
                    }



                })

            } else {
                $(".varient-title").hide();
                $(".varrrient").hide();
            }
        }
    })


    console.log("sizevdata", sizevdata.length);
    console.log("weightvdata", weightvdata.length);
    console.log("colorvdata", colorvdata.length);

    if (sizevdata.length != 0) {
        var varintrid = "";
        sizevdata.forEach(item => {
            var items = JSON.stringify(item);
            $(".size-varient-title").html(item.var_title);
            varintrid += `
           <p class="varientdetail svarientdetail varientdetail${item.v_id}" onclick='selectSizeVarient(${items})'>${item.var_detail}</p>
           `;
        })
        $(".sizeVarient").html(varintrid);
    } else {
        $(".sizeVarientdiv").hide();
    }

    if (weightvdata.length != 0) {
        var varintrid = "";

        weightvdata.forEach(item => {
            var items = JSON.stringify(item);
            $(".weight-varient-title").html(item.var_title);
            varintrid += `
           <p class="varientdetail wvarientdetail varientdetail${item.v_id}" onclick='selectWeightVarient(${items})'>${item.var_detail}</p>
           `;
        })
        $(".weightvarient").html(varintrid);

    } else {
        $(".weightvarientdiv").hide();
    }

    if (colorvdata.length != 0) {
        var varintrid = "";
        colorvdata.forEach(item => {
            var items = JSON.stringify(item);
            $(".color-varient-title").html(item.var_title);
            varintrid += `
           <p class="varientdetail cvarientdetail varientdetail${item.v_id}" onclick='selectColorVarient(${items})'>${item.var_detail}</p>
           `;
        })
        $(".colorvarient").html(varintrid);

    } else {
        $(".colorvarientdiv").hide();
    }


}



const changeProImg = (singleimg) => {

    document.querySelector(".productimgchange").src = imgurl + singleimg;


}

const loadSimilarProduct = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const p_id = urlParams.get('id');
    var cityId = localStorage.getItem("s_city_id");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSimilarProduct', 'p_id': p_id, 'cityId': cityId },
        success: function (response) {
            if (response != 'error') {

                console.log("loadSimilarProduct : ", response);
                var data = JSON.parse(response);
                console.log("loadSimilarProduct : ", data);
                var similarproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    // console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }
                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    // console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }



                    similarproductgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart1" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".similar-product-grid").html(similarproductgrid);

                checkWishlist();
            } else {
                $(".similar-product").hide();
            }
        }
    })
}

const selectColorVarient = (item) => {
    console.log(item);

    // console.log(item.var_price)
    $(".cvarientdetail").removeClass("varrrient-choose");
    $(`.varientdetail${item.v_id}`).addClass("varrrient-choose");
    if (item.var_price != "") {
        $(".product-price span").html(item.var_price);
        $(".product-price span").html(item.var_price);
        $(".stotal").html(item.var_price);
    }

    $(".snop").html('1');
}

const selectWeightVarient = (item) => {
    console.log(item);

    // console.log(item.var_price)
    $(".wvarientdetail").removeClass("varrrient-choose");
    $(`.varientdetail${item.v_id}`).addClass("varrrient-choose");
    if (item.var_price != "") {
        $(".product-price span").html(item.var_price);
        $(".stotal").html(item.var_price);
        $(".product-fake-price").html(`<del>₹${item.var_mrp}</del>`);
        $(".product-weight").html(item.var_detail);
    }

    $(".snop").html('1');
}

const selectSizeVarient = (item) => {
    console.log(item);

    // console.log(item.var_price)
    $(".svarientdetail").removeClass("varrrient-choose");
    $(`.varientdetail${item.v_id}`).addClass("varrrient-choose");
    if (item.var_price != "") {
        $(".product-price span").html(item.var_price);
        $(".stotal").html(item.var_price);
    }

    $(".snop").html('1');
}

const originatVarintData = (item) => {

    $(".varientdetail").removeClass("varrrient-choose");
    $(".ovarientdetail").addClass("varrrient-choose");

    $(".product-price span").html(item.price);
    $(".product-fake-price").html(`<del>₹${item.mrp}</del>`);
    $(".stotal").html(item.price);
    $(".product-weight").html(`${item.quantity}`);
}
const singProInc = () => {
    var snop = parseInt($(".snop").html());
    var price = parseInt($(".product-price span").html());
    snop++;
    $(".snop").html(snop);
    console.log(snop);
    $(".stotal").html(price * snop);
}
const singProDec = () => {
    var snop = parseInt($(".snop").html());
    var price = parseInt($(".product-price span").html());
    if (snop > 1) {
        snop--;
        $(".snop").html(snop);
        console.log(snop);
        $(".stotal").html(price * snop);
    } else {
        return;
    }

}

const singleProductaddtoCart = (item) => {
    console.log(item);

    var snop = $(".snop").html();
    var stotal = $(".product-price span").html();
    var qty = $(".product-weight").html();
    var userid = localStorage.getItem("mobile");
    var idfr = window.localStorage.getItem("idfr");
    if (idfr == null) {
        idfr = new Date().getTime();
        window.localStorage.setItem("idfr", idfr);
    }

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'addToCart', 'userid': userid, 'p_id': item.p_id, 'p_name': item.p_name, 'imgurl': item.p_imgurl, 'price': stotal, 'mrp': item.mrp, 'quantity': qty, 'nop': snop, 'idfr': idfr },
        success: function (response) {
            console.log(response);
            if (response == 'success') {
                showPopup("added in your cart");
            } else {
                showPopup(response);
            }
        }
    })

}


const goToCategory = (c_id, cat_name, cat_banner) => {
    cat_name = cat_name.replace('&', 'and');
    location.href = `seller-category.html?id=${c_id}&&cat_name=${cat_name}&&cat_banner=${cat_banner}`;
}
const goToSubCategory = (c_id, cat_name, cat_banner, cat_id) => {
    cat_name = cat_name.replace('&', 'and');
    location.href = `seller-category.html?subcat_id=${c_id}&&id=${cat_id}&&cat_name=${cat_name}&&cat_banner=${cat_banner}`;
}
const goToSuperCategory = (c_id, cat_name, cat_banner) => {
    cat_name = cat_name.replace('&', 'and');
    location.href = `super-category.html?id=${c_id}&&cat_name=${cat_name}&&cat_banner=${cat_banner}`;
}

const loadSuperCategoryDetail = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id')
    const cat_name = urlParams.get('cat_name')
    const cat_banner = urlParams.get('cat_banner')

    $(".category-banner").html(`
        <img src="${imgurl + cat_banner}" alt="img">
        `);

}

const loadCategorySeller = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id');
    var cityId = localStorage.getItem("s_city_id");

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadCategorySeller', 'c_id': c_id, 'cityId': cityId },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                var categorysellergrid = "";
                data.forEach(item => {
                    categorysellergrid += `
                <div class="seller-box">
                    <img src="${imgurl + item.admin_img}" alt="img">
                    <div class="seller-info">
                        <p class="seller-name">${item.shop_name}</p>
                        <p class="seller-offer">${item.shop_desc}</span> Off</p>
                    </div>
                    <div class="seller-overlay" onclick="goToStore('${item.admin_id}','${item.shop_name}','${c_id}')">
                    </div>
                </div>
                    `;

                })
                $(".seller-grid").html(categorysellergrid);
            } else {
                $(".seller").hide();
            }
        }
    })
}


const goToStore = (admin_id, shop_name, catId) => {
    shop_name = shop_name.replace('&', 'and');
    location.href = `store.html?admin_id=${admin_id}&&shop_name=${shop_name}&&catId=${catId}`;
    // location.href='store.html';
}

const loadStoreDetail = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');
    const shop_name = urlParams.get('shop_name');
    $(".store-name").html(shop_name);
}

const loadSellerCategory = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSellerCategory', 'admin_id': admin_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var sellercatgrid = "";
                data.forEach(item => {
                    sellercatgrid += `
                            <div class="vendor-box flex flex-col">
                                <div class="vendor-cat" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                                    <img src="${imgurl + item.cat_photourl}" alt="img">
                                </div>
                                <div class="vendor-cat-name">
                                    <p>${item.cat_name}</p>
                                </div>
                            </div>
                    `;
                })
                $(".sellercatgrid").html(sellercatgrid);
            } else {
                $(".sellercatgrid").hide();
            }
        }
    })

}

const loadSellerUpperBanner = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSellerUpperBanner', 'admin_id': admin_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upper bannner daata", data);
                var sellerbannergrid = "";
                data.forEach(item => {
                    sellerbannergrid += `
                           <div class="upperbannerbox">
                            <img src="${imgurl + item.banner_imgurl}" alt="img">
                            </div>
                    `;
                })
                $(".sellerbannergrid").html(sellerbannergrid);
                $('.sellerbannergrid').owlCarousel({
                    loop: true,
                    margin: 10,
                    // nav:true,
                    items: 1,
                    autoplay: true,
                    autoplayHoverPause: true
                })

            } else {
                $(".sellerbannergrid").hide();
            }
        }
    })

}

const loadSellerLowerBanner = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSellerLowerBanner', 'admin_id': admin_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upper bannner daata", data);
                var sellerlowerbannergrid = "";
                data.forEach(item => {
                    sellerlowerbannergrid += `
                           <div class="upperbannerbox">
                            <img src="${imgurl + item.banner_imgurl}" alt="img">
                            </div>
                    `;
                })
                $(".sellerlowerbannergrid").html(sellerlowerbannergrid);
                $('.sellerlowerbannergrid').owlCarousel({
                    loop: true,
                    margin: 10,
                    // nav:true,
                    items: 1,
                    autoplay: true,
                    autoplayHoverPause: true
                })

            } else {
                $(".sellerbannergrid").hide();
            }
        }
    })

}

const loadSellerBestDeal = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');
    const catId = urlParams.get('catId');

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSellerBestDeal', 'admin_id': admin_id, 'catId':catId },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upper bannner daata", data);
                var bestdealgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }


                    bestdealgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })

                $(".bestdealgrid").html(bestdealgrid);
                checkWishlist()

            } else {
                $(".bestdealgriddiv").hide();
            }
        }
    })

}


const loadSellerBestSelling = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSellerBestSelling', 'admin_id': admin_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upper bannner daata", data);
                var bestsellinggrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }


                    bestsellinggrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })

                $(".bestsellinggrid").html(bestsellinggrid);
                checkWishlist()

            } else {
                $(".bestsellinggriddiv").hide();
            }
        }
    })

}

const loadSellerPopuplarProduct = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const admin_id = urlParams.get('admin_id');

    var cityId = localStorage.getItem("s_city_id");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSellerPopuplarProduct', 'cityId': cityId, 'admin_id': admin_id },
        success: function (response) {

            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("upper bannner daata", data);
                var topratedgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }


                    topratedgrid += `
                    <div class="newly-launch-product product-box top-product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })

                $(".topratedgrid").html(topratedgrid);
                checkWishlist()

            } else {
                $(".topratedgriddiv").hide();
            }

        }
    })

}


const loadShopByCategory = () => {
let urlData = new URLSearchParams(window.location.search);    
let cat_id = urlData.get('id');
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadShopByCategory', 'cat_id': cat_id },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                var shopbycategorygrid = "";
                data.forEach(item => {
                    shopbycategorygrid += `
                <div class="deals-box flex flex-col gap-5 ">
                    <div class="deals-img">
                        <img src="${imgurl + item.subcat_img}" alt="img" onclick="goToSubCategory('${item.subcat_id}','${item.subcat_name}','${item.cat_banner}','${item.c_id}')">
                    </div>
                    <div class="deals-name">
                        <p>${item.subcat_name}</p>
                    </div>
                </div>
                    `;

                })
                $(".shopbycategorygrid").html(shopbycategorygrid);
            } else {
                $(".shopbycategorygrid").hide();
            }
        }
    })


}
const loadBestDealProduct = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id');
    var cityId = localStorage.getItem("s_city_id");

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadBestDealProduct', 'c_id': c_id, 'cityId': cityId },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                var bestdealproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    // console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }
                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    // console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }


                    bestdealproductgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart1" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".bestdealproductgrid").html(bestdealproductgrid);

                checkWishlist();
            } else {
                $(".bestdealproductgrid").html("no item found");
            }
        }
    })


}

const loadCategoryItem = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id')
    const cat_name = urlParams.get('cat_name')
    const cat_banner = urlParams.get('cat_banner')
    console.log(c_id, cat_name);
    $(".cat-name").html(cat_name);

    $(".category-banner").html(`
    <img src="${imgurl + cat_banner}" alt="img">
    `);

    //check user came from which page:-
    if(urlParams.has('subcat_id')) {
       let subcatId = urlParams.get('subcat_id');
       loadSubCatProduct(subcatId);
    }else{
    // load category product

    var cityId = localStorage.getItem("s_city_id");

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadCategoryProduct', 'c_id': c_id, 'cityId': cityId },
        success: function (response) {
            if (response != 'error') {
                var prodata = localStorage.setItem("prodata", response);
                var data = JSON.parse(response);
                console.log("loadCategoryProduct : ", data);
                var categoryproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }

                    var outOfStock;
                    (item.stock == 'false') ? outOfStock = ` <div class="product-box-overlay flex"><p>Out Of Stock</p></div>` : outOfStock = "";

                    var disabled = 'disabled';
                    (item.stock == 'false') ? disabled = 'disabled' : disabled = "";

                    categoryproductgrid += `
                    <div class="newly-launch-product product-box">
                    ${outOfStock}
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                            ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button ${disabled} class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".categoryProductGrid").html(categoryproductgrid);

                checkWishlist();
            } else {
                $(".categoryProductGrid").html("no items found");
            }
        }
    })
    }

    // load sub category

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSubCategory', 'c_id': c_id },
        success: function (response) {
            if (response != 'error') {

                var data = JSON.parse(response);
                console.log("loadSubCategory : ", data);
                var subcategorygrid = "";

                data.forEach(item => {
                    subcategorygrid += `
                        <div class="subcategory-box flex " onclick="loadSubCatProduct(${item.subcat_id})">
                        <div class="subcatactive-div subcatactive-div${item.subcat_id}  "></div>
                        <div class="sub-box flex flex-col gap-2">
                            <div class="sub-box-img">
                                <img src="${imgurl + item.subcat_img}" alt="img">
                            </div>
                            <p class="sub-cat-name">${item.subcat_name}</p>
                        </div>
                    </div>
                        `;
                })
                $(".subcategorygrid").html(subcategorygrid);

            }
        }
    })

    // load category list 

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadcategory' },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var catlistgrid = "";
                data.forEach(item => {
                    catlistgrid += `
                    <div class="catlist flex space-between" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                    <p>${item.cat_name}</p>
                    <i class="ri-arrow-right-s-line"></i>
                     </div>
                    `;
                })
                $(".allCatlist").append(catlistgrid);
            }
        }
    })

}

const loadSubCatProduct = (subcat_id) => {
    console.log(subcat_id);

    var cityId = localStorage.getItem("s_city_id");
    $(".subcatactive-div").removeClass("subcatactive");
    $(`.subcatactive-div${subcat_id}`).addClass("subcatactive");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSubCatProduct', 'subcat_id': subcat_id, 'cityId': parseInt(cityId) },
        success: function (response) {
            if (response != 'error') {
                var prodata = localStorage.setItem("prodata", response);
                var data = JSON.parse(response);
                var categoryproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }

                    var outOfStock;
                    (item.stock == 'false') ? outOfStock = ` <div class="product-box-overlay flex"><p>Out Of Stock</p></div>` : outOfStock = "";

                    var disabled = 'disabled';
                    (item.stock == 'false') ? disabled = 'disabled' : disabled = "";

                    categoryproductgrid += `
                    <div class="newly-launch-product product-box">
                    ${outOfStock}
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button ${disabled} class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".categoryProductGrid").html(categoryproductgrid);
                checkWishlist();
            } else {
                $(".categoryProductGrid").html("no items found");
            }
        }
    })
}


const addToCart = (item) => {
    console.log(item);
    var items = JSON.stringify(item);
    var userid = localStorage.getItem("mobile");
    var idfr = window.localStorage.getItem("idfr");
    if (idfr == null) {
        idfr = new Date().getTime();
        window.localStorage.setItem("idfr", idfr);
    }

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'addToCart', 'userid': userid, 'p_id': item.p_id, 'p_name': item.p_name, 'imgurl': item.p_imgurl, 'price': item.price, 'mrp': item.mrp, 'quantity': item.quantity, 'nop': '1', 'idfr': idfr },
        success: function (response) {
            console.log(response);
            if (response == 'success') {

                showPopup("added in your cart");
                $(`.addtocartdiv${item.p_id}`).html(`
                <div class="addtocartbtnsection flex ">
                <div class="addtocartloader${item.p_id} addtocartloader"><span><span></div>
                <i class="ri-subtract-line incdec" onclick='decreaseItem(${items})'></i>
                <p class="cartcount${item.p_id} cartcount">1</p>
                <i class="ri-add-line incdec" onclick='increaseItem(${items})'></i>
                </div>
                `);
                loadCartCount();
            } else {
                showPopup(response);
            }
        }
    })


}

const addToCart2 = (item) => {
    console.log(item);
    var items = JSON.stringify(item);
    var userid = localStorage.getItem("mobile");
    var idfr = window.localStorage.getItem("idfr");
    if (idfr == null) {
        idfr = new Date().getTime();
        window.localStorage.setItem("idfr", idfr);
    }

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'addToCart', 'userid': userid, 'p_id': item.p_id, 'p_name': item.p_name, 'imgurl': item.p_imgurl, 'price': item.price, 'mrp': item.mrp, 'quantity': item.quantity, 'nop': '1', 'idfr': idfr },
        success: function (response) {
            console.log(response);
            if (response == 'success') {

                showPopup("added in your cart");
                $(`.addtocartdiv${item.p_id}`).html(`
                <div class="addtocartbtnsection addtocartbtnsection2 flex ">
                <div class="addtocartloader${item.p_id} addtocartloader"><span><span></div>
                <i class="ri-subtract-line incdec" onclick='decreaseItem2(${items})'></i>
                <p class="cartcount${item.p_id} cartcount">1</p>
                <i class="ri-add-line incdec" onclick='increaseItem(${items})'></i>
                </div>
                `);
                loadCartCount();
            } else {
                showPopup(response);
            }
        }
    })


}

const increaseItem = (items) => {
    var p_id = items.p_id;
    $(`.addtocartloader${p_id}`).addClass("addtocartloader-active");
    var userid = localStorage.getItem("mobile");
    var nop = parseInt($(`.cartcount${p_id}`).html());
    nop++;
    console.log(nop);

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'increaseItem', 'userid': userid, 'p_id': p_id, 'nop': nop },
        success: function (response) {
            if (response == 'success') {
                $(`.cartcount${p_id}`).html(nop);
                $(`.addtocartloader${p_id}`).removeClass("addtocartloader-active");
            }
        }
    })
}

const decreaseItem = (item) => {
    var items = JSON.stringify(item);
    var p_id = item.p_id;
    $(`.addtocartloader${p_id}`).addClass("addtocartloader-active");
    var userid = localStorage.getItem("mobile");
    var nop = parseInt($(`.cartcount${p_id}`).html());
    console.log(nop);

    if (nop > 1) {
        nop--;
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'increaseItem', 'userid': userid, 'p_id': p_id, 'nop': nop },
            success: function (response) {
                if (response == 'success') {
                    $(`.cartcount${p_id}`).html(nop);
                    $(`.addtocartloader${p_id}`).removeClass("addtocartloader-active");
                }
            }
        })
    } else {
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'deleteCartItem', 'userid': userid, 'p_id': p_id, 'nop': nop },
            success: function (response) {
                if (response == 'success') {
                    $(`.addtocartloader${p_id}`).removeClass("addtocartloader-active");
                    $(`.addtocartdiv${item.p_id}`).html(`
                    <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                    `);
                    showPopup("successfully remove from your cart");
                    loadCartCount();
                }
            }
        })
    }


}
const decreaseItem2 = (item) => {
    var items = JSON.stringify(item);
    var p_id = item.p_id;
    $(`.addtocartloader${p_id}`).addClass("addtocartloader-active");
    var userid = localStorage.getItem("mobile");
    var nop = parseInt($(`.cartcount${p_id}`).html());
    console.log(nop);

    if (nop > 1) {
        nop--;
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'increaseItem', 'userid': userid, 'p_id': p_id, 'nop': nop },
            success: function (response) {
                if (response == 'success') {
                    $(`.cartcount${p_id}`).html(nop);
                    $(`.addtocartloader${p_id}`).removeClass("addtocartloader-active");
                }
            }
        })
    } else {
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'deleteCartItem', 'userid': userid, 'p_id': p_id, 'nop': nop },
            success: function (response) {
                if (response == 'success') {
                    $(`.addtocartloader${p_id}`).removeClass("addtocartloader-active");
                    $(`.addtocartdiv${item.p_id}`).html(`
                    <i class="ri-add-fill" onclick='addToCart2(${items})'></i>
                    `);
                    showPopup("successfully remove from your cart");
                    loadCartCount();
                }
            }
        })
    }


}



const addToWishlist = (p_id) => {
    var userid = localStorage.getItem("mobile");


    if ($(`.whislistbtn${p_id}`).hasClass("whislistred")) {
        console.log("yes");
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'removeToWishlist', 'p_id': p_id, 'userid': userid },
            success: function (response) {
                if (response != 'error') {
                    $(`.whislistbtn${p_id}`).removeClass("whislistred")
                    showPopup("remove from your wishlist")
                }
            }
        })

    } else {
        console.log("no");
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'addToWishlist', 'p_id': p_id, 'userid': userid },
            success: function (response) {
                if (response != 'error') {
                    $(`.whislistbtn${p_id}`).addClass("whislistred");
                    showPopup("added in your wishlist")
                }
            }
        })
    }



}

const checkWishlist = () => {
    var userid = localStorage.getItem("mobile");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'checkWishlist', 'userid': userid },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                data.forEach(item => {
                    $(`.whislistbtn${item.w_p_id}`).addClass("whislistred");
                })
            }
        }
    })
}

const sortProduct = (sorttype) => {

    var prodata = localStorage.getItem("prodata");
    var data = JSON.parse(prodata);
    console.log(data);
    $(".sort-circle2").css("background", 'transparent');
    $(`.${sorttype}`).css("background", 'green');

    if (sorttype == 'ltoh') {
        data = data.sort((a, b) => a.price - b.price);
    }
    else if (sorttype == 'htol') {
        data = data.sort((a, b) => b.price - a.price);
    }
    else if (sorttype == 'atoz') {
        data = data.sort((a, b) => a.p_name.localeCompare(b.p_name));
    }
    else if (sorttype == 'ztoa') {
        data = data.sort((a, b) => b.p_name.localeCompare(a.p_name));
    }

    console.log("sort data", data);

    var categoryproductgrid = "";

    data.forEach(item => {
        var items = JSON.stringify(item);
        var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
        offer = Math.trunc(offer);
        console.log(typeof offer, item.mrp);
        if (item.mrp != '') {
            var offerdiv = ` <div class="best-offer">
        <p>${offer}%</p>
        <p>OFF</p>
    </div>`
        } else {
            offerdiv = "";
        }

        var ratingval; var star;
        (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
        ratingval = ratingval.toFixed(1);
        console.log(ratingval);

        if (parseInt(ratingval) < 2) {
            star = onestar;
        }
        else if (parseInt(ratingval) < 3) {
            star = twostar;
        }
        else if (parseInt(ratingval) < 4) {
            star = threestar;
        }
        else if (parseInt(ratingval) < 5) {
            star = fourstar;
        }
        else if (parseInt(ratingval) < 6) {
            star = fivestar;
        }

        categoryproductgrid += `
     <div class="newly-launch-product product-box">
     <div class="newly-launch-product-img flex">
         <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
        ${offerdiv}
        <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
        <i class="ri-heart-3-fill "></i>
        </div>
     </div>
     <div class="newly-launch-product-name">
         <p>${item.p_name}</p>
     </div>
     <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
         <p>${item.quantity}</p>
         <div class="flex rating">
             <p>${ratingval}</p>
            ${star}
         </div>
     </div>
     <div class="newly-launch-product-price flex space-between">
         <div class="flex gap-10">
             <p>₹ ${item.price}</p>
             <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
         </div>
         <div class="addtocartdiv${item.p_id}">
             <button class="addtocart" onclick='addToCart(${items})'>Add</button>
         </div>
     </div>
 </div>
         `;

    })
    $(".categoryProductGrid").html(categoryproductgrid);

}

const loadWishlist = () => {
    var userid = localStorage.getItem("mobile");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadWishlist', 'userid': userid },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var categoryproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }


                    categoryproductgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".wishlistgrid").html(categoryproductgrid);
                checkWishlist()
            } else {
                $(".wishlistgrid").html("no items found");
            }
        }
    })
}

const loadCategory = () => {

    $(".loder").show();
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadCategory' },
        success: function (response) {
            console.log(response);
            if (response != 'error') {
                var data = JSON.parse(response);
                var categorygrid = "";
                data.forEach(item => {
                    categorygrid += `
                    <div class="subcategory-box flex" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                    <div class="subcatactive-div "></div>
                    <div class="sub-box flex flex-col gap-2">
                        <div class="sub-box-img">
                            <img src="${imgurl + item.cat_photourl}" alt="img">
                        </div>
                        <p class="sub-cat-name">${item.cat_name}</p>
                    </div>
                </div>
                    `;
                })
                $(".categorygrid").html(categorygrid);
                $(".loder").hide();
            }
        }
    })
}

const loadSuperCategory = () => {
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadSuperCategory' },
        success: function (response) {
            console.log(response);
            if (response != 'error') {
                var data = JSON.parse(response);
                var categorygrid = "";
                data.forEach(item => {
                    categorygrid += `
                    <div class="catbox" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                            <img src="${imgurl + item.cat_photourl}" alt="img">
                            <p>${item.cat_name}</p>
                        </div>
                    `;
                })
                $(".supercategorygrid").html(categorygrid);
            }
        }
    })
}

const loadTopCategory = () => {
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadTopCategory' },
        success: function (response) {
            console.log(response);
            if (response != 'error') {
                var data = JSON.parse(response);
                var categorygrid = "";
                data.forEach(item => {
                    categorygrid += `
                    <div class="catbox" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                            <img src="${imgurl + item.cat_photourl}" alt="img">
                            <p>${item.cat_name}</p>
                        </div>
                    `;
                })
                $(".topcategorygrid").html(categorygrid);
            }
        }
    })
}

const loadDailyDealsCategory = () => {
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadDailyDealsCategory' },
        success: function (response) {
            console.log(response);
            if (response != 'error') {
                var data = JSON.parse(response);
                var categorygrid = "";
                data.forEach(item => {
                    categorygrid += `
                    <div class="catbox" onclick="goToCategory('${item.c_id}','${item.cat_name}','${item.cat_banner}')">
                            <img src="${imgurl + item.cat_photourl}" alt="img">
                            <p>${item.cat_name}</p>
                        </div>
                    `;
                })
                $(".shopbycatgrid").html(categorygrid);
            } else {
                $(".shopbycatgrid").html("no items found");
            }
        }
    })
}


const loadCartItem = () => {
    var userid = localStorage.getItem("mobile");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadCartItem', 'userid': userid },
        success: function (response) {
            // console.log(response);
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log("cartdata", data);
                var cartgrid = ""; var subtotal = 0;
                data.forEach(item => {

                    subtotal = subtotal + (parseInt(item.cart_p_price) * parseInt(item.cart_nop));
                    cartgrid += `
                    <div class="order-box flex space-between gap-10 cartbox${item.cart_id}">
                    <div class="order-left flex gap-5">
                        <div class="order-img">
                            <img src="${imgurl + item.cart_p_img}" alt="img">
                        </div>
                        <div class="order-info">
                            <p class="name">${item.cart_p_name}</p>
                            <p class="price">₹${item.cart_p_price}</p>
                            <div class="flex justify-start size gap-5">
                                <p>${item.cart_p_qty}</p>
                            </div>
                        </div>
                    </div>
                    <div class="order-right flex flex-col items-end space-between">
                        <div class="delelte" onclick="deleteCartItem('${item.cart_id}','${item.cart_p_price}')">
                            <i class="bi bi-trash3"></i>
                        </div>

                        <div class="btn-section flex gap-10 flex-end">
                            <i class="ri-subtract-line" onclick="cartitemdec('${item.cart_id}','${item.cart_p_price}')"></i>
                            <p class="cart_nop${item.cart_id}">${item.cart_nop}</p>
                            <i class="ri-add-line" onclick="cartiteminc('${item.cart_id}','${item.cart_p_price}')"></i>
                        </div>
                    </div>
                </div>
                    `;
                })
                $(".cartgrid").html(cartgrid);
                $(".subtotal").html(subtotal);
                loadDelChaerg()

            } else {
                $(".cartgrid").html("no items found");
                setTimeout(() => {
                    history.back();
                }, 1000)
            }
        }
    })
}


const cartiteminc = (cart_id, p_price) => {
    var nop = parseInt($(`.cart_nop${cart_id}`).html())
    console.log(nop);
    nop++;
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'cartiteminc', 'cart_id': cart_id, 'nop': nop },
        success: function (response) {
            if (response == 'success') {
                $(`.cart_nop${cart_id}`).html(nop);
                var subtotal = parseInt($(".subtotal").html());
                subtotal = subtotal + parseInt(p_price);
                $(".subtotal").html(subtotal);
                loadDelChaerg();
            }
        }
    })
}

const cartitemdec = (cart_id, p_price) => {
    var nop = parseInt($(`.cart_nop${cart_id}`).html())
    console.log(nop);

    if (nop > 1) {
        nop--;
        $.ajax({
            url: apiurl,
            type: 'POST',
            data: { 'type': 'cartiteminc', 'cart_id': cart_id, 'nop': nop },
            success: function (response) {
                if (response == 'success') {
                    $(`.cart_nop${cart_id}`).html(nop);
                    var subtotal = parseInt($(".subtotal").html());
                    subtotal = subtotal - parseInt(p_price);
                    $(".subtotal").html(subtotal);
                    loadDelChaerg();
                }
            }
        })

    } else {
        deleteCartItem(cart_id, p_price);
    }
}

const deleteCartItem = (cart_id, p_price) => {
    var nop = parseInt($(`.cart_nop${cart_id}`).html())
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'deleteCartItem2', 'cart_id': cart_id },
        success: function (response) {
            if (response == 'success') {
                showPopup("successfully remove from your cart");
                $(`.cartbox${cart_id}`).hide();
                var subtotal = parseInt($(".subtotal").html());
                subtotal = subtotal - (parseInt((p_price)) * nop);
                $(".subtotal").html(subtotal);
                loadDelChaerg();
            }
        }
    })
}

const loadDelChaerg = () => {
    var subtotal = parseInt($(".subtotal").html());
    if(parseInt(subtotal)==0){
        location.href='home.html';
    }
    var s_area = localStorage.getItem('s_area');
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadDelChaerg', 'subtotal': subtotal, 's_area': s_area },
        success: function (response) {

            if (response != 'error') {
                var data = JSON.parse(response);

                $('.Shippingcharge').html(data[0].del_charge);
                $('.gtotal').html(subtotal + parseInt(data[0].del_charge));
            }else{
                $('.gtotal').html(subtotal);
               
            }
        }
    })
}




const loadAllCuopon = () => {
    $.ajax({
        url: apiurl,
        method: "POST",
        data: { type: "loadAllCuopon" },
        success: function (response) {
            var data = JSON.parse(response);
            console.log(data);
            var coupongrid = "";
            data.forEach((item) => {

                coupongrid += `
          <div class="coupon-grid">
          <div class="coupon-grid-left">
          <h3 class="couponname1">${item.coupon_name}</h3>
          <p>${item.coupon_desc}</p>
          </div>
          <div class="coupon-grid-right">
          <button onclick="useCoupon('${item.coupon_name}')">use</button>
          </div>
          </div>
          `
            })
            $(".coupon-body").html(coupongrid);
        }

    });
}

const useCoupon = (val) => {
    // var couponname =$(`.couponname${c_id}`).html();
    console.log(val);
    $("#couponval").val(val);
    const couponval = document.getElementById("coupon-body-field");
    couponval.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
}

const applyCoupon = () => {

    var coupon_used = localStorage.getItem("coupon_used");







    var userid = localStorage.getItem("mobile");
    var coupon_name = $("#couponval").val();
    var total = $(".gtotal").html();
    // console.log(couponval, total);
    // exit;
    $.ajax({
        url: apiurl,
        method: "POST",
        data: { type: "checkvalidCuopon", 'coupon_name': coupon_name },
        success: function (response) {
            // console.log(response);
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                data.forEach((item) => {
                    var minValue = item.coupon_max_val;
                    var value = item.coupon_val;

                    var coupon_id = item.coupon_id;
                    var coupon_name = item.coupon_name;

                    $.ajax({
                        url: apiurl,
                        method: "POST",
                        data: { type: "checkCouponCode", 'coupon_id': coupon_id, 'userid': userid },
                        success: function (response) {

                            console.log(response);
                            if (response != 'used') {

                                var lcoupon_id = localStorage.getItem("coupon_id");
                                if (parseInt(minValue) <= parseInt(total)) {

                                    if (lcoupon_id != coupon_id) {
                                        $(".gtotal").html(`${(parseInt($(".subtotal").html()) + parseInt($(".Shippingcharge").html())) - parseInt(value)}`);
                                        localStorage.setItem("coupon_id", coupon_id);
                                        localStorage.setItem("coupon_name", coupon_name);
                                        localStorage.setItem("coupon_value", value);
                                        $(".coupon").removeClass("coupon-active");
                                        showPopup("Successfully Coupon Applied");

                                    } else {
                                        showPopup("already Coupon Applied");
                                    }

                                } else {
                                    showPopup(`minimume order should <br> be <b>₹ ${minValue}</b>`);
                                }
                            } else {
                                showPopup("already used");
                            }

                        }
                    })


                    console.log(minValue, value)
                })

            } else {
                showPopup("opps !", "Invalid Coupon Code");
            }

            $(".cover").removeClass("wrapper-overlay");
            $(".wrapper-overlay").removeClass("wrapper-overlay-active");

        }

    });

}

const continueCheckout = () => {
    var total = $(".gtotal").html();
    var subtotal = $(".subtotal").html();
    var del_charge = $('.Shippingcharge').html();
    localStorage.setItem("total_amt", total);
    localStorage.setItem("del_charge", del_charge);
    localStorage.setItem("subtotal", subtotal);
    location.href = "checkout.html";
}




const selectPaymentMethode = (type) => {
    $(".circle2").removeClass("payment-choose");
    $(`.circle2${type}`).addClass("payment-choose");
    localStorage.setItem("payoption", type)
}

const checkOut = () => {

    $(".checkoutbtn").prop("disabled", true);

    // console.log("yes");
    // exit;
    var userid = localStorage.getItem("mobile");
    var subtotal = localStorage.getItem("subtotal");
    var total_amt = localStorage.getItem("total_amt");
    var del_charge = localStorage.getItem("del_charge");
    var idfr = localStorage.getItem("idfr");
    var coupon_id = localStorage.getItem("coupon_id");
    var coupon_value = localStorage.getItem("coupon_value");
    var coupon_name = localStorage.getItem("coupon_name");
    var payoption = localStorage.getItem("payoption");
    var username = $(".username").html();
    var mobile = $(".mobileno").html();
    var address = $(".address").html();
    var pincode = $(".pincode").html();
    var orderNote = $(".pincode").val();

    (coupon_id == null) ? coupon_id = "null" : coupon_id = coupon_id;
    (coupon_value == null) ? coupon_value = "null" : coupon_value = coupon_value;
    (coupon_name == null) ? coupon_name = "null" : coupon_name = coupon_name;
    console.log(
        "userid : ", userid,
        "subtotal : ", subtotal,
        "total_amt : ", total_amt,
        "del_charge : ", del_charge,
        "idfr : ", idfr,
        "coupon_id : ", coupon_id,
        "coupon_value : ", coupon_value,
        "coupon_name : ", coupon_name,
        "payoption : ", payoption,
        "username : ", username,
        "mobile : ", mobile,
        "address : ", address,
        "pincode : ", pincode,
    )

    // exit;
    // checking minimum order amount
    let minimumOrderAmt = 0;
    $.ajax({
        url: apiurl,
        async:false,
        type: 'POST',
        data: { 'type': 'fetcMinimumOrderAmt'},
        success: function (response) {
            minimumOrderAmt = response;
        }
    })

    if(minimumOrderAmt > Number(total_amt)) {
   showPopup(`Minimum Order Amount is Rs. ${minimumOrderAmt}`);
   $(".checkoutbtn").prop("disabled", false);
    }else{
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'checkOut', 'userid': userid, 'subtotal': subtotal, 'total_amt': total_amt, 'del_charge': del_charge, 'idfr': idfr, 'coupon_id': coupon_id, 'coupon_value': coupon_value, 'coupon_name': coupon_name, 'payoption': payoption, 'username': username, 'mobile': mobile, 'address': address, 'pincode': pincode, 'orderNote':orderNote },
        success: function (response) {
            if (response == 'success') {
                showPopup("successfully ordered");
                localStorage.removeItem("idfr");
                localStorage.removeItem("coupon_id");
                localStorage.removeItem("coupon_value");
                localStorage.removeItem("coupon_name");
                localStorage.removeItem("subtotal");
                localStorage.removeItem("del_charge");
                localStorage.removeItem("del_charge");
                localStorage.removeItem("total_amt");
                $(".checkoutbtn").prop("disabled", false);
                setTimeout(() => {
                    location.href = "order.html";
                }, 1500)
            }
        }
    })
    }
}


const loadOrderProduct = () => {
    var userid = localStorage.getItem("mobile");
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadOrderProduct', 'userid': userid },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var orderhistorygrid = "";
                data.forEach(item => {
                    console.log(item);
                    orderhistorygrid += `
                        <div class="order-history">
                    <div class="order-history-header flex space-between">
                        <div class="flex gap-5 justify-star orderheader">
                            <p>Order Number </p>
                            <p>#${item.order_idfr}</p>
                        </div>
                        <p class="orderstatus">${item.status}</p>
                    </div>

                    <div class="shipping flex space-between gap-20">
                        <p>Shipping</p>
                        <div class="shipping-line"></div>
                        <p class="delivery-charge">${item.del_charge}</p>
                    </div>

                    <div class="totalamt flex space-between">
                        <p class="totalamt-title">Total</p>

                        <div class="flex gap-20">
                            <div class="flex gap-5 totalitems" onclick="showallProduct('${item.order_id}','${item.order_idfr}')">
                                <p>all items</p>
                                <div class="showAllProductbtn${item.order_id} showAllProductbtn">
                                    <i class="ri-arrow-down-wide-line"></i>
                                </div>
                            </div>
                            <p class="grandtotal">₹${item.o_total}</p>
                        </div>
                    </div>

                    <div class="total-product total-product${item.order_id}">

                    </div>
                </div>
                        `;
                })
                $(".order-grid").html(orderhistorygrid);
            } else {
                $(".order-grid").html("no data found");
            }
        }
    })

}

const showallProduct = (o_id, idfr) => {
    $(`.showAllProductbtn${o_id}`).toggleClass("rotate");

    var userid = localStorage.getItem("mobile");

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'showOrderProduct', 'idfr': idfr, 'userid': userid },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                var cartprogrid = "";
                data.forEach(item => {

                    var cartRatingBtn;
                    if (item.r_c_val == '1') {
                        cartRatingBtn = `
                        <button  class="rat_pro1${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','1')"><i class="ri-star-fill"></i></button>
                           <button class="rat_pro2${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','2')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro3${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','3')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro4${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','4')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro5${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','5')"><i class="ri-star-fill"></i></button>
                       `;
                    }
                    else if (item.r_c_val == '2') {
                        cartRatingBtn = `
                        <button  class="rat_pro1${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','1')"><i class="ri-star-fill"></i></button>
                           <button class="rat_pro2${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','2')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro3${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','3')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro4${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','4')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro5${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','5')"><i class="ri-star-fill"></i></button>
                       `;
                    }
                    else if (item.r_c_val == '3') {
                        cartRatingBtn = `
                        <button  class="rat_pro1${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','1')"><i class="ri-star-fill"></i></button>
                           <button class="rat_pro2${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','2')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro3${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','3')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro4${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','4')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro5${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','5')"><i class="ri-star-fill"></i></button>
                       `;
                    }
                    else if (item.r_c_val == '4') {
                        cartRatingBtn = `
                         <button  class="rat_pro1${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','1')"><i class="ri-star-fill"></i></button>
                            <button class="rat_pro2${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','2')"><i class="ri-star-fill"></i></button>
                                    <button class="rat_pro3${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','3')"><i class="ri-star-fill"></i></button>
                                    <button class="rat_pro4${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','4')"><i class="ri-star-fill"></i></button>
                                    <button class="rat_pro5${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','5')"><i class="ri-star-fill"></i></button>
                        `;
                    }
                    else if (item.r_c_val == '5') {
                        cartRatingBtn = `
                        <button  class="rat_pro1${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','1')"><i class="ri-star-fill"></i></button>
                           <button class="rat_pro2${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','2')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro3${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','3')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro4${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','4')"><i class="ri-star-fill"></i></button>
                                   <button class="rat_pro5${item.cart_p_id} rat_pro${item.cart_p_id} israted" onclick="rateThisProduct('${item.cart_p_id}','5')"><i class="ri-star-fill"></i></button>
                       `;
                    }
                    else {
                        cartRatingBtn = `
                         <button  class="rat_pro1${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','1')"><i class="ri-star-fill"></i></button>
                            <button class="rat_pro2${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','2')"><i class="ri-star-fill"></i></button>
                                    <button class="rat_pro3${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','3')"><i class="ri-star-fill"></i></button>
                                    <button class="rat_pro4${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','4')"><i class="ri-star-fill"></i></button>
                                    <button class="rat_pro5${item.cart_p_id} rat_pro${item.cart_p_id}" onclick="rateThisProduct('${item.cart_p_id}','5')"><i class="ri-star-fill"></i></button>
                        `;
                    }

                    // if(item.r_c_val!=''){

                    //     for(i=1; i<=item.r_c_val; i++){
                    //     $(`.rat_pro${i}${item.cart_p_id} i`).css("color","#FFCC05");
                    //     }
                    // }


                    cartprogrid += `
                    <div class="order-box flex space-between gap-10">
                            <div class="order-left flex gap-5">
                                <div class="order-img">
                                    <img src="${imgurl + item.cart_p_img}" alt="img">
                                </div>
                                <div class="order-info">
                                    <p class="name">${item.cart_p_name}</p>
                                    <p class="price">₹${item.cart_p_price}</p>
                                    <div class="flex justify-start size gap-5">
                                        <p>${item.cart_p_qty} </p>
                                    </div>
                                </div>
                            </div>
                            <div class="order-right">
                                <div class="order-right-upper">

                                </div>

                                <div class="order-right-lower flex gap-5">
                                   ${cartRatingBtn}
                                </div>
                            </div>
                        </div>

                        
                    `;



                })
                $(`.total-product${o_id}`).html(cartprogrid);
                $(`.total-product${o_id}`).toggleClass("showTotalproduct");

            }
        }
    })
}


const rateThisProduct = (p_id, rating_val) => {
    console.log(p_id, rating_val);
    var userid = localStorage.getItem("mobile");

    $(`.rat_pro${p_id}`).removeClass("israted");

    if (rating_val == '1') {
        $(`.rat_pro1${p_id}`).addClass("israted");
    }
    else if (rating_val == '2') {
        $(`.rat_pro1${p_id}`).addClass("israted");
        $(`.rat_pro2${p_id}`).addClass("israted");
    }
    else if (rating_val == '3') {
        $(`.rat_pro1${p_id}`).addClass("israted");
        $(`.rat_pro2${p_id}`).addClass("israted");
        $(`.rat_pro3${p_id}`).addClass("israted");
    }
    else if (rating_val == '4') {
        $(`.rat_pro1${p_id}`).addClass("israted");
        $(`.rat_pro2${p_id}`).addClass("israted");
        $(`.rat_pro3${p_id}`).addClass("israted");
        $(`.rat_pro4${p_id}`).addClass("israted");
    }
    else if (rating_val == '5') {
        $(`.rat_pro1${p_id}`).addClass("israted");
        $(`.rat_pro2${p_id}`).addClass("israted");
        $(`.rat_pro3${p_id}`).addClass("israted");
        $(`.rat_pro4${p_id}`).addClass("israted");
        $(`.rat_pro5${p_id}`).addClass("israted");
    }

    // exit;
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'rateThisProduct', 'p_id': p_id, 'rating_val': rating_val, 'userid': userid },
        success: function (response) {
            console.log(response)
            if (response != 'error') {
                showPopup("successfully rated this product");
            }
        }
    })


}




const goToOfferProduct = (o_id, offer_name) => {
    location.href = `offer-product.html?o_id=${o_id}&&offer_name=${offer_name}`;
}

const loadOfferEventProduct = () => {

    var cityId = localStorage.getItem("s_city_id");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const offerid = urlParams.get('o_id')
    const offer_name = urlParams.get('offer_name')
    console.log(offerid, offer_name);
    $(".header").html(offer_name);
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadOfferEventProduct', 'offerid': offerid, 'cityId': cityId },
        success: function (response) {
            if (response != 'error') {
                var data = JSON.parse(response);
                var categoryproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }

                    var ratingval; var star;
                    (item.rating_id == null) ? ratingval = getRandomNumber() : ratingval = item.rating_val / item.rating_nop;
                    ratingval = ratingval.toFixed(1);
                    console.log(ratingval);

                    if (parseInt(ratingval) < 2) {
                        star = onestar;
                    }
                    else if (parseInt(ratingval) < 3) {
                        star = twostar;
                    }
                    else if (parseInt(ratingval) < 4) {
                        star = threestar;
                    }
                    else if (parseInt(ratingval) < 5) {
                        star = fourstar;
                    }
                    else if (parseInt(ratingval) < 6) {
                        star = fivestar;
                    }

                    categoryproductgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>${ratingval}</p>
                           ${star}
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".wishlistgrid").html(categoryproductgrid);
                checkWishlist()
            } else {
                $(".wishlistgrid").html("no items found");
            }
        }
    })
}



const logout = () => {
    localStorage.removeItem("login_status");
    localStorage.clear();
    location.href = "login.html";
}


const searchProduct = () => {
    // $(".footerdiv").hide();
    var searchproduct = $("#searchproduct").val();
    var cityId = localStorage.getItem("s_city_id");
    if (searchproduct == "") {
        $(".search-result").hide()
        // $(".footerdiv").show();
        return;
    }
    console.log(searchproduct);

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'searchProduct', 'product': searchproduct, 'cityId': cityId },
        success: function (response) {
            $(".search-result").show()
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                var searchgrid = "";
                data.forEach(item => {
                    searchgrid += `
                    <div class="search-product ">
                        <div class="flex gap-10 justify-start items-start">
                            <div class="search-img">
                                <img src="${imgurl + item.p_imgurl}" alt="img">
                            </div>
                            <div class="search-product-info">
                                <p>${item.p_name}</p>
                                <p>₹${item.price}</p>
                                <p>${item.quantity}</p>
                            </div>
                        </div>
                        <div class="showpro flex" onclick="goToSingleProduct(${item.p_id})">
                            <i class="ri-arrow-right-wide-line"></i>
                        </div>
                    </div>
                    `;
                })
                $(".search-result").html(searchgrid);
            } else {
                $(".search-result").html("no items found");
            }
        }
    })
}



$(".warpper").click(() => {
    $(".search-result").hide();
    $("#searchproduct").val("")
})


const goToCatProSearch = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id')
    const cat_name = urlParams.get('cat_name')
    console.log(c_id, cat_name);
    location.href = `search-category-product.html?id=${c_id}&&cat_name=${cat_name}`;
}

loadSearchProData = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id')
    const cat_name = urlParams.get('cat_name')
    $(".header").html(cat_name);
}

const searchProduct2 = () => {
    var searchproduct = $("#searchproduct").val();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const c_id = urlParams.get('id')
    if (searchproduct == "") {
        $(".search-result").hide()
        return;
    }
    console.log(searchproduct);

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'searchProduct2', 'product': searchproduct, 'c_id': c_id },
        success: function (response) {
            $(".search-result").show()
            if (response != 'error') {
                var data = JSON.parse(response);
                console.log(data);
                var searchgrid = "";
                var categoryproductgrid = "";
                data.forEach(item => {
                    var items = JSON.stringify(item);
                    var offer = ((parseInt(item.mrp) - parseInt(item.price)) / parseInt(item.mrp)) * 100;
                    offer = Math.trunc(offer);
                    console.log(typeof offer, item.mrp);
                    if (item.mrp != '') {
                        var offerdiv = ` <div class="best-offer">
                       <p>${offer}%</p>
                       <p>OFF</p>
                   </div>`
                    } else {
                        offerdiv = "";
                    }
                    categoryproductgrid += `
                    <div class="newly-launch-product product-box">
                    <div class="newly-launch-product-img flex">
                        <img src="${imgurl + item.p_imgurl}" alt="img" onclick="goToSingleProduct(${item.p_id})">
                       ${offerdiv}
                       <div class="whislistbtn whislistbtn${item.p_id}" onclick="addToWishlist(${item.p_id})">
                       <i class="ri-heart-3-fill "></i>
                       </div>
                    </div>
                    <div class="newly-launch-product-name">
                        <p>${item.p_name}</p>
                    </div>
                    <div class="newly-launch-product-rating-qty flex gap-10 justify-start">
                        <p>${item.quantity}</p>
                        <div class="flex rating">
                            <p>4.2</p>
                            <i class="ri-star-s-fill israting"></i>
                            <i class="ri-star-s-fill israting"></i>
                            <i class="ri-star-s-fill israting"></i>
                            <i class="ri-star-s-fill israting"></i>
                            <i class="ri-star-s-fill israting"></i>
                        </div>
                    </div>
                    <div class="newly-launch-product-price flex space-between">
                        <div class="flex gap-10">
                            <p>₹ ${item.price}</p>
                            <p class="newly-fake-price"><del>₹ ${item.mrp}</del></p>
                        </div>
                        <div class="addtocartdiv${item.p_id}">
                            <button class="addtocart" onclick='addToCart(${items})'>Add</button>
                        </div>
                    </div>
                </div>
                        `;

                })
                $(".wishlistgrid").html(categoryproductgrid);
                checkWishlist();
            } else {
                $(".wishlistgrid").html("no items found");
            }
        }
    })
}



function saveEditData() {

    var username = $("#username").val();
    var mobile = $("#mobile").val();

    var email = localStorage.getItem("email");


    if (username == "") {
        showPopup("please enter valid name");
        return;
    }
    else if (mobile == "" || mobile.length < 10 || mobile.length > 10) {

        showPopup("please enter valid number");
        return;
    }

    console.log(username, mobile);


    $(".wrapper-overlay").removeClass("wrapper-overlay-active");
    $(".edit-profile").removeClass("edit-profile-active");


    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'saveEditProfile', 'email': email, 'mobile': mobile, 'username': username },
        success: function (response) {
            if (response != 'error') {
                showPopup("successfully updated");
                localStorage.setItem("username", username);
                localStorage.setItem("mobile", mobile);
                setTimeout(() => {
                    location.reload();
                }, 500)
            }
        }
    })
}



const loadAppLink = () => {

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadAppLink' },
        success: function (response) {
            console.log(response);
            var data = JSON.parse(response);

            $("#applink").val(data[0].app_link);
        }
    })
}

const shareApp = () => {
    var copyText = document.getElementById("applink");

    if (copyText.value == 'null') {
        showPopup("coming soon");
    } else {

        // copyText.select();
        // copyText.setSelectionRange(0, 99999);
        // navigator.clipboard.writeText(copyText.value);
        // showPopup("Copied link successfully ");
        window.plugins.socialsharing.share(copyText.value);
    }

}


const checkUpdate = () => {
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadAppLink' },
        success: function (response) {
            var data = JSON.parse(response);
            console.log(data);
            if (data[0].update_status != 'null') {
                var update_status = localStorage.getItem("update_status");
                var app_version = localStorage.getItem("app_version");
                if (update_status != 'true' || app_version != data[0].app_version) {
                    $(".appupdate").addClass("appupdate-active");

                    $(".updatebtn1div").html(`
                        <button class="updatebtn updatebtn1" onclick="updateApp('${data[0].app_link}','${data[0].app_version}')">Update App</button>
                        `);
                }
            } else {
                localStorage.setItem("app_version", data[0].app_version);
            }
        }
    })
}


const remindmelater = () => {
    $(".appupdate").removeClass("appupdate-active");

}
const updateApp = (app_link, app_version) => {
    localStorage.setItem("app_version", app_version);
    localStorage.setItem("update_status", 'true');
    $(".appupdate").removeClass("appupdate-active");
    console.log(app_link, app_version);

    window.open(app_link);

}










$(".back").click(() => {
    history.back();
})


$(".ri-home-3-line").click(() => {
    location.href = "home.html";
})

$(".ri-grid-fill").click(() => {
    location.href = "category.html";
})
$(".footer-icon .ri-heart-line").click(() => {
    location.href = "wishlist.html";
})
$(".footer-icon .ri-shopping-cart-2-line").click(() => {
    location.href = "order.html";
})
$(".footer-icon .ri-service-line").click(() => {
    location.href = "service.html";
})
$(".footer-icon .ri-shopping-cart-line").click(() => {
    location.href = "cart.html";
})
$(".user-icon img").click(() => {
    location.href = "profile.html";
})

function loadAdminContactData() {
    $.ajax({
        url: apiurl,
        method: "POST",
        data: { type: "loadAdminContactData" },
        success: function (response) {
            var data = JSON.parse(response);
            let phone = '';
            let whp = '';
            let email = '';
            data.forEach(item => {
                if (item.contact_type === "mobile") {
                    phone += `<a href="tel:${item.contact_detail}">+91-${item.contact_detail}</a> `;
                } else if (item.contact_type === "whatsapp") {
                    whp += `<a href="https://wa.me/+91${item.contact_detail}">+91-${item.contact_detail}</a> `;
                    $(".whtasappicon").html(`
                <i class="ri-whatsapp-line whatsapp-icon" onclick="location.href='https://wa.me/+91${item.contact_detail}'"></i>
                `);
                    $(".whatsappiconhome").html(`
                <i class="ri-whatsapp-line" onclick="location.href='https://wa.me/+91${item.contact_detail}'"></i>
                `);
                    $('.bag i').attr('onclick', `location.href='https://wa.me/+91${item.contact_detail}'`);
                } else {
                    email += `<a href="mailto:${item.contact_detail}">${item.contact_detail}</a>`;
                }
            });
            $('#phoneNumbers').html(phone);
            $('#waNumber').html(whp);
            $('#mailCon').html(email);
        }

    });
}

function loadCartCount() {
    var userid = localStorage.getItem("mobile");

    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'loadCartCount', 'userid': userid },
        success: function (response) {
            if (response != 'error') {
                console.log(response);
                if (parseInt(response) == 0) {
                    $(".count").hide();
                } else {
                    $(".count").show();
                    $(".count").html(response);
                }
            } else {
                $(".count").hide();
            }
        }
    })
}

function fetchServices() {
    let userId = localStorage.getItem('mobile');
    let s_city_id = localStorage.getItem('s_city_id');
    $.ajax({
        url: apiurl,
        type: 'POST',
        data: { 'type': 'fetchServices' },
        success: function (response) {
                var data = JSON.parse(response);
                var services = "";
                data.forEach(item => {
                    if(s_city_id == item.city_id) {
                    let thumbClass = 'ri-thumb-up-line';
                    if(item.userIds) {
                    if(item.userIds.includes(userId)) {
                        thumbClass = 'ri-thumb-up-fill'
                    }
                    }
                    let likedNum = 0;
                    if(item.liked) {
                        likedNum = item.liked; 
                    }
                    services += `
                    <div class="service-box">
                <div class="img-section">
                    <img src="${imgurl+item.image}" alt="img">
                    <div class="whatsapp flex gap-5" >
                        <i class="ri-whatsapp-line"></i>
                        <a href="https://wa.me/+91${item.whatsapp_no}" >+91-${item.whatsapp_no}</a>
                    </div>

                    <div  class="call flex gap-5">
                        <i class="ri-phone-line"></i>
                        <a href="tel:+91${item.calling_no}">+91-${item.calling_no}</a>
                    </div>
                </div>
              

                <div class="contactinfo">
                    <div class="para">
                        <p>${item.serv_for}</p>
                    </div>
                    <div class="name">
                        <p>${item.name}</p>
                    </div>
                  
                    <div class="desc flex justify-start gap-5">
                        <p>${item.description}</p>
                        <span class="dot"></span>
                        <i class="${thumbClass}" onclick="hitLike(${item.service_id})"></i>
                        <p>${likedNum}</p>
                        <p class="exp-p">Expires on ${item.expiry_date}</p>
                    </div>
                </div>
            </div>
                    `;
                }
                })
                $(".main").html(services);
            }
        
    })
}
function hitLike(servId) {
let e = event.currentTarget;
let userId = localStorage.getItem('mobile');
let currLiked = Number($(e).next().html());

if(!$(e).hasClass('ri-thumb-up-fill')) {
$(e).removeClass('ri-thumb-up-line');
$(e).addClass('ri-thumb-up-fill');
 $(e).next().html(currLiked+1);
}else{
$(e).removeClass('ri-thumb-up-fill');
$(e).addClass('ri-thumb-up-line');
 $(e).next().html(currLiked-1);    
}
$.ajax({
    url: apiurl,
    type: 'POST',
    data: { 'type': 'hitLike', 'userId':userId, 'servId':servId },
    success: function (res) {
    if(res == 'error') {
    $(e).removeClass('ri-thumb-up-fill');
    $(e).addClass('ri-thumb-up-line');
    showPopup('Your liked is not published due to internal error');
    }
}
});
}

const allCategoryList=()=>{
    $.ajax({
        url:apiurl,
        type:'POST',
        data:{'type':'loadcategory'},
        success:function(response){
            var data =JSON.parse(response);
            console.log(data);
            var optiongrid ="";
            data.forEach(item=>{
                optiongrid +=`
                <option value="${item.c_id}">${item.cat_name}</option>
                `;
            });
            $("#undercat").append(optiongrid);
        }
    })
}
const becomeMerchantReq = () => {

    let MfirstNm = $('#MfirstNm').val();
    let MlastNm = $('#MlastNm').val();
    let MshopNm = $('#MshopNm').val();
    let MbusinessEmail = $('#MbusinessEmail').val();
    let MbusinessPh = $('#MbusinessPh').val();
    let MstreetAdd1 = $('#MstreetAdd1').val();
    let MstreetAdd2 = $('#MstreetAdd2').val();
    let Mstate = $('#Mstate').val();
    let Mcity = $('#Mcity').val();
    let Mdistrict = $('#Mdistrict').val();
    let MpinCode = $('#MpinCode').val();
    let MbusinessType = $('#MbusinessType').val();
    let undercat = $('#undercat').val();
    let MadharNo = $('#MadharNo').val();
    let MpanNo = $('#MpanNo').val();
    let MshopImg = $('#MshopImg')[0].files[0];
    let MadharImg = $('#MadharImg')[0].files[0];
    let MpanImg = $('#MpanImg')[0].files[0];
    let ManyShopImg = $('#ManyShopImg')[0].files[0];

    const formData = new FormData();
    formData.append('type','becomeMerchantReq');
    formData.append('MfirstNm',MfirstNm);
    formData.append('MlastNm',MlastNm);
    formData.append('MshopNm',MshopNm);
    formData.append('MbusinessEmail',MbusinessEmail);
    formData.append('MbusinessPh',MbusinessPh);
    formData.append('MstreetAdd1',MstreetAdd1);
    formData.append('MstreetAdd2',MstreetAdd2);
    formData.append('Mstate',Mstate);
    formData.append('Mcity',Mcity);
    formData.append('Mdistrict',Mdistrict);
    formData.append('MpinCode',MpinCode);
    formData.append('MbusinessType',MbusinessType);
    formData.append('undercat',undercat);
    formData.append('MadharNo',MadharNo);
    formData.append('MpanNo',MpanNo);
    formData.append('MshopImg',MshopImg);
    formData.append('MadharImg',MadharImg);
    formData.append('MpanImg',MpanImg);
    formData.append('ManyShopImg',ManyShopImg);

    $.ajax({
        url:apiurl,
        type:'POST',
        data:formData,
        contentType:false,
        processData:false,
        success:function(res){
            if(res == 'done') {
                showPopup('Request sent');
            setTimeout(() => {
             location.reload();
           }, 1550);
            }
        }
    }) 
}

// send forget password request

const sendRequest =()=>{
    var fmobile=$("#fmobile").val();
    if(fmobile.length<10 || fmobile.length>10){
        showPopup("please enter valid mobile number");
        return;
    }

    

    $.ajax({
        url:apiurl,
        type:'POST',
        data:{'type':'forgetPassword','fmobile':fmobile},
        success:function(response){
            if(response!='error'){
                $(".wrapper-overlay").removeClass("wrapper-overlay-active");
                $(".forget-password-modal").removeClass("edit-profile-active");
                showPopup("password sent in your gmail");
            }else{
                showPopup("user does not found");
            }
        }
    })
}