# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

한국어 성향 테스트 웹사이트. 빌드 도구, 패키지 매니저, 백엔드 없이 순수 정적 프론트엔드로 구성된 앱이다.

## 실행 방법

[index.html](index.html)을 브라우저에서 직접 열면 된다. 빌드 단계, 서버, 설치 과정은 없다.

## 아키텍처

파일 4개로 구성된다.

- [index.html](index.html) — 메인 페이지. 데스크탑용 헤더 내비게이션과 모바일용 `#slideMenu` 요소(데스크탑에서는 숨김)를 분리해서 관리한다. 

- [main.js](main.js) — 모바일 슬라이드 메뉴만 담당. `DOMContentLoaded` 이후 `#mobileMenu` 클릭으로 열고, `#closeMenu` 클릭 또는 메뉴 외부 클릭으로 닫는다.

- [main.css](main.css) — 데스크탑 스타일. `#slideMenu`와 `header button`(햄버거)은 `display: none`으로 숨긴다. `header ul`은 `position: absolute`로 오른쪽 정렬된다.

- [mobile.css](mobile.css) — `@media (max-width: 768px)` 오버라이드. 데스크탑 내비를 숨기고 햄버거 버튼을 노출하며, `#slideMenu`를 화면 오른쪽 고정 드로어로 전환(`transition: right 0.3s`). JS가 `.active` 클래스를 토글하면 드로어가 슬라이드 인된다.

## 주요 컨벤션

- CSS 단위는 모두 `px`로 통일한다([main.css](main.css) 상단 주석 참고).
- 모바일 드로어는 인라인 스타일 없이 `#slideMenu`에 `active` 클래스 추가/제거만으로 제어한다.
- 각 질문의 라디오 버튼은 서로 다른 `name` 속성(`question`, `question2`~`question6`)을 사용하므로, 질문 간에 상호 배타적 그룹이 형성되지 않는다.
