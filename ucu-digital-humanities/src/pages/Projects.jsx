import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card/Card';
import { useAuth } from '../context/AuthContext';
import './Projects.css';


const printingHubs = [
  {
    id: 'lviv',
    name: 'Львівська друкарня',
    founder: 'Іван Федорович / Ставропігійське братство',
    founded: 1573,
    closed: 1800,
    x: 140,
    y: 200,
    description: 'Найстаріший безперервний осередок книгодрукування в Україні. Поклав початок масовому виданню книг кириличним шрифтом на українських теренах.',
    works: [
      { title: 'Апостол', year: 1574, type: 'Богослужбова книга' },
      { title: 'Буквар', year: 1574, type: 'Навчальний посібник' }
    ],
    dhStatus: '100% оцифровано. Створено NLP-корпус пам\'ятки, проведено морфологічне розмічування тексту та автоматичне виділення лігатур.',
    sampleText: 'Повелінієм же і благословенієм преосвященнаго митрополита Іоана... Сими убо писаними книгами Іван Федорович друкар з Москви во граді Львові діло сіє соверши в літо 1574.',
    nerEntities: [
      { text: 'Іоана', type: 'person', label: 'Митрополит Іоан' },
      { text: 'Іван Федорович', type: 'person', label: 'Першодрукар' },
      { text: 'Львові', type: 'location', label: 'Місто Львів' },
      { text: '1574', type: 'date', label: 'Рік видання' }
    ]
  },
  {
    id: 'ostroh',
    name: 'Острозька друкарня',
    founder: 'Князь Василь-Костянтин Острозький',
    founded: 1576,
    closed: 1612,
    x: 230,
    y: 150,
    description: 'Видатний культурно-освітній осередок Східної Європи при Острозькій академії. Місце видання першої повної друкованої Біблії церковнослов\'янською мовою.',
    works: [
      { title: 'Острозька Біблія', year: 1581, type: 'Святе Письмо' },
      { title: 'Острозький Буквар', year: 1578, type: 'Навчальний посібник' }
    ],
    dhStatus: 'Текстовий корпус XML/TEI. Виконано комп\'ютерне стилометричне дослідження грецьких та слов\'янських паралелей тексту.',
    sampleText: 'В літо 1581, в граді Острозі, великим накладом і старанням благовірного князя Костянтина... оцифровано Острозьку Біблію і досліджено NLP методами.',
    nerEntities: [
      { text: 'Острозі', type: 'location', label: 'Місто Острог' },
      { text: 'Костянтина', type: 'person', label: 'Князь Острозький' },
      { text: '1581', type: 'date', label: 'Рік видання' }
    ]
  },
  {
    id: 'kyiv',
    name: 'Києво-Печерська друкарня',
    founder: 'Єлисей Плетенецький / Захарія Копистенський',
    founded: 1615,
    closed: 1800,
    x: 410,
    y: 155,
    description: 'Найбільший видавничий осередок України XVII-XVIII століть, що діяла в межах Лаври. Славилась витонченою бароковою графікою та мідними гравюрами.',
    works: [
      { title: 'Часослов', year: 1616, type: 'Богослужбова книга' },
      { title: 'Патерик Печерський', year: 1661, type: 'Збірка житій' }
    ],
    dhStatus: 'Оцифровано понад 300 унікальних видань. Інтегровано згорткову нейромережу (CNN) для автоматичної класифікації сюжетів старовинних гравюр.',
    sampleText: 'Сія книга Часослов видана бисть во обителі святої Лаври Печерської... працею Єлисея Плетенецького архімандрита в літо 1616.',
    nerEntities: [
      { text: 'Печерської', type: 'location', label: 'Києво-Печерська Лавра' },
      { text: 'Єлисея Плетенецького', type: 'person', label: 'Архімандрит' },
      { text: '1616', type: 'date', label: 'Рік видання' }
    ]
  },
  {
    id: 'chernihiv',
    name: 'Чернігівська друкарня',
    founder: 'Лазар Баранович',
    founded: 1679,
    closed: 1797,
    x: 460,
    y: 85,
    description: 'Створена архієпископом Лазарем Барановичем у Новгороді-Сіверському, згодом перенесена в Чернігів. Сприяла поширенню української барокової літератури.',
    works: [
      { title: 'Благовісник', year: 1703, type: 'Збірка проповідей' },
      { title: 'Псалтир', year: 1708, type: 'Богослужбова книга' }
    ],
    dhStatus: 'Навчання моделі розпізнавання тексту (OCR) на базі LSTM-мереж для автоматичного зчитування унікального чернігівського барокового шрифту.',
    sampleText: 'У граді Чернігові працею духовних отців колегіуму та благословенням Лазаря Барановича надруковано Псалтир в літо 1708.',
    nerEntities: [
      { text: 'Чернігові', type: 'location', label: 'Місто Чернігів' },
      { text: 'Лазаря Барановича', type: 'person', label: 'Архієпископ' },
      { text: '1708', type: 'date', label: 'Рік видання' }
    ]
  },
  {
    id: 'pochaiv',
    name: 'Почаївська друкарня',
    founder: 'Монахи Чину святого Василія Великого (Василіяни)',
    founded: 1730,
    closed: 1800,
    x: 200,
    y: 190,
    description: 'Унікальний осередок друку на Заході України, відомий виданням книг як церковнослов\'янською, так і розмовною мовою. Проводив спектральний аналіз паперу.',
    works: [
      { title: 'Служебник', year: 1734, type: 'Богослужбова книга' },
      { title: 'Народовіщаніє', year: 1768, type: 'Повчальна література' }
    ],
    dhStatus: 'Спектральний аналіз паперу та оцифрування водяних знаків (філіграней) для визначення точного датування та шляхів постачання сировини.',
    sampleText: 'Надруковано во святої Почаївської Успенської Лаври... працею монахів чину святого Василія Великого в літо 1768.',
    nerEntities: [
      { text: 'Почаївської', type: 'location', label: 'Почаївська Лавра' },
      { text: 'Василія Великого', type: 'person', label: 'Святий Василій' },
      { text: '1768', type: 'date', label: 'Рік видання' }
    ]
  }
];


