// ─── DOMContentLoaded: DOM이 완전히 파싱된 후 스크립트 실행 ─────────────────
// 스크립트가 <head>에 있으므로 DOMContentLoaded 안에서만 DOM 요소에 접근한다.
document.addEventListener('DOMContentLoaded', function() {

    // ─── 1. DOM 요소 참조 ────────────────────────────────────────────────────
    let stepText      = document.getElementById('stepText');
    let percentText   = document.getElementById('percentText');
    let progressFill  = document.getElementById('progressFill');
    let questionTitle = document.getElementById('questionTitle');
    let button1 = document.querySelector('.option:nth-child(1)'); // E/F/A 성향 버튼
    let button2 = document.querySelector('.option:nth-child(2)'); // I/T/C 성향 버튼

    // ─── 2. 현재 질문 인덱스 ─────────────────────────────────────────────────
    // -1 : 초기 상태 — HTML에 Q1이 이미 표시되어 있음
    //  0 : Q1 클릭 후 → Q2(questions[0])를 표시
    // 10 : Q11 클릭 후 → Q12(questions[10])를 표시
    // 11 : Q12 클릭 후 → 모든 질문 완료, 결과 이동
    let currentIndex = -1;

    // ─── 3. 인간관계 유형 점수 합산 변수 ─────────────────────────────────────
    // option1(E/F/A 성향)을 선택할 때마다 해당 차원 점수를 1 올린다.
    // 차원당 4문항이므로 최대 4점.
    // 합산 점수 > 2 이면 첫 번째 글자(E/F/A), 이하이면 두 번째 글자(I/T/C)
    let eiSum = 0; // E(+) vs I — 담당 문항: Q1(index -1), Q2(0), Q3(1), Q4(2)
    let ftSum = 0; // F(+) vs T — 담당 문항: Q5(3), Q6(4), Q7(5), Q8(6)
    let acSum = 0; // A(+) vs C — 담당 문항: Q9(7), Q10(8), Q11(9), Q12(10)

    // ─── 4. 진행 표시 배열 ───────────────────────────────────────────────────
    // Q1은 HTML에 이미 'Q1 / 12', '0%'로 하드코딩되어 있으므로 배열에 없다.
    let steps = [
        'Q2 / 12', 'Q3 / 12', 'Q4 / 12',  'Q5 / 12',  'Q6 / 12',
        'Q7 / 12', 'Q8 / 12', 'Q9 / 12', 'Q10 / 12', 'Q11 / 12', 'Q12 / 12'
    ];

    // percentText와 progressFill.style.width에 동일한 값을 사용한다.
    let percent = [
        '8.3%', '16.6%', '25%',  '33.3%', '41.6%',
        '50%',  '58.3%', '66.6%', '75%',  '83.3%', '91.6%', '100%'
    ];

    // ─── 5. 질문 및 선택지 배열 ──────────────────────────────────────────────
    // EI 차원 (Q1~Q4): 외향 vs 내향
    // FT 차원 (Q5~Q8): 감정 공감 vs 해결 중심
    // AC 차원 (Q9~Q12): 자기 보호형 vs 눈치 소비형
    let questions = [
        '약속이 취소되면 나는?',                          // Q2  (index  0) — EI
        '단톡방에서 나는 보통?',                           // Q3  (index  1) — EI
        '혼자 있는 시간은 나에게?',                        // Q4  (index  2) — EI
        '친구가 새벽에 갑자기 힘들다고 연락했다.',          // Q5  (index  3) — FT
        '사람들이 나를 가장 많이 찾는 순간은?',             // Q6  (index  4) — FT
        '친구가 서운하다고 하면 나는?',                    // Q7  (index  5) — FT
        '사람들이 나를 보는 이미지에 가까운 건?',           // Q8  (index  6) — FT
        '인간관계에서 가장 자주 피곤한 이유는?',            // Q9  (index  7) — AC
        '부탁을 받으면 나는?',                             // Q10 (index  8) — AC
        '친구 고민을 듣고 나면?',                          // Q11 (index  9) — AC
        '관계에서 나는 보통?'                              // Q12 (index 10) — AC
    ];

    // option1 = E/F/A 성향 선택지 (이걸 고르면 해당 차원 +1)
    // 원본 질문의 선택지 순서가 E/F/A 먼저가 아닌 경우 순서를 바꿔 배치했다.
    let option1 = [
        '아쉽다',                        // Q2  E
        '분위기 이어가는 편',             // Q3  E
        '심심해서 사람 찾게 된다',         // Q4  E
        '일단 들어준다',                  // Q5  F
        '고민 상담할 때',                 // Q6  F
        '일단 미안하다고 한다',           // Q7  F
        '편하고 착한 사람',               // Q8  F
        '부탁을 너무 많이 받는다',         // Q9  A
        '선을 지키는 편이다',             // Q10 A
        '듣고 나면 털어낸다',             // Q11 A
        '중심을 지키는 역할이다'          // Q12 A
    ];

    // option2 = I/T/C 성향 선택지 (이걸 고르면 점수 변화 없음)
    let option2 = [
        '오히려 편하다',                  // Q2  I
        '필요한 말만 한다',               // Q3  I
        '반드시 필요하다',                // Q4  I
        '해결 방법부터 생각한다',          // Q5  T
        '문제 해결 필요할 때',            // Q6  T
        '이유부터 물어본다',              // Q7  T
        '믿고 맡길 수 있는 사람',         // Q8  T
        '상대 기분을 계속 신경 쓴다',      // Q9  C
        '거절을 잘 못한다',               // Q10 C
        '나까지 기분이 다운된다',          // Q11 C
        '맞춰주는 역할이다'               // Q12 C
    ];

    // ─── 6. 점수 기록 함수 ───────────────────────────────────────────────────
    // option1(E/F/A)을 골랐을 때만 해당 차원 점수를 1 올린다.
    //
    //   EI: Q1(-1), Q2(0), Q3(1), Q4(2)    → currentIndex <= 2
    //   FT: Q5(3), Q6(4), Q7(5), Q8(6)     → currentIndex <= 6
    //   AC: Q9(7), Q10(8), Q11(9), Q12(10) → currentIndex > 6
    function recordScore(isOption1) {
        if (!isOption1) return;

        if (currentIndex <= 2) {
            eiSum++;
        } else if (currentIndex <= 6) {
            ftSum++;
        } else {
            acSum++;
        }
    }

    // ─── 7. 화면 업데이트 함수 ───────────────────────────────────────────────
    // button 안의 <span>만 교체해 버튼의 CSS 구조를 유지한다.
    // progressFill.style.width에는 '8.3%'처럼 숫자+단위만 넣어야 한다.
    function showNextQuestion(nextIndex) {
        stepText.textContent      = steps[nextIndex];
        percentText.textContent   = percent[nextIndex];
        progressFill.style.width  = percent[nextIndex];
        questionTitle.textContent = questions[nextIndex];
        button1.querySelector('span').textContent = option1[nextIndex];
        button2.querySelector('span').textContent = option2[nextIndex];
    }

    // ─── 8. 결과 이동 함수 ───────────────────────────────────────────────────
    // 4문항 기준 임계값 2: > 2(3점 이상)이면 첫 번째 유형(E/F/A), 이하이면 두 번째(I/T/C)
    // 결과 유형 코드(예: EFA, ITC)를 URL 파라미터로 넘겨 result2.html로 이동한다.
    function showResult() {
        percentText.textContent  = '100%';
        progressFill.style.width = '100%';

        let EI = eiSum > 2 ? 'E' : 'I';
        let FT = ftSum > 2 ? 'F' : 'T';
        let AC = acSum > 2 ? 'A' : 'C';
        let type = EI + FT + AC;

        window.location.href = 'result2.html?type=' + type;
    }

    // ─── 9. 버튼 이벤트 등록 ─────────────────────────────────────────────────
    button1.addEventListener('click', function() {
        recordScore(true);
        currentIndex++;

        if (currentIndex < questions.length) {
            showNextQuestion(currentIndex);
        } else {
            showResult();
        }
    });

    button2.addEventListener('click', function() {
        recordScore(false);
        currentIndex++;

        if (currentIndex < questions.length) {
            showNextQuestion(currentIndex);
        } else {
            showResult();
        }
    });

}); // DOMContentLoaded 끝
