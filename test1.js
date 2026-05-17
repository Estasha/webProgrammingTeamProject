// ─── DOMContentLoaded: DOM이 완전히 파싱된 후 스크립트 실행 ─────────────────
// 스크립트가 <head>에 있으면 브라우저가 body HTML을 아직 읽지 않은 상태에서
// 스크립트를 실행한다. 이때 getElementById/querySelector는 null을 반환하고,
// null에 onclick을 할당하려 하면 TypeError가 발생해 페이지가 멈춘다.
// DOMContentLoaded 이벤트는 HTML 파싱이 끝난 시점에 발생하므로
// 이 안에서 DOM 요소를 참조하면 항상 정상적으로 가져온다.
document.addEventListener('DOMContentLoaded', function() {

    // ─── 1. DOM 요소 참조 ─────────────────────────────────────────────────
    let stepText     = document.getElementById('stepText');       // 'Q1 / 12' 텍스트
    let percentText  = document.getElementById('percentText');    // '0%' 텍스트
    let progressFill = document.getElementById('progressFill');   // 진행 바 채우기 div
    let questionTitle = document.getElementById('questionTitle'); // 질문 본문 텍스트
    let button1 = document.querySelector('.option:nth-child(1)'); // 선택지 1 버튼
    let button2 = document.querySelector('.option:nth-child(2)'); // 선택지 2 버튼

    // ─── 2. 현재 질문 인덱스 ──────────────────────────────────────────────
    // -1 : 초기 상태 — HTML에 Q1이 이미 표시되어 있음, 아직 아무것도 클릭 안 함
    //  0 : Q1 클릭 후 → Q2(questions[0])를 화면에 표시해야 하는 상태
    //  ...
    // 10 : Q11 클릭 후 → Q12(questions[10])를 표시해야 하는 상태
    // 11 : Q12 클릭 후 → 모든 질문 완료, 결과 표시
    let currentIndex = -1;

    // ─── 3. MBTI 점수 합산 변수 ───────────────────────────────────────────
    // option1(E/S/T/J 성향)을 선택할 때마다 해당 차원 점수를 1 올린다.
    // 차원당 3문항이므로 최대 3점.
    // 합산 점수가 1.5 초과이면 첫 번째 글자(E/S/T/J), 이하이면 두 번째 글자(I/N/F/P)
    let eiSum = 0; // E(+) vs I — 담당 문항: Q1, Q2, Q3
    let snSum = 0; // S(+) vs N — 담당 문항: Q4, Q5, Q6
    let tfSum = 0; // T(+) vs F — 담당 문항: Q7, Q8, Q9
    let jpSum = 0; // J(+) vs P — 담당 문항: Q10, Q11, Q12

    // ─── 4. 진행 표시 배열 ────────────────────────────────────────────────
    // Q1은 HTML에 이미 'Q1 / 12', '0%'로 하드코딩되어 있으므로 배열에 없다.
    // 버튼 클릭 후 화면에 표시할 Q2~Q12의 진행 정보만 담는다.
    let steps = [
        'Q2 / 12', 'Q3 / 12', 'Q4 / 12',  'Q5 / 12',  'Q6 / 12',
        'Q7 / 12', 'Q8 / 12', 'Q9 / 12', 'Q10 / 12', 'Q11 / 12', 'Q12 / 12'
    ];

    // 각 질문에 답한 직후 표시할 진행률 (Q1 답 → 8.3%, ... Q12 답 → 100%)
    // percent[i]는 (i+1)번째 질문에 답한 후의 진행률이다.
    // percentText와 progressFill.style.width에 동일한 값을 사용한다.
    let percent = [
        '8.3%', '16.6%', '25%',  '33.3%', '41.6%',
        '50%',  '58.3%', '66.6%', '75%',  '83.3%', '91.6%', '100%'
    ];

    // ─── 5. 질문 및 선택지 배열 ───────────────────────────────────────────
    // questions[i], option1[i], option2[i]가 동일한 인덱스로 매핑된다.
    // 인덱스 0이 Q2, 인덱스 10이 Q12에 해당한다.
    let questions = [
        '모르는 에러가 터졌을 때?',              // Q2  (index  0) — EI 차원
        '코딩하기 좋은 장소는?',                 // Q3  (index  1) — EI 차원
        '새로운 기술을 배울 때 나는?',           // Q4  (index  2) — SN 차원
        '주석(Comment)을 달 때?',               // Q5  (index  3) — SN 차원
        '프로젝트 주제를 정할 때?',              // Q6  (index  4) — SN 차원
        '팀원이 내 코드를 보고 피드백을 준다면?', // Q7  (index  5) — TF 차원
        '팀원이 에러 때문에 힘들어하고 있다면?',  // Q8  (index  6) — TF 차원
        '코드 리뷰에서 가장 중요한 것은?',       // Q9  (index  7) — TF 차원
        '과제를 시작하는 시점은?',               // Q10 (index  8) — JP 차원
        '변수 이름을 지을 때 나는?',             // Q11 (index  9) — JP 차원
        '깃허브(GitHub) 커밋은 언제 하나요?'    // Q12 (index 10) — JP 차원
    ];

    // option1 = E/S/T/J 성향 선택지 (이걸 고르면 해당 차원 +1)
    let option1 = [
        '단톡방이나 옆 친구에게 바로 물어본다',
        '적당한 소음이 있는 카페나 과방',
        '검증된 공식 문서와 교재로 공부한다',
        '나중에 봐도 이해되게 꼼꼼히 설명한다',
        '실생활에 바로 쓸 수 있는 실용적인 앱',
        '"성능 개선에 도움 되겠네" (논리적 수용)',
        '에러 메시지를 같이 보며 원인을 찾는다',
        '메모리 효율과 정확한 로직 체크',
        '공지 올라온 당일, 계획부터 세운다',
        '카멜 케이스 등 규칙을 엄격히 지킨다',
        '기능 하나 완성할 때마다 쪼개서 한다'
    ];

    // option2 = I/N/F/P 성향 선택지 (이걸 고르면 점수 변화 없음)
    let option2 = [
        '혼자 구글링과 GPT로 끝까지 파헤친다',
        '아무도 없는 조용한 내 방 책상',
        '일단 예제 코드부터 실행하며 감을 잡는다',
        '코드가 곧 주석이다, 최소한만 적는다',
        '아무도 생각 못한 혁신적이고 복잡한 앱',
        '"내 코드가 별로인가..?" (살짝 상처받음)',
        '고생 많다고 맛있는 걸 사주며 응원한다',
        '가독성과 팀원의 코딩 스타일 존중',
        '마감 직전, 아드레날린이 솟구칠 때',
        '그때그때 생각나는 대로 짓는다 (a, b, temp)',
        '구현 다 끝나고 한꺼번에 몰아서 한다'
    ];

    // ─── 6. 점수 기록 함수 ────────────────────────────────────────────────
    // option1(E/S/T/J 성향)을 골랐을 때만 해당 차원 점수를 1 올린다.
    // option2를 골랐을 때는 아무것도 하지 않는다.
    //
    // MBTI 차원별 담당 문항과 currentIndex 범위:
    //   EI: Q1(currentIndex = -1), Q2(0), Q3(1)
    //   SN: Q4(2), Q5(3), Q6(4)
    //   TF: Q7(5), Q8(6), Q9(7)
    //   JP: Q10(8), Q11(9), Q12(10)
    function recordScore(isOption1) {
        if (!isOption1) return; // option2 선택 시 점수 변화 없음

        if (currentIndex <= 1) {        // Q1(-1), Q2(0), Q3(1) → EI 차원
            eiSum++;
        } else if (currentIndex <= 4) { // Q4(2), Q5(3), Q6(4) → SN 차원
            snSum++;
        } else if (currentIndex <= 7) { // Q7(5), Q8(6), Q9(7) → TF 차원
            tfSum++;
        } else {                        // Q10(8), Q11(9), Q12(10) → JP 차원
            jpSum++;
        }
    }

    // ─── 7. 화면 업데이트 함수 ────────────────────────────────────────────
    // nextIndex에 해당하는 질문·선택지·진행 상태를 화면에 표시한다.
    // button1/button2 안의 <span>만 교체해 버튼의 CSS 구조를 유지한다.
    // progressFill.style.width에는 '8.3%'처럼 숫자+단위만 넣어야 한다.
    // (이전 코드의 'width: 8.3%'는 CSS 속성명까지 포함한 잘못된 값이었다.)
    function showNextQuestion(nextIndex) {
        stepText.textContent  = steps[nextIndex];
        percentText.textContent = percent[nextIndex];
        progressFill.style.width = percent[nextIndex];
        questionTitle.textContent = questions[nextIndex];
        button1.querySelector('span').textContent = option1[nextIndex];
        button2.querySelector('span').textContent = option2[nextIndex];
    }

    // ─── 8. 결과 표시 함수 ────────────────────────────────────────────────
    // 12문항을 모두 완료한 뒤 호출된다.
    // 합산 점수가 1.5 초과이면 첫 번째 글자(E/S/T/J), 이하이면 두 번째 글자(I/N/F/P)
    function showResult() {
        percentText.textContent = '100%';
        progressFill.style.width = '100%';

        let EI = eiSum > 1.5 ? 'E' : 'I';
        let SN = snSum > 1.5 ? 'S' : 'N';
        let TF = tfSum > 1.5 ? 'T' : 'F';
        let JP = jpSum > 1.5 ? 'J' : 'P';
        let mbti = EI + SN + TF + JP;

        // TODO: 결과 페이지로 이동하는 로직으로 교체
        // 예: window.location.href = 'result.html?type=' + mbti;
        alert('당신의 개발자 MBTI: ' + mbti);
    }

    // ─── 9. 버튼 이벤트 등록 ──────────────────────────────────────────────
    // onclick 대신 addEventListener를 사용한다.
    // onclick은 한 번에 하나의 핸들러만 등록할 수 있지만,
    // addEventListener는 여러 핸들러를 중복 등록할 수 있어 확장에 유리하다.
    //
    // ── 이전 코드의 세 가지 버그 ──────────────────────────────────────────
    // [버그 1] DOM이 준비되기 전 실행
    //   DOMContentLoaded 없이 <head>에서 querySelector → null 반환 → TypeError
    //
    // [버그 2] 빈 onclick 핸들러
    //   button1.onclick = function() {};  → 클릭해도 아무것도 안 함
    //
    // [버그 3] for 루프가 이벤트 기반이 아님
    //   for 루프는 페이지 로드 즉시 동기적으로 11번 전부 실행된다.
    //   if (button1.onclick) 는 "버튼이 클릭됐는가?"가 아니라
    //   "onclick에 함수가 할당돼 있는가?"를 확인한다 → 항상 true

    button1.addEventListener('click', function() {
        recordScore(true); // option1 선택 → E/S/T/J 성향 점수 +1
        currentIndex++;    // 다음 질문으로 이동

        if (currentIndex < questions.length) {
            showNextQuestion(currentIndex); // 다음 질문 표시
        } else {
            showResult(); // 모든 질문 완료 → 결과 표시
        }
    });

    button2.addEventListener('click', function() {
        recordScore(false); // option2 선택 → 점수 변화 없음
        currentIndex++;     // 다음 질문으로 이동

        if (currentIndex < questions.length) {
            showNextQuestion(currentIndex); // 다음 질문 표시
        } else {
            showResult(); // 모든 질문 완료 → 결과 표시
        }
    });

}); // DOMContentLoaded 끝