const historicalTimelineEvents = [
  {
    year: 1573,
    title: "Прибуття Івана Федоровича до Львова",
    desc: "Видатний друкар засновує першу друкарню на території України за підтримки Ставропігійського братства."
  },
  {
    year: 1574,
    title: "Друк першого «Апостола» та «Букваря»",
    desc: "У Львові надруковано «Апостол» — першу точно датовану книгу в Україні, а також перший друкований підручник «Буквар»."
  },
  {
    year: 1576,
    title: "Заснування Острозької друкарні",
    desc: "Князь Костянтин-Василь Острозький засновує друкарню при Острозькій академії для розвитку православної освіти."
  },
  {
    year: 1581,
    title: "Видання «Острозької Біблії»",
    desc: "Вихід у світ першого повного видання Святого Письма церковнослов'янською мовою. Вершина української друкарської справи XVI ст."
  },
  {
    year: 1615,
    title: "Створення Києво-Печерської друкарні",
    desc: "Єлисей Плетенецький купує Стрятинську друкарню і створює видавничий осередок у Києво-Печерській Лаврі."
  },
  {
    year: 1616,
    title: "Перша друкована книга Києва: «Часослов»",
    desc: "Виходить у світ перша книга Києво-Печерської друкарні — «Часослов», що став основним посібником для навчання грамоті."
  },
  {
    year: 1632,
    title: "Створення Києво-Могилянського колегіуму",
    desc: "Петро Могила об'єднує дві школи в один потужний колегіум, який стає головним гуманітарним та просвітницьким центром Східної Європи."
  },
  {
    year: 1661,
    title: "Видання «Патерика Печерського» з гравюрами",
    desc: "Видання збірника житій з розкішними бароковими гравюрами на міді, виконаними кращими вітчизняними граверами."
  },
  {
    year: 1679,
    title: "Заснування друкарні в Чернігові",
    desc: "Архієпископ Лазар Баранович відкриває друкарню, яка стає ключовим видавничим осередком козацької Гетьманщини."
  },
  {
    year: 1708,
    title: "Вихід «Чернігівського Псалтиря»",
    desc: "Виходить у світ розкішне видання Псалтиря з бароковими орнаментами та унікальними локальними шрифтами."
  },
  {
    year: 1730,
    title: "Початок друкарства в Почаївській Лаврі",
    desc: "Монахи-василіяни офіційно засновують Почаївську друкарню, відому своїм високим рівнем граверного мистецтва."
  },
  {
    year: 1768,
    title: "Книга живою народною мовою: «Народовіщаніє»",
    desc: "Почаївська друкарня видає збірку проповідей, написану мовою, максимально наближеною до народної розмовної мови."
  }
];


