$(document).ready(function() {
  $("#link-read-more-notif").bind("click", function() {
    let skipNumber = $("ul.list-notifications").find("li").length;

    $("#link-read-more-notif").css("display", "none");
    $(".read-more-loader").css("display", "inline-block");

    setTimeout(() => {
      $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(
        notifications
      ) {
        if (!notifications.length) {
          alertify.notify("Bạn không còn thông báo nào", "error", 7);

          $("#link-read-more-notif").css("display", "inline-block");
          $(".read-more-loader").css("display", "none");

          return false;
        }

        notifications.forEach(function(notification) {
          $("ul.list-notifications").append(`<li>${notification}</li>`); // modal notif
        });

        $("#link-read-more-notif").css("display", "block");
        $(".read-more-loader").css("display", "none");
      });
    }, 100);
  });
});
