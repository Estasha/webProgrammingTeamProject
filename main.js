/*모바일 환경에서 우상단 메뉴 버튼 클릭 시 오른쪽에서부터 슬라이드 형식으로 메뉴가 등장*/

document.addEventListener("DOMContentLoaded", function() {

    let mobileMenu = document.getElementById("mobileMenu");
    let slideMenu = document.getElementById("slideMenu");
    let closeMenu = document.getElementById("closeMenu");

    if (mobileMenu && slideMenu && closeMenu) {
        mobileMenu.addEventListener("click", function() {
            slideMenu.classList.add("active");
        });

        closeMenu.addEventListener("click", function() {
            slideMenu.classList.remove("active");
        });

        // 메뉴 외부 클릭 시 메뉴 닫기
        document.addEventListener("click", function(event) {
            if (!slideMenu.contains(event.target) && event.target !== mobileMenu) {
                slideMenu.classList.remove("active");
            }
        });
        
    } else {
        console.error("메뉴 요소를 찾을 수 없습니다:", {
            mobileMenu: !!mobileMenu,
            slideMenu: !!slideMenu,
            closeMenu: !!closeMenu
        });
    }
});