const dhResearchTopics = [
  {
    title: "Комп'ютерний аналіз синтаксису козацьких літописів XVII ст.",
    desc: "Застосування методів обробки природної мови (NLP) для порівняльного аналізу авторського стилю та синтаксичної структури Літопису Самовидця та Літопису Самійла Величка.",
    img: "https://picsum.photos/seed/dh1/400/200",
    goal: "Автоматичне виявлення авторського стилю та стилістичних особливостей літописів."
  },
  {
    title: "ГІС-картування мережі поширення видань Острозької академії",
    desc: "Геопросторовий аналіз та інтерактивна візуалізація торговельних шляхів, якими книги Острозької друкарні потрапляли до бібліотек Європи у XVI-XVII ст.",
    img: "https://picsum.photos/seed/dh2/400/200",
    goal: "Візуалізувати інтерактивні маршрути розповсюдження книг Острозької друкарні."
  },
  {
    title: "Розпізнавання скоропису кириличних рукописів за допомогою CNN",
    desc: "Навчання глибоких згорткових нейромереж для автоматичного розпізнавання та оцифрування складного українського скоропису з архівів XVII століття.",
    img: "https://picsum.photos/seed/dh3/400/200",
    goal: "Розробити модель глибокого навчання для точного OCR рукописних кириличних фондів."
  },
  {
    title: "Стилометричне дослідження авторства полемічних трактатів",
    desc: "Аналіз частотності службових слів та n-грам для встановлення ймовірного авторства анонімних релігійних памфлетів періоду Берестейської унії.",
    img: "https://picsum.photos/seed/dh4/400/200",
    goal: "Визначити ймовірних авторів анонімних релігійних текстів Берестейської унії."
  },
  {
    title: "Візуалізація соціальної мережі діячів Києво-Могилянської академії",
    desc: "Побудова інтерактивного графа зв'язків між викладачами, випускниками та меценатами академії XVIII століття на основі епістолярної спадщини.",
    img: "https://picsum.photos/seed/dh5/400/200",
    goal: "Створити інтерактивний граф листування та інтелектуальних зв'язків випускників."
  },
  {
    title: "Створення моделі OCR для барокових стародруків Чернігова",
    desc: "Розробка та тонке налаштування (fine-tuning) моделей оптичного розпізнавання символів для унікальних шрифтів друкарні Лазаря Барановича.",
    img: "https://picsum.photos/seed/dh6/400/200",
    goal: "Забезпечити високу точність розпізнавання стародруків Лазаря Барановича."
  },
  {
    title: "Аналіз філіграней паперу Почаївської друкарні методом спектроскопії",
    desc: "Класифікація водяних знаків за допомогою комп'ютерного зору для визначення походження та точного датування старовинного паперу.",
    img: "https://picsum.photos/seed/dh7/400/200",
    goal: "Визначити походження та точне датування почаївських паперових водяних знаків."
  },
  {
    title: "Цифровий архів та інтерактивний корпус українського Самвидаву",
    desc: "Оцифрування, OCR та лінгвістичне маркування позацензурної преси та літератури 1960-1980-х років для відкритих гуманітарних досліджень.",
    img: "https://picsum.photos/seed/dh8/400/200",
    goal: "Створити відкритий NLP-корпус та цифровий архів позацензурної радянської преси."
  }
];

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map');


  const [currentYear, setCurrentYear] = useState(1570);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHubId, setSelectedHubId] = useState('lviv');
  const [analyzing, setAnalyzing] = useState(false);
  const [showNlpResult, setShowNlpResult] = useState(false);


  const [inputText, setInputText] = useState('');
  const [nlpResults, setNlpResults] = useState(null);


  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Усі');
  const [projectTags, setProjectTags] = useState(() => {
    const saved = localStorage.getItem('project_custom_tags');
    return saved ? JSON.parse(saved) : ['Усі', 'NLP та аналіз текстів', 'ГІС та цифрові архіви'];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');


  const { isAdmin, user } = useAuth();
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);

  const handleProjectDelete = async (projectId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей проєкт?')) {
      try {
        const headers = {};
        if (user) headers['x-user-id'] = user.id;

        const res = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
          headers
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Не вдалося видалити проєкт');
        }

        const updated = projects.filter(p => p.id !== projectId);
        setProjects(updated);
        setFilteredProjects(updated);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddProjectTagInline = (e) => {
    if (e) e.preventDefault();
    if (newTagName && newTagName.trim() !== '') {
      const trimmed = newTagName.trim();
      if (projectTags.includes(trimmed)) {
        alert('Такий фільтр вже існує!');
        return;
      }
      const updated = [...projectTags, trimmed];
      setProjectTags(updated);
      localStorage.setItem('project_custom_tags', JSON.stringify(updated));
      setNewTagName('');
      setShowAddInput(false);
    }
  };

  const handleRemoveProjectTag = (e, tagToRemove) => {
    e.stopPropagation();
    if (tagToRemove === 'Усі') return;
    const updated = projectTags.filter(t => t !== tagToRemove);
    setProjectTags(updated);
    localStorage.setItem('project_custom_tags', JSON.stringify(updated));
    if (selectedTag === tagToRemove) {
      setSelectedTag('Усі');
      applyFilters(searchQuery, 'Усі');
    }
  };

  const timerRef = useRef(null);
  const currentHub = printingHubs.find(h => h.id === selectedHubId);


  useEffect(() => {
    if (currentHub) {
      setInputText(currentHub.sampleText);
      setShowNlpResult(false);
      setNlpResults(null);
    }
  }, [selectedHubId]);


  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentYear((prevYear) => {
          if (prevYear >= 1800) {
            setIsPlaying(false);
            return 1800;
          }
          return prevYear + 2;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Не вдалося завантажити проєкти з сервера');
        }
        const data = await response.json();

        setProjects(data.projects);
        setFilteredProjects(data.projects);

        const defaultTags = ['Усі', 'NLP та аналіз текстів', 'ГІС та цифрові архіви'];
        const uniqueDirections = Array.from(new Set(data.projects.map(p => p.direction).filter(Boolean)));
        setProjectTags(prev => {
          const combined = new Set([...prev, ...defaultTags, ...uniqueDirections]);
          return Array.from(combined);
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  useEffect(() => {
    let result = [...projects];

    if (selectedTag !== 'Усі') {
      const isDefault = selectedTag === 'NLP та аналіз текстів' || selectedTag === 'ГІС та цифрові архіви';
      if (isDefault) {
        result = result.filter(project =>
          (project.direction && project.direction.includes(selectedTag)) ||
          (project.extraInfo && project.extraInfo.includes(selectedTag))
        );
      } else {
        const lowerTag = selectedTag.toLowerCase();
        result = result.filter(project =>
          project.title.toLowerCase().includes(lowerTag) ||
          project.description.toLowerCase().includes(lowerTag) ||
          (project.direction && project.direction.toLowerCase().includes(lowerTag)) ||
          (project.goal && project.goal.toLowerCase().includes(lowerTag)) ||
          (project.extraInfo && project.extraInfo.toLowerCase().includes(lowerTag))
        );
      }
    }

    if (searchQuery !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.direction && project.direction.toLowerCase().includes(q)) ||
        (project.goal && project.goal.toLowerCase().includes(q))
      );
    }

    setFilteredProjects(result);
  }, [projects, searchQuery, selectedTag]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleHubSelect = (hubId) => {
    setSelectedHubId(hubId);
    setAnalyzing(false);
    setShowNlpResult(false);
  };


  const runNlpAnalysis = () => {
    setAnalyzing(true);
    setShowNlpResult(false);


    setTimeout(() => {
      const textToAnalyze = inputText.trim();
      const charsCount = textToAnalyze.length;


      const cleanedWords = textToAnalyze
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"«»’'–]/g, "")
        .split(/\s+/)
        .filter(w => w.trim() !== '');

      const totalWords = cleanedWords.length;
      const uniqueWordsSet = new Set(cleanedWords);
      const uniqueWordsCount = uniqueWordsSet.size;


      const computedTtr = totalWords > 0
        ? parseFloat((uniqueWordsCount / totalWords).toFixed(2))
        : 0;


      const cyrillicLetters = textToAnalyze.toLowerCase().replace(/[^а-яєіїґ]/g, "");
      const letterCounts = {};
      for (let char of cyrillicLetters) {
        letterCounts[char] = (letterCounts[char] || 0) + 1;
      }
      const totalLettersCount = cyrillicLetters.length;

      const computedCharFreq = Object.entries(letterCounts)
        .map(([char, count]) => ({
          char,
          val: totalLettersCount > 0 ? parseFloat(((count / totalLettersCount) * 100).toFixed(1)) : 0
        }))
        .sort((a, b) => b.val - a.val)
        .slice(0, 5);


      const detectedEntities = [];


      if (currentHub && currentHub.nerEntities) {
        currentHub.nerEntities.forEach(ent => {
          if (textToAnalyze.includes(ent.text)) {
            detectedEntities.push(ent);
          }
        });
      }


      const yearRegex = /\b(1[5678]\d{2})\b/g;
      let match;
      while ((match = yearRegex.exec(textToAnalyze)) !== null) {
        const yearText = match[1];
        if (!detectedEntities.some(e => e.text === yearText)) {
          detectedEntities.push({
            text: yearText,
            type: 'date',
            label: `Рік: ${yearText}`
          });
        }
      }


      const highlightedTextElements = renderHighlightedText(textToAnalyze, detectedEntities);


      setNlpResults({
        chars: charsCount,
        words: totalWords,
        ttr: computedTtr,
        charFreq: computedCharFreq,
        highlightedText: highlightedTextElements
      });

      setAnalyzing(false);
      setShowNlpResult(true);
    }, 800);
  };


  const activeTimelineEvents = historicalTimelineEvents.filter(e => e.year <= currentYear);


  const renderHighlightedText = (text, entities) => {
    if (!entities || entities.length === 0) return text;

    let result = [];
    let lastIndex = 0;


    const sortedEntities = [...entities].sort((a, b) => {
      return text.indexOf(a.text) - text.indexOf(b.text);
    });

    sortedEntities.forEach((entity, idx) => {
      const startIdx = text.indexOf(entity.text, lastIndex);
      if (startIdx === -1) return;


      if (startIdx > lastIndex) {
        result.push(text.substring(lastIndex, startIdx));
      }


      result.push(
        <span key={idx} className={`ner-entity ner-${entity.type}`} data-label={entity.label}>
          {entity.text}
          <span className="ner-tooltip">{entity.label} ({entity.type.toUpperCase()})</span>
        </span>
      );

      lastIndex = startIdx + entity.text.length;
    });

    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result;
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="section-title">Цифрові дослідження</h1>
        <p className="projects-description">
          Ознайомтесь із нашими прикладними Digital Humanities проектами та інтерактивними інструментами аналізу просторово-часових даних.
        </p>

        
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            Інтерактивна ГІС-мапа
          </button>
          <button
            className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            База DH-проєктів
          </button>
        </div>
      </div>

      
      {activeTab === 'map' && (
        <div className="gis-map-section">
          <div className="gis-map-container">
            <div className="map-canvas-wrapper">
              <div className="map-coordinate-header">
                <span>Мапа книгодрукування XVI-XVIII ст.</span>
                <span className="coordinate-grid-indicator">ГІС-сітка: Увімкнено</span>
              </div>

              <svg className="gis-map-canvas" viewBox="0 0 800 450" width="100%">
                
                <g className="grid-lines">
                  <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="0" y1="200" x2="800" y2="200" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="0" y1="300" x2="800" y2="300" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="200" y1="0" x2="200" y2="450" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="400" y1="0" x2="400" y2="450" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="600" y1="0" x2="600" y2="450" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
                </g>

                
                <g className="grid-labels" style={{ fontSize: '10px', fill: 'var(--text-color)', opacity: 0.4 }}>
                  <text x="10" y="95">50° N</text>
                  <text x="10" y="195">48° N</text>
                  <text x="10" y="295">46° N</text>
                  <text x="190" y="440">24° E</text>
                  <text x="390" y="440">30° E</text>
                  <text x="590" y="440">36° E</text>
                </g>

                
                <path
                  d="M 70,220 L 70,165 L 110,135 L 150,130 L 195,115 L 250,110 L 330,120 L 410,110 L 470,60 L 530,95 L 595,100 L 670,115 L 730,135 L 770,160 L 770,185 L 755,230 L 725,260 L 685,270 L 650,290 L 570,290 L 500,310 L 535,325 L 565,330 L 545,385 L 515,380 L 490,360 L 485,310 L 450,305 L 415,310 L 380,310 L 360,335 L 305,365 L 290,350 L 305,310 L 250,305 L 235,280 L 190,285 L 160,295 L 115,295 L 105,255 L 70,220 Z"
                  className="ukraine-outline"
                />

                
                <g className="network-links">
                  {currentYear >= 1576 && (
                    <line x1="140" y1="200" x2="230" y2="150" className="map-link-line" />
                  )}
                  {currentYear >= 1615 && (
                    <>
                      <line x1="230" y1="150" x2="410" y2="155" className="map-link-line" />
                      <line x1="140" y1="200" x2="410" y2="155" className="map-link-line" />
                    </>
                  )}
                  {currentYear >= 1679 && (
                    <line x1="410" y1="155" x2="460" y2="85" className="map-link-line" />
                  )}
                  {currentYear >= 1730 && (
                    <line x1="200" y1="190" x2="410" y2="155" className="map-link-line" />
                  )}
                </g>

                
                {printingHubs.map((hub) => {
                  const isVisible = currentYear >= hub.founded;
                  const isActive = isVisible && (currentYear <= hub.closed || hub.closed === 1800);

                  if (!isVisible) return null;

                  return (
                    <g
                      key={hub.id}
                      className={`map-node ${selectedHubId === hub.id ? 'selected' : ''} ${!isActive ? 'archived' : ''}`}
                      onClick={() => handleHubSelect(hub.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isActive && (
                        <circle cx={hub.x} cy={hub.y} r="18" className="pulse-circle" />
                      )}
                      <circle cx={hub.x} cy={hub.y} r="7" className="main-node-circle" />
                      <text x={hub.x + 12} y={hub.y + 4} className="node-text">
                        {hub.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              
              <div className="timeline-control-panel">
                <div className="timeline-meta">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`play-btn ${isPlaying ? 'playing' : ''}`}
                    title={isPlaying ? "Пауза" : "Запустити хронологію"}
                  >
                    {isPlaying ? "Пауза" : "Автопрогравання"}
                  </button>
                  <div className="current-year-display">
                    Рік: <span className="year-number">{currentYear}</span>
                  </div>
                </div>

                <div className="timeline-slider-wrapper">
                  <span className="slider-label">1570</span>
                  <input
                    type="range"
                    min="1570"
                    max="1800"
                    value={currentYear}
                    onChange={(e) => {
                      setCurrentYear(parseInt(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="timeline-slider"
                  />
                  <span className="slider-label">1800</span>
                </div>

                <div className="timeline-milestones">
                  <span className={`milestone ${currentYear >= 1573 ? 'passed' : ''}`}>1573</span>
                  <span className={`milestone ${currentYear >= 1576 ? 'passed' : ''}`}>1576</span>
                  <span className={`milestone ${currentYear >= 1615 ? 'passed' : ''}`}>1615</span>
                  <span className={`milestone ${currentYear >= 1679 ? 'passed' : ''}`}>1679</span>
                  <span className={`milestone ${currentYear >= 1730 ? 'passed' : ''}`}>1730</span>
                </div>
              </div>

              
              <div className="temporal-feed-container glassmorphism">
                <div className="feed-header">
                  <h3>Хроніка подій періоду</h3>
                </div>
                <div className="temporal-feed-cards-grid">
                  {activeTimelineEvents.length > 0 ? (
                    activeTimelineEvents.map((event, index) => (
                      <div key={index} className="timeline-event-card animate-fade-in">
                        <div className="event-card-top">
                          <span className="event-year-badge">{event.year} р.</span>
                          <h4>{event.title}</h4>
                        </div>
                        <p>{event.desc}</p>
                      </div>
                    ))
                  ) : (
                    <div className="empty-event">
                      <p>Очікування історичних подій... Перетягніть повзунок на 1573 рік або далі, щоб побачити розвиток книгодрукування.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            
            <div className="gis-sidebar-details glassmorphism">
              {currentHub ? (
                <>
                  <div className="sidebar-header">
                    <span className="status-badge active-badge">
                      {currentYear >= currentHub.founded && (currentYear <= currentHub.closed || currentHub.closed === 1800)
                        ? 'Активний осередок'
                        : 'Історичний осередок'}
                    </span>
                    <h2>{currentHub.name}</h2>
                    <p className="sidebar-subtitle">Засновник: {currentHub.founder}</p>
                  </div>

                  <div className="sidebar-content">
                    <div className="info-row">
                      <span className="info-label">Засновано:</span>
                      <span className="info-value text-primary">{currentHub.founded} р.</span>
                    </div>
                    {currentHub.closed !== 1800 && (
                      <div className="info-row">
                        <span className="info-label">Припинено:</span>
                        <span className="info-value">{currentHub.closed} р.</span>
                      </div>
                    )}

                    <div className="info-section">
                      <h3>Опис дослідження</h3>
                      <p>{currentHub.description}</p>
                    </div>

                    <div className="info-section">
                      <h3>Визначні видання (оцифровано)</h3>
                      <ul className="works-list">
                        {currentHub.works.map((work, index) => (
                          <li key={index} className="work-item">
                            <span className="work-title">{work.title}</span>
                            <span className="work-meta">{work.year} р. | {work.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="info-section dh-status-box">
                      <h3>Статус дослідження (Digital Humanities)</h3>
                      <p className="dh-status-text">{currentHub.dhStatus}</p>
                    </div>

                    
                    <div className="info-section">
                      <h3>Текст пам'ятки для лінгвістичного аналізу</h3>
                      <textarea
                        className="nlp-textarea"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Вставте сюди будь-який історичний або сучасний текст для запуску живого обчислювального аналізу..."
                      />
                      <p className="nlp-textarea-hint">
                        Ви можете повністю відредагувати або вставити будь-який власний текст для розрахунку реальної статистики.
                      </p>
                    </div>

                    
                    <div className="nlp-analysis-section">
                      <button
                        onClick={runNlpAnalysis}
                        className="nlp-run-btn"
                        disabled={analyzing}
                      >
                        {analyzing ? 'Виконується аналіз тексту...' : 'Запустити комп\'ютерно-лінгвістичний аналіз (NLP)'}
                      </button>

                      {analyzing && (
                        <div className="nlp-loading">
                          <div className="spinner"></div>
                          <p>Токенізація корпусу та маркування сутностей...</p>
                        </div>
                      )}

                      {showNlpResult && nlpResults && (
                        <div className="nlp-results animate-fade-in">
                          <h4>Результати обробки тексту:</h4>

                          
                          <div className="nlp-stats-grid">
                            <div className="nlp-stat-card">
                              <span className="stat-label">Символів</span>
                              <span className="stat-val">{nlpResults.chars}</span>
                            </div>
                            <div className="nlp-stat-card">
                              <span className="stat-label">Слів</span>
                              <span className="stat-val">{nlpResults.words}</span>
                            </div>
                            <div className="nlp-stat-card">
                              <span className="stat-label">Різноманітність (TTR)</span>
                              <span className="stat-val">{nlpResults.ttr}</span>
                            </div>
                          </div>

                          
                          <div className="nlp-ner-box">
                            <h5>Виділення сутностей (NER):</h5>
                            <p className="ner-text-rendered">
                              {nlpResults.highlightedText}
                            </p>
                          </div>

                          
                          <div className="nlp-chart-box">
                            <h5>Частотність букв стародруку (%):</h5>
                            <div className="freq-chart">
                              {nlpResults.charFreq.length > 0 ? (
                                nlpResults.charFreq.map((item, idx) => (
                                  <div key={idx} className="chart-bar-row">
                                    <span className="bar-char">«{item.char}»</span>
                                    <div className="bar-track">
                                      <div
                                        className="bar-fill"
                                        style={{ width: `${item.val * 7}%` }}
                                      ></div>
                                    </div>
                                    <span className="bar-val">{item.val}%</span>
                                  </div>
                                ))
                              ) : (
                                <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>Недостатньо кириличних літер для побудови графіка.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="sidebar-empty">
                  <p>Оберіть місто на карті для перегляду просторово-часових даних та запуску текстового аналізу.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      
      {activeTab === 'database' && (
        <div className="projects-database-section">

          {isAdmin && (
            <div className="admin-action-bar">
              <Link
                to="/projects/create"
                className="btn-create"
              >
                + Створити проєкт
              </Link>
            </div>
          )}

          
          <div className="premium-search-wrapper glassmorphism">
            <div className="search-bar-container">
              <span className="search-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input
                type="text"
                placeholder="Пошук унікальних досліджень та цифрових корпусів..."
                value={searchQuery}
                onChange={handleSearch}
                className="premium-search-input"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="clear-search-btn" title="Очистити пошук">×</button>
              )}
            </div>

            
            <div className="quick-tags-container">
              <span className="tags-label">Швидкий фільтр:</span>
              <div className="quick-tags-list">
                {projectTags.map((tag) => {
                  const isDefault = tag === 'Усі';
                  return (
                    <button
                      key={tag}
                      className={`quick-tag-btn ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                      {!isDefault && (
                        <span
                          className="remove-tag-x"
                          onClick={(e) => handleRemoveProjectTag(e, tag)}
                          title="Видалити фільтр"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
                {showAddInput ? (
                  <form
                    onSubmit={handleAddProjectTagInline}
                    className="inline-add-form animate-fade-in"
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setShowAddInput(false);
                        setNewTagName('');
                      }
                    }}
                  >
                    <input
                      type="text"
                      className="inline-add-input"
                      placeholder="Новий фільтр..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setShowAddInput(false);
                          setNewTagName('');
                        }
                      }}
                    />
                    <button type="submit" className="inline-add-submit" title="Зберегти">✓</button>
                    <button type="button" className="inline-add-cancel" onClick={() => { setShowAddInput(false); setNewTagName(''); }} title="Скасувати">×</button>
                  </form>
                ) : (
                  <button
                    className="add-tag-btn"
                    onClick={() => setShowAddInput(true)}
                    title="Додати власний фільтр"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading && <div className="loading">Завантаження бази проєктів...</div>}

          {error && <div className="error">Помилка завантаження: {error}</div>}

          {!loading && !error && (
            <>
              {filteredProjects.length === 0 ? (
                <div className="error" style={{ background: 'transparent', border: 'none' }}>
                  Нічого не знайдено за запитом "{searchQuery}" у розділі "{selectedTag}"
                </div>
              ) : (
                <div className="projects-grid animate-fade-in">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="project-card-wrapper">
                      <Card
                        title={project.title}
                        description={project.description}
                        imageUrl={project.imageUrl}
                        extraInfo={(
                          <div className="project-meta-details">
                            <div className="project-meta-item project-direction">
                              <span className="project-meta-icon" title="Напрямок проєкту">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                              </span>
                              <span>Напрямок: {project.direction}</span>
                            </div>
                            <div className="project-meta-item project-goal">
                              <span className="project-meta-icon" title="Мета проєкту">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                              </span>
                              <span>Мета: {project.goal || 'Створення відкритих цифрових ресурсів.'}</span>
                            </div>
                          </div>
                        )}
                        actions={isAdmin ? (
                          <>
                            <Link
                              to={`/projects/edit/${project.id}`}
                              className="btn-edit"
                              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              Редагувати
                            </Link>
                            {deleteConfirmProject === project.id ? (
                              <>
                                <button
                                  className="btn-delete"
                                  onClick={() => {
                                    handleProjectDelete(project.id);
                                    setDeleteConfirmProject(null);
                                  }}
                                >
                                  Підтвердити
                                </button>
                                <button
                                  className="btn-cancel"
                                  onClick={() => setDeleteConfirmProject(null)}
                                >
                                  Скасувати
                                </button>
                              </>
                            ) : (
                              <button
                                className="btn-delete"
                                onClick={() => setDeleteConfirmProject(project.id)}
                              >
                                Видалити
                              </button>
                            )}
                          </>
                        ) : null}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}


        </div>
      )}
    </div>
  );
}