$(document).ready(function () {
  // console.log("hallo");
  var _url = "https://my-json-server.typicode.com/baguscs/apiPwa/products";
  var dataResults = "";
  var catResults = "";
  var categories = [];

  function renderPage(data) {
    $.each(data, function (key, items) {
      _cat = items.category;

      dataResults +=
        "<div>" + "<h3>" + items.name + "</h3>" + "<p>" + _cat + "</p>";
      ("</div>");

      if ($.inArray(_cat, categories) == -1) {
        categories.push(_cat);
        catResults += "<option value'" + _cat + "'>" + _cat + "</option>";
      }
    });

    $("#products").html(dataResults);
    $("#cat_select").html("<option value='all'>Semua</option>" + catResults);
  }

  var networkDataReceived = false;

  //fresh data from online
  var networkUpdate = fetch(_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      networkDataReceived = true;
      renderPage(data);
    });

  //return data from cache
  caches
    .match(_url)
    .then(function (response) {
      if (!response) throw Error("tidak ada data di cache");
      return response.json();
    })
    .then(function (data) {
      if (!networkDataReceived) {
        renderPage(data);
        console.log("render data dari cache");
      }
    })
    .catch(function () {
      return networkUpdate;
    });

  //fungsi filter
  $("#cat_select").on("change", function () {
    updateProduct($(this).val());
  });

  function updateProduct(cat) {
    var dataResults = "";
    var _newUrl = _url;
    if (cat != "all") {
      _newUrl = _url + "?category=" + cat;
    }

    $.get(_newUrl, function (data) {
      $.each(data, function (key, items) {
        _cat = items.category;

        dataResults +=
          "<div>" + "<h3>" + items.name + "</h3>" + "<p>" + _cat + "</p>";
        ("</div>");
      });

      $("#products").html(dataResults);
    });
  }
});

//service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/serviceworker.js").then(
      function (registration) {
        //registasi berhasil
        console.log(
          "registrasi service worker berhasil dengan scope: ",
          registration.scope
        );
      },
      function (err) {
        //registrasi gagal
        console.log("registrasi gagal", err);
      }
    );
  });
}
