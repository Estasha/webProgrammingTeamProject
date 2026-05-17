// ─── MBTI 16가지 유형 데이터 ──────────────────────────────────────────────
// nickname: 개발자 별명, desc: 한 줄 특징
const mbtiData = {
    ISTJ: { nickname: '인간 컴파일러',        desc: '오타와 세미콜론 누락을 귀신같이 찾아내는 원칙주의자.' },
    ISFJ: { nickname: '갓벽한 서포터',        desc: '팀원들이 놓친 문서화와 버그를 묵묵히 챙기는 천사.' },
    INFJ: { nickname: '코드 철학자',          desc: '왜 이 코드를 짜야 하는지 의미를 찾는 조용한 비저너리.' },
    INTJ: { nickname: '냉철한 아키텍트',      desc: '효율성이 최우선. 전체 시스템 구조를 설계하는 전략가.' },
    ISTP: { nickname: '맥가이버 개발자',      desc: '도구 탓 안 함. 어떤 언어를 던져줘도 일단 돌아가게 만듦.' },
    ISFP: { nickname: '감성 프론트엔드',      desc: '픽셀 하나, 색감 하나에 진심인 예술가형 개발자.' },
    INFP: { nickname: '꿈꾸는 코딩 시인',    desc: '사용자 경험(UX)에 몰입하는 따뜻한 감성 코더.' },
    INTP: { nickname: '고독한 버그 헌터',    desc: '밤샘 코딩을 즐기며 원리를 끝까지 파고드는 분석가.' },
    ESTJ: { nickname: '프로젝트 매니저(PM)', desc: '코드 한 줄보다 일정 관리가 더 중요한 철두철미 리더.' },
    ESFJ: { nickname: '해피 팀플레이어',     desc: '팀 프로젝트의 갈등을 중재하고 화합을 이끄는 리더.' },
    ENFJ: { nickname: '코딩 멘토',           desc: '동기들 코딩 가르쳐주느라 정작 본인 과제는 늦게 하는 타입.' },
    ENTJ: { nickname: '타고난 CTO',          desc: '논리적이고 카리스마 있게 팀을 이끄는 효율 극대화 리더.' },
    ESTP: { nickname: '풀스택 불도저',       desc: '에러 무시하고 일단 실행. 결과부터 뽑아내는 행동파.' },
    ESFP: { nickname: '분위기 메이커',       desc: '코딩보다 협업과 발표 시연에 강한 캠퍼스 인싸.' },
    ENFP: { nickname: '아이디어 뱅크',       desc: '매일 새로운 프레임워크 쓰자고 제안하는 호기심 대장.' },
    ENTP: { nickname: '디버깅 빌런',         desc: '기존 방식을 부정하고 자기만의 창의적인 길을 가는 괴짜.' }
};

document.addEventListener('DOMContentLoaded', function() {

    // ─── URL에서 MBTI 유형 읽기 ────────────────────────────────────────
    // test1.js의 showResult()가 result.html?type=ESTJ 형태로 이동한다.
    // URLSearchParams로 ?type= 파라미터를 추출한다.
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    const typeEl     = document.getElementById('result-type');
    const nicknameEl = document.getElementById('result-nickname');
    const descEl     = document.getElementById('result-desc');

    // ─── 유효한 유형인지 확인 ──────────────────────────────────────────
    // URL 파라미터가 없거나 16가지 유형에 없는 값이면 안내 문구를 표시한다.
    if (!type || !mbtiData[type]) {
        typeEl.textContent     = '?';
        nicknameEl.textContent = '결과를 불러올 수 없어요';
        descEl.textContent     = '테스트를 처음부터 다시 진행해 주세요.';
        return;
    }

    // ─── 결과 카드에 데이터 표시 ────────────────────────────────────────
    const data = mbtiData[type];
    typeEl.textContent     = type;
    nicknameEl.textContent = data.nickname;
    descEl.textContent     = data.desc;

    // 페이지 제목도 유형에 맞게 업데이트
    document.title = type + ' — 개발자 MBTI 결과';
});
