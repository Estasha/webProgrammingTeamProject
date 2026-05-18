// ─── 인간관계 유형 8가지 데이터 ────────────────────────────────────────────
// 키: E/I + F/T + A/C 조합으로 만들어지는 3글자 유형 코드
// nickname: 유형 별명, desc: 팩폭 한 줄 (짧고 공감되는 문장)
const typeData = {
    EFA: {
        nickname: '분위기 메이커 소모형',
        desc: '조용하면 어디 아프냐는 말 듣는 타입.'
    },
    EFC: {
        nickname: '24시간 상담센터형',
        desc: '남의 우울은 다 들어주는데 내 얘기는 잘 안 한다.'
    },
    ETA: {
        nickname: '필요할 때만 찾는 해결사형',
        desc: '평소엔 조용하다가 급할 때만 연락 오는 타입.'
    },
    ETC: {
        nickname: '현실 밸런스 관리자형',
        desc: '정 없다는 소리 듣지만 제일 오래 감.'
    },
    IFA: {
        nickname: '조용한 안전지대형',
        desc: '연락 자주는 안 해도 없어지면 허전한 사람.'
    },
    IFC: {
        nickname: '감정 쓰레기통 흡수형',
        desc: '남 고민 듣다가 내 멘탈 먼저 갈림.'
    },
    ITA: {
        nickname: '자기 보호 독립형',
        desc: '정은 있는데 굳이 표현은 안 함.'
    },
    ITC: {
        nickname: '눈치 과부하 맞춤형',
        desc: '눈치 보다가 하루 체력 다 씀.'
    }
};

document.addEventListener('DOMContentLoaded', function() {

    // ─── URL에서 유형 코드 읽기 ────────────────────────────────────────────
    // test2.js의 showResult()가 result2.html?type=EFA 형태로 이동한다.
    // URLSearchParams로 ?type= 파라미터를 추출한다.
    const params = new URLSearchParams(window.location.search);
    const type   = params.get('type');

    const typeEl     = document.getElementById('result-type');
    const nicknameEl = document.getElementById('result-nickname');
    const descEl     = document.getElementById('result-desc');

    // ─── 유효한 유형인지 확인 ──────────────────────────────────────────────
    // URL 파라미터가 없거나 8가지 유형에 없는 값이면 안내 문구를 표시한다.
    if (!type || !typeData[type]) {
        typeEl.textContent     = '?';
        nicknameEl.textContent = '결과를 불러올 수 없어요';
        descEl.textContent     = '테스트를 처음부터 다시 진행해 주세요.';
        return;
    }

    // ─── 결과 카드에 데이터 표시 ────────────────────────────────────────────
    const data = typeData[type];
    typeEl.textContent     = type;
    nicknameEl.textContent = data.nickname;
    descEl.textContent     = data.desc;

    // 페이지 제목도 유형에 맞게 업데이트
    document.title = data.nickname + ' — 인간관계 소비 성향 테스트 결과';

    // ─── 공유하기 버튼 ────────────────────────────────────────────────
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: type + ' — 인간관계 소비 성향 테스트 결과',
                text: type + ' ' + data.nickname + '\n' + data.desc,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(function() {
                shareBtn.textContent = '링크 복사됨 ✓';
                setTimeout(function() { shareBtn.textContent = '공유하기'; }, 2000);
            });
        }
    });
});
