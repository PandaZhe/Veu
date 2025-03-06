  // 下拉菜單
  $(document).ready(function() {
    // 點擊 m_main 時顯示對應的 m_toB
    $("#content .div_box").click(function() {
      let $toB = $(this).find(".m_toB"); // 取得該 m_main 內的 m_toB

      // 如果該 m_toB 已經顯示，則隱藏它
      if ($toB.is(":visible")) {
        $toB.slideUp();
        $(this).css('color', 'initial');
      } else {
        // 先將其他 m_toB 隱藏，再顯示當前的 m_toB
        $(".m_toB").slideUp();
        $toB.slideDown();
        // 先將m_main顏色變回預設，再改變當前m_main顏色
        $("#content .div_box").css('color', 'initial');
        $(this).css('color', 'blue');
      }
    });
  });
