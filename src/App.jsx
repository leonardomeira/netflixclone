import { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb.js';
import MovieRow from './Components/MovieRow';
import Header from './Components/Header';
import FeaturedMovie from './Components/FeaturedMovie';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async() => {
      //pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);
      
      //pegando o featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomlyChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomlyChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo)
    }
    loadAll();
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 20) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
        ))}
      </section>

      <footer>
        Baseado no projeto Clone do Netflix em ReactJS by B7Web<br/>
        Por Leonardo Meira<br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do <a href="https://www.tmdb.org">The Movie Database</a>
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando..." />
        </div>
      }
    </div>
  );
}