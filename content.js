/* ------------------------------------------------------------
   Yoon Kikang — site content
   Edit this file only to change text and images.
   Images: put files in /images and set `src: "images/xxx.jpg"`.
   Any image without `src` renders as a grey placeholder.
   ------------------------------------------------------------ */

window.SITE = {
  name: "Yoon Kikang",
  born: { kor: "2002, 서울", eng: "2002, Seoul" },

  works: [
    {
      slug: "si",
      title: "시",
      year: "2017-2022",
      view: "scatter", // off-grid scrollable view
      // x, y, w are percentages of the stage width; h is aspect (height / width)
      images: [
        { x: 42, y: 0,   w: 15.7, ratio: 1.03, caption: "caption" },
        { x: 59.7, y: 7, w: 10.4, ratio: 1.43, caption: "caption" },
        { x: 77.3, y: 22, w: 21.5, ratio: 0.7, caption: "caption" },
        { x: 25.4, y: 33, w: 39.5, ratio: 0.69, caption: "caption" },
        { x: 79.4, y: 60, w: 15.2, ratio: 0.9, caption: "caption" },
        { x: 6,  y: 78, w: 18, ratio: 1.25, caption: "caption" },
        { x: 50, y: 88, w: 24, ratio: 0.75, caption: "caption" },
        { x: 28, y: 112, w: 13, ratio: 1.35, caption: "caption" },
        { x: 70, y: 120, w: 20, ratio: 1.1, caption: "caption" }
      ],
      installation: {
        image: { ratio: 0.695 },
        caption: [
          "Yoon Kikang",
          "<i>Integration and transformation</i>",
          "Liaoning Provincial Museum, China",
          "October 16 — November 15, 2024"
        ]
      }
    },
    {
      slug: "breathing-faces",
      title: "Breathing Faces",
      year: "2025",
      view: "strip", // horizontal scroll + magnifying
      count: 12,
      images: [], // e.g. [{ src: "images/bf-01.jpg" }, ...]  — portrait 4:5 recommended
      installation: {
        image: { ratio: 0.695 },
        caption: ["Yoon Kikang", "<i>Breathing Faces</i>", "", ""]
      }
    },
    {
      slug: "100-seconds",
      title: "백 초 세기",
      year: "2026",
      view: "grid", // pinch zoom + focusing
      count: 100,
      columns: 10,
      images: [],
      installation: {
        image: { ratio: 0.695 },
        caption: ["Yoon Kikang", "<i>백 초 세기</i>", "", ""]
      }
    }
  ],

  about: {
    statement: {
      kor: "윤기강은 카메라의 이미징 프로세스 속에서 발생하는 오류, 혹은 사진 언어 체계 속에서 오류라고 일컬어지는 현상들에 주목하고 이를 작업의 핵심 기제로 긍정한다. 규격화된 이미지 생산 체계로부터의 이탈은 사진 매체의 작동 방식을 다시 묻고 탐색하는 계기가 된다. 불완전한 이미지들을 감각과 경험이 개입된 하나의 상태로 제시하며, 이를 통해 사진 매체가 여전히 고정되지 않은 상태 속에서 꿈틀거림을 환기한다.",
      eng: "Yoon Kikang attends to the errors that arise within the camera's imaging process, and to the phenomena that the language of photography calls errors, affirming them as the core mechanism of his work. Departing from standardised systems of image production becomes a way of questioning and exploring how the photographic medium operates. Presenting imperfect images as a single state shaped by sensation and experience, he recalls that photography is still stirring, not yet fixed."
    },

    cv: [
      {
        head: { kor: "학력", eng: "Education" },
        rows: [
          { kor: ["재학", "중앙대학교 일반대학원 조형예술학과 순수사진전공"], eng: ["Current", "MFA Fine Art Photography, Chung-Ang University Graduate School"] },
          { kor: ["2026", "중앙대학교 예술대학 사진학과 졸업"], eng: ["2026", "BFA Photography, Chung-Ang University"] },
          { kor: ["2020", "안양예술고등학교 사진영상과 졸업"], eng: ["2020", "Photography & Film, Anyang Arts High School"] }
        ]
      },
      {
        head: { kor: "주요 단체전", eng: "Selected Group Exhibitions" },
        rows: [
          { kor: ["2026", "〈미끄러지고-흐르고-머물다-깨져〉", "KP 갤러리", "서울"], eng: ["2026", "<i>Slipping-Flowing-Staying-Breaking</i>", "KP Gallery", "Seoul"] },
          { kor: ["2026", "〈무엇이 보이는가〉", "양평군립미술관", "양평"], eng: ["2026", "<i>What Do You See</i>", "Yangpyeong Art Museum", "Yangpyeong"] },
          { kor: ["2024", "〈점에서 선으로〉", "대덕문화전당", "대구"], eng: ["2024", "<i>From Dot to Line</i>", "Daedeok Culture Center", "Daegu"] },
          { kor: ["2024", "〈Integration and transformation〉", "리아오닝 미술관", "중국"], eng: ["2024", "<i>Integration and transformation</i>", "Liaoning Provincial Museum", "China"] },
          { kor: ["2022", "〈그럼에도 불구하고〉", "충무로 갤러리", "서울"], eng: ["2022", "<i>Nevertheless</i>", "Chungmuro Gallery", "Seoul"] },
          { kor: ["2020", "〈보이는 소리들〉", "중앙대학교", "서울"], eng: ["2020", "<i>Visible Sounds</i>", "Chung-Ang University", "Seoul"] },
          { kor: ["2019", "〈27〉", "A-one 갤러리", "안양"], eng: ["2019", "<i>27</i>", "A-one Gallery", "Anyang"] },
          { kor: ["2017", "〈어섯눈의 나래〉", "선바위 미술관", "과천"], eng: ["2017", "<i>Wings of Half-Open Eyes</i>", "Seonbawi Art Museum", "Gwacheon"] }
        ]
      },
      {
        head: { kor: "수상", eng: "Awards" },
        rows: [
          { kor: ["2024", "K-청년 사진영상작가 양성 프로젝트", "현대사진영상학회"], eng: ["2024", "K-Youth Photo & Video Artist Project", "Korean Society of Contemporary Photography"] },
          { kor: ["2019", "다음작가주니어", "박건희문화재단"], eng: ["2019", "Daum Artist Junior", "Park Geon-hi Foundation"] },
          { kor: ["2018", "다음작가주니어", "박건희문화재단"], eng: ["2018", "Daum Artist Junior", "Park Geon-hi Foundation"] },
          { kor: ["2017", "대한민국청소년미디어대전 대상", "서울특별시"], eng: ["2017", "Grand Prize, Korea Youth Media Awards", "Seoul Metropolitan Government"] }
        ]
      },
      {
        head: { kor: "출판", eng: "Publications" },
        rows: [
          { kor: ["2024", "〈월간사진〉 2024년 12월호", "한국"], eng: ["2024", "<i>Monthly Photography</i>, December 2024", "Korea"] },
          { kor: ["2024", "〈사진예술〉 2024년 12월호", "한국"], eng: ["2024", "<i>Photo Art</i>, December 2024", "Korea"] }
        ]
      },
      {
        head: { kor: "경력", eng: "Experience" },
        rows: [
          { kor: ["현재", "강사, 안양예술고등학교 연극영화과"], eng: ["Current", "Instructor, Theatre & Film, Anyang Arts High School"] },
          { kor: ["2026", "외래강사, 발달장애인 예술 교육 프로그램, 광명시"], eng: ["2026", "Visiting Instructor, Art Education Programme for People with Developmental Disabilities, Gwangmyeong"] },
          { kor: ["2023", "대한민국 육군 본부 사진과 복무"], eng: ["2023", "Photographer, Republic of Korea Army Headquarters"] }
        ]
      }
    ],

    texts: [
      {
        title: "2024 월간사진 2024년 12월호",
        author: "강소라 월간사진 에디터",
        body: [
          "윤기강은 일상에서 부유(浮遊)하는 이미지의 단면을 포착하여 내면의 시선과 맞추어 보는 편집의 과정을 거쳐 내러티브(narrative)를 만든다. 이미지를 마주하고 선별하여 보여주기까지, 모든 과정에는 작가의 호흡과 그 이미지가 시적으로 포개어졌는지가 중요하다. ‘시’라는 발음은 한글에서 여러 의미로 해석할 수 있다. 흐르는 시간을 뜻하는 시(時)로 발음되기도 하고 바라봄을 뜻하는 시(視)로 발음되기도 하며 비유와 운율의 문학인 시(詩)로도 발음된다. 작가는 입술 사이로 바람을 가르듯 흘러나오는 이 짧은 발음과, 이제껏 자신이 해온 사진이 닮아 있다고 느낀다. 그가 고른 단어와 이미지는 공간 속에 배열되어 리듬과 운율을 꾸리며, 그가 앓고-잃고-잊은 삶의 편린(片鱗)을 전하는 시로 재구성된다."
        ]
      },
      {
        title: "2024 K-청년 사진영상 작가 양성 프로젝트 포트폴리오 심사평",
        author: "국립현대미술관 이민아 학예연구사",
        body: [
          "‘나’에서 비롯된 세계 읽기<br>120명의 출품작은 각 작가의 관점과 표현하고자 하는 메시지가 달랐다. 작품 경향은 크게 시각적인 이미지 구현 방식, 작가의 개념 및 시각탐구, 매체 실험의 세 가지 속성으로 분류할 수 있었다. 이 세 가지 특성을 모두 포함하는 작업도 있지만 대개 두 개의 특징을 공통 부문으로 보유하고 있다.",
          "‘나’라는 주체에서 출발한 주제가 다수 포함되어 여기서 파생된 작업의 지형도와 갈래를 파악할 수 있었다. 가령 고향과 먼 도시의 학교를 다니게 된 작가들의 작업을 살펴본다. 첫 번째, 성인이 되어 독립적인 환경에 홀로 놓임으로써 느낀 고독과 불안, 외로움과 같은 개인적 감정에 집중한 사진, 두 번째, 원가족과 떨어져 학교에 다니며 심적, 물리적 거리감을 획득한 후 가족 구성원을 대상으로 관계를 탐색한 작업, 세 번째, 학교와 고향을 오가는 길 위에서 발견한 도시 풍경을 해석한 작업들은 한국 사회의 현재를 보여주기도 한다. 나에서 출발한 작업은 가족(타인), 환경으로 포착의 대상과 주제는 같으면서도 다르게 구축됨을 알 수 있다.",
          "물론 작업 노트를 읽지 않으면 작업의 구조가 명확하지 않은 경우도 있었다. SNS 피드를 종횡하는 정방형, 세로형 이미지처럼 미적으로 아름다우며, 색감으로 작가의 감정을 고스란히 전하는 방식을 택한 작업도 다수 발견할 수 있었다. 디지털 사진이지만 1990년대 노스텔지어가 묻어있는 작업은 그야말로 잘 찍은 작업이다. 모든 작업에 의도가 내비춰져야 하는 것은 아니지만 의미의 층위가 알레고리처럼 존재해 작가의 의도와 관람자의 해석이 자유로운 교류가 촉발될 작업에 기대가 컸다.",
          "이에 표면적인 이미지, 분위기, 심상 너머의 작가의 작업 의도가 보이는 작품에 높은 점수를 책정했다. 기성세대 작가의 작업 중에서도 시대가 변해도 계속 전시되거나 회자되는 작업을 예시로 심사의견을 덧붙이고자 한다. (…)"
        ]
      }
    ],

    contact: {
      email: "imagelover@kakao.com",
      phone: "+82 10 6588 3188",
      instagram: "yoonkikang",
      pdf: "files/cv+portfolio.pdf"
    }
  }
};
