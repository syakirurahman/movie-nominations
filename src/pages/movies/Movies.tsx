
import React, { useState } from 'react'
import AppLoader from '../../common/components/app-loader/AppLoader'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import styles from './Movies.module.scss'
import MovieService from './Movies.service'
import { Movie, nominateMovie, removeNomination, setSearchResult } from './Movies.slice'
export default function Movies() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [fallbackMessage, setFallbackMessage] = useState<string>('')

  // Actually we can use react built in state management instead of react redux
  // But, this is what i do when deal with data that come from API
  const dispatch = useAppDispatch()
  const { nominatedMovies, searchResult } = useAppSelector(state => state.movies)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  React.useEffect(() => {
    if (searchQuery.length > 2) {
      dispatch(setSearchResult([]))
      const timer = setTimeout(() => {
        setLoading(true)
        setFallbackMessage('')
        MovieService.search(searchQuery)
          .then((res) => {
            if (res.Response === 'True' && res.Search) {
              const mappedMovies = res.Search.map(movie => {
                const nominatedMovie = nominatedMovies.find(nominatedMovie => nominatedMovie.imdbID === movie.imdbID)
                if (nominatedMovie) movie.Nomitated = true
                return movie
              })
              dispatch(setSearchResult(mappedMovies))
            } else if (res.Error) {
              setFallbackMessage(res.Error)
            }
          })
          .catch(err => {
            console.log(err)
            setFallbackMessage(err?.message)
          })
          .finally(() => {
            setLoading(false)
          })
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  // React.useEffect(() => {
  // }, [nominatedMovies])

  const handleNominateMovie = (movie: Movie) => {
    dispatch(nominateMovie(movie))
  }

  const handleRemoveNomination = (movie: Movie) => {
    dispatch(removeNomination(movie))
  }

  return(
    <div>
      <div className='form-group'>
        <img src={require('../../assets/img/magnifying-glass-light.svg').default} className={styles.searchIcon} alt="Search"/>
        <input 
          type='search'
          className={`${styles.searchField} form-control`} 
          value={searchQuery} 
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search movies"/>
          <AppLoader isActive={loading} mode="block" />
      </div>
      {
        nominatedMovies.length === 5 && 
        <div className={styles.banner}>
          <div className={styles.bannerPosters}>
            {
              nominatedMovies.map((movie) => (
                <div className={styles.bannerPoster} key={movie.imdbID}>
                  {
                    movie.Poster === 'N/A' ?
                    <div className={styles.posterPlaceholder}>No poster</div> 
                    :
                    <img src={movie.Poster} height="100" alt={movie.Title}/>
                  }
                </div>
              ))
            }
          </div>
          <h2>You Have Nominated 5 Movies</h2>
        </div>
      }
      <div className={styles.movies}>
        <div className={`${styles.searchResult} box`}>
          <AppLoader isActive={loading} mode="block" />
          <h3>Search Result { searchQuery.length > 2 && <span>for "{searchQuery}"</span> }</h3>
          {
            searchQuery.length > 2 && fallbackMessage === '' ?
            <div>
              {
                searchResult.map((movie) => (
                  <div className={styles.movie} key={movie.imdbID}>
                    {
                      movie.Poster === 'N/A' ?
                      <div className={styles.posterPlaceholder}>No poster</div> 
                      :
                      <img src={movie.Poster} width="50" alt={movie.Title}/>
                    }
                    <div className={styles.movieText}>
                      <div>({movie.Type})</div>
                      <div className={styles.movieTitle}>{movie.Title}</div>
                      <div>{movie.Year}</div>
                    </div>
                    <div>
                      <button className={`btn btn-sm btn-primary`} onClick={() => handleNominateMovie(movie)} disabled={movie.Nomitated || nominatedMovies.length >= 5}>Nominate</button>
                    </div>
                  </div>
                ))
              }
            </div>
            :
            <div>{fallbackMessage}</div>
          }
        </div>
        <div className={`${styles.nominations} box`}>
          <h3>Nominations ({nominatedMovies.length})</h3>
          <div>
              {
                nominatedMovies.map((movie) => (
                  <div className={styles.movie} key={movie.imdbID}>
                    {
                      movie.Poster === 'N/A' ?
                      <div className={styles.posterPlaceholder}>No poster</div> 
                      :
                      <img src={movie.Poster} width="50" alt={movie.Title}/>
                    }
                    <div className={styles.movieText}>
                      <div>({movie.Type})</div>
                      <div className={styles.movieTitle}>{movie.Title}</div>
                      <div>{movie.Year}</div>
                    </div>
                    <div>
                      <button className={`btn btn-sm btn-danger`} onClick={() => handleRemoveNomination(movie)}>Remove</button>
                    </div>
                  </div>
                ))
              }
            </div>
        </div>
      </div>
    </div>
  )
}
