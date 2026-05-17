# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

한국어 개발자 성향(MBTI) 테스트 웹사이트. 빌드 도구, 패키지 매니저, 백엔드 없이 순수 정적 프론트엔드로 구성된 앱이다.

## 실행 방법

[index.html](index.html)을 브라우저에서 직접 열면 된다. 빌드 단계, 서버, 설치 과정은 없다.

## 파일 구조

```
teamProject/
├── index.html          # 메인 페이지 (테스트 목록 그리드)
├── main.css            # index.html 전용 데스크탑 스타일
├── mobile.css          # index.html 반응형 오버라이드 (≤1024px)
├── tablet.css          # index.html 태블릿 전용 스타일 (769px~1024px)
│
├── test1.html          # 개발자 MBTI 테스트 페이지
├── test1.js            # 테스트 1 로직 (질문 진행·점수 계산·결과 이동)
├── test2.html          # 테스트 2 페이지 (JS 미구현)
├── test3.html          # 테스트 3 페이지 (JS 미구현)
│
├── result.html         # MBTI 결과 페이지
├── result.css          # 결과 카드·버튼 전용 스타일
├── result.js           # URL 파라미터 읽기·결과 표시 로직
│
├── test.css            # 테스트·결과 페이지 공통 스타일
├── test-tablet.css     # 테스트 페이지 태블릿 전용 스타일
│
└── img/
    └── banner.png      # 메인 페이지 광고 배너 이미지
```

## 아키텍처

### 메인 페이지 (index.html)                                 
- [main.css](main.css) — 데스크탑 기본 레이아웃. `#test-box`를 `display: grid; grid-template-columns: repeat(2, 1fr)`로 배치.   //1행 2열 행렬 형태로 블럭을 배치함

- [mobile.css](mobile.css) — `@media (max-width: 1024px)` 오버라이드. `@media (max-width: 768px)`에서 그리드를 1열로 전환.
- [tablet.css](tablet.css) — `@media (769px~1024px)` 태블릿 전용 추가 스타일.
- 슬라이드 메뉴·햄버거 버튼 없음. 내비게이션 기능 미구현 상태.

### 테스트 페이지 (test1.html ~ test3.html)
- [test.css](test.css) — 모든 화면 크기에서 모바일 세로 레이아웃(max-width: 480px)으로 고정. 데스크탑·태블릿도 동일하게 보임.
- [test-tablet.css](test-tablet.css) — 태블릿에서 main max-width를 480px로 고정.
- [mobile.css](mobile.css) — `#optionBox` 위 여백 조정(148px → 110px).

### 테스트 1 로직 (test1.js)
- `DOMContentLoaded` 이벤트 안에서 모든 DOM 참조·이벤트 등록.
- 12문항 MBTI 테스트. Q1은 HTML에 하드코딩, Q2~Q12는 `questions[]` 배열에서 불러옴.
- 점수 구조: option1 클릭 시 해당 차원 +1, option2는 변화 없음. 차원당 3문항, 임계값 1.5.

    - (A선택지 선택하면 +1 점 되고 B선택지 선택하면 점수 변화 없으며, 만약 2문항 이상 A선택지를 고를 시에는 2점이 되므로 판단 기준 1.5점을 넘어 E와 I중 E가 선택되는 원리임, 1.5점 이하라면 I가 선택됩니다.)

  - EI: Q1, Q2, Q3 / SN: Q4, Q5, Q6 / TF: Q7, Q8, Q9 / JP: Q10, Q11, Q12
- 12문항 완료 시 `result.html?type=MBTI` 형태로 페이지 이동.

### 결과 페이지 (result.html)
- [result.js](result.js) — `URLSearchParams`로 `?type=` 파라미터를 읽어 16가지 MBTI 유형 데이터를 카드에 표시.
- [result.css](result.css) — 결과 카드·버튼 전용 스타일. test.css의 색상·테두리 스타일을 계승.

## 주요 컨벤션

- **CSS 단위**: 모두 `px`로 통일 (각 CSS 파일 상단 주석 참고).
- **테스트 페이지 레이아웃**: test.css가 독립적으로 모든 화면 크기를 제어하므로, main.css·tablet.css는 테스트 페이지에 링크하지 않는다.
- **질문 진행(!!중요!!)**: 동기적 for 루프가 아닌 `addEventListener('click', ...)` 이벤트 기반으로 한 문항씩 처리한다.
- **버튼 텍스트 업데이트(!!중요!!)**: `button.textContent` 대신 `button.querySelector('span').textContent`로 내부 `<span>`만 교체해 CSS 구조를 유지한다.
- **진행 바 width**: `progressFill.style.width`에는 `'8.3%'`처럼 숫자+단위만 넣는다 (`'width: 8.3%'` 형태는 오작동).
