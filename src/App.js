
import React, {useState, useEffect} from 'react';
import './App.css';
import Menu from './Menu';
import NewsGrid from './NewsGrid';
import SearchBar from './SearchBar';
import OptionsButton from './OptionsButton';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(1);
  const [category, setCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingAll, setIsSearchingAll] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState('grid');

  // API keys comes from https://newsapi.org, the free version has a 100 request limit per day
  const apiKey = process.env.REACT_APP_API_KEY;
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false; 
  });

  const resetHome = () => {
    setActive(1); 
    setCategory('general'); 
    setSearchTerm(''); 
    setIsSearchingAll(false); 
    
  };

  const links = [
    { id: 1, name: 'General', value: 'general'},
    { id: 2, name: 'Business', value: 'business'},
    { id: 3, name: 'Entertainment', value: 'entertainment'},
    { id: 4, name: 'Health', value: 'health'},
    { id: 5, name: 'Science', value: 'science'},
    { id: 6, name: 'Sports', value: 'sports'},
    { id: 7, name: 'Technology', value: 'technology'}
];

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  
  while (currentIndex !== 0) {
    
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const toggleDarkMode = () => {
  setDarkMode(prevMode => {
    const newMode = !prevMode;
    localStorage.setItem('darkMode', newMode ? 'true' : 'false'); 
    
    return newMode;
  });
};

useEffect(() => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  setDarkMode(isDarkMode);
  
}, []);


  const searchAllArticles = async (term) => {
    setIsSearchingAll(true);
    if (term.trim() === '') {
      setItems([]); 
      setIsSearchingAll(false); 
      return; 
    }
  
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${term}&apiKey=${apiKey}&pageSize=100&sortBy=publishedAt&language=en`);
      const data = await response.json();
      if (data.articles) {
        const validItems = data.articles.filter(article => article.title !== "[Removed]");
        setItems(validItems);
      } else {
        setItems([]); 
        console.error('No articles found or API response structure has changed:', data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setItems([]); 
    }
  };

  const fetchNews = async (categoryToFetch, searchTermToUse) => {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${categoryToFetch}&q=${searchTermToUse}&apiKey=${apiKey}&pageSize=100`);
    const data = await response.json();
    const validItems = data.articles.filter(article => article.title !== "[Removed]");
    if (searchTermToUse) {
      const filteredItems = validItems.filter((item) => item.title.toLowerCase().includes(searchTermToUse.toLowerCase()));
      setItems(filteredItems);
    } else {
      setItems(validItems);
    }
  };

  const changeCategory = (newCategory) => {
    setIsSearchingAll(false);
    setCategory(newCategory);
    setSearchTerm('');

  };

  useEffect(() => {
    
    const fetchNewsByCategory = async (category, searchTermToUse) => {
      
      const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}&pageSize=100`;
      const response = await fetch(url);
      const data = await response.json();
      const validItems = data.articles.filter(article => article.title !== "[Removed]");
      return searchTermToUse
        ? validItems.filter(article => article.title.toLowerCase().includes(searchTermToUse.toLowerCase()))
        : validItems;
    };
  
    
    const fetchAllCategoriesNews = async () => {
      const categories = ['entertainment', 'science', 'sports', 'technology'];
      try {
        const promises = categories.map(category => 
          fetchNewsByCategory(category, searchTerm)
        );
        const results = await Promise.all(promises);
        const combinedArticles = results.flat();
        const shuffledArticles = shuffleArray(combinedArticles);
        setItems(shuffledArticles);
      } catch (error) {
        console.error('Error fetching all categories news:', error);
      }
    };
  
    if (isSearchingAll) {
      searchAllArticles(searchTerm); 
    } else if (category === 'general') {
      fetchAllCategoriesNews(); // Fetch all categories if the selected category is general
    } else {
      fetchNews(category, searchTerm); // Fetch news for a specific category
    }
  }, [category, searchTerm, isSearchingAll]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <h1 className='title' onClick={resetHome}>{isSearchingAll ? 'Search Results' : <>FEEDS<FontAwesomeIcon icon={faCircle} className="red-dot" /></>}</h1>
      <OptionsButton isDarkMode={darkMode} toggleDarkMode={toggleDarkMode} layoutStyle={layoutStyle} setLayoutStyle={setLayoutStyle} />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchAll={searchAllArticles}/>
      <Menu active={active} setActive={setActive} setCategory={changeCategory} links={links}/>
      {isSearchingAll ? (
      <div className="search-results">
        
        <NewsGrid className={`news-${layoutStyle}`} items={items}/>
      </div>
    ) : (
      <NewsGrid className={`news-${layoutStyle}`} items={items}/>
    )}

      <Footer />
      
    </div>
  );
}

export default App;