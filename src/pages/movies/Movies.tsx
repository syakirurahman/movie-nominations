
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import styles from './Movies.module.scss'
import { Movie, searchMovies } from './Movies.slice'
export default function Movies() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])

  // Actually we can use react built in state management instead of react redux
  // But, this is what i do when deal with data that come from API
  const dispatch = useAppDispatch()
  const { nominatedMovies } = useAppSelector(state => state.movies)
  const handleSearch = (value: string) => {
    setSearchResults([])
    setSearchQuery(value)
    if (value.length > 0) {
      const matchedResult = dispatch(searchMovies(value))
      setSearchResults(matchedResult)  
    }
  }

  React.useEffect(() => {
    if (nominatedMovies) {
      setSearchQuery(`${nominatedMovies.name} (${nominatedMovies.totalSubordinates})`)
    } else {
      setSearchQuery('')
    }
  }, [nominatedMovies])

  return(
    <div>
      <div className='form-group'>
        <input 
          type='search'
          className={`${styles.searchField} form-control`} 
          value={searchQuery} 
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search movies"/>
      </div>
      <div className={styles.movies}>
        <div className={`${styles.searchResult} box`}>
        </div>
        <div className={`${styles.nominations} box`}>

        </div>
      </div>
    </div>
  )
}
