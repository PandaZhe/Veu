// 下拉菜單
$(document).ready(function () {
  $("#content .m_main .bigImgBox").click(function () {
    let $toB = $(this).siblings(".m_toB"); 

    if ($toB.is(":visible")) {
      $toB.slideUp();
    } else {
      $toB.slideDown();
      $toB.css('display', 'grid');
    }
  });

});
