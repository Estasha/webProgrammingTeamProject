/* 모바일 슬라이드 메뉴 동작 담당 */

/* HTML 파싱이 완전히 끝난 후 실행 — 스크립트가 <head>에 있어도 요소를 안전하게 참조할 수 있음 */
document.addEventListener("DOMContentLoaded", function() {

    /* 메뉴 관련 요소 참조 */
    let mobileMenu = document.getElementById("mobileMenu");   /* 햄버거 버튼 (≤1024px에서만 표시) */
    let slideMenu  = document.getElementById("slideMenu");    /* 오른쪽에서 슬라이드 인 되는 드로어 */
    let closeMenu  = document.getElementById("closeMenu");    /* 드로어 안의 × 닫기 버튼 */

    /* 세 요소가 모두 존재할 때만 이벤트 등록 — 테스트 페이지처럼 구조가 다른 페이지에서 오류 방지 */
    if (mobileMenu && slideMenu && closeMenu) {

        /* 햄버거 버튼 클릭 → active 클래스 추가 → CSS transition으로 드로어가 오른쪽에서 슬라이드 인 */
        mobileMenu.addEventListener("click", function() {
            slideMenu.classList.add("active");
        });

        /* × 버튼 클릭 → active 클래스 제거 → 드로어가 화면 밖으로 슬라이드 아웃 */
        closeMenu.addEventListener("click", function() {
            slideMenu.classList.remove("active");
        });

        /* 메뉴 외부 클릭 시 메뉴 닫기 */
        /* slideMenu 영역 밖을 클릭했고, 햄버거 버튼도 아닐 때만 닫음 (햄버거 클릭은 위 핸들러가 처리) */
        document.addEventListener("click", function(event) {
            if (!slideMenu.contains(event.target) && event.target !== mobileMenu) {
                slideMenu.classList.remove("active");
            }
        });

    } else {
        /* 필수 요소가 없으면 콘솔에 어떤 요소가 누락됐는지 출력 */
        console.error("메뉴 요소를 찾을 수 없습니다:", {
            mobileMenu: !!mobileMenu,
            slideMenu: !!slideMenu,
            closeMenu: !!closeMenu
        });
    }
});
