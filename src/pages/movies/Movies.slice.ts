import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../redux/store";

export interface Movie {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
  Nomitated?: boolean
}
export interface MoviesState {
  searchResult: Movie[]
  nominatedMovies: Movie[]
}


let nominatedMovies: Movie[] = [];
const existing = localStorage.getItem('nominatedMovies')
if (existing) {
  nominatedMovies = JSON.parse(existing) as Movie[]
}
const initialState: MoviesState = {
  searchResult: [],
  nominatedMovies
}

const slice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchResult: (state, action: PayloadAction<Movie[]>) => {
      state.searchResult = action.payload
    },
    setNomitatedMovies: (state, action: PayloadAction<Movie[]>) => {
      state.nominatedMovies = action.payload
      localStorage.setItem('nomitatedMovies', JSON.stringify(action.payload))
    },
  }
})


export const { setSearchResult, setNomitatedMovies } = slice.actions

export const nominateMovie = (movie: Movie): AppThunk => (dispatch, getState) => {
  const nominatedMovie: Movie = { ...movie, Nomitated: true }
  const newNominatedMovies = [...getState().movies.nominatedMovies, nominatedMovie]
  console.log('newNominatedMovies', newNominatedMovies)
  dispatch(setNomitatedMovies(newNominatedMovies))
  setTimeout(() => { dispatch(refreshSearchResult())}, 100)
}

export const removeNomination = (movie: Movie): AppThunk => (dispatch, getState) => {
  const nominatedMovies: Movie[] = [...getState().movies.nominatedMovies]
  const newNominatedMovies = nominatedMovies.filter(nominated => nominated.imdbID !== movie.imdbID)
  console.log('newNominatedMovies', newNominatedMovies)
  dispatch(setNomitatedMovies(newNominatedMovies))
  setTimeout(() => { dispatch(refreshSearchResult())}, 100)
}

const refreshSearchResult = (): AppThunk => (dispatch, getState) => {
  const nominatedMovies = getState().movies.nominatedMovies
  const searchResult = JSON.parse(JSON.stringify(getState().movies.searchResult)) as Movie[]
  const newSearchResult = searchResult.map(movie => {
    const nominatedMovie = nominatedMovies.find(nominatedMovie => nominatedMovie.imdbID === movie.imdbID)
    if (nominatedMovie) movie.Nomitated = true
    else movie.Nomitated = false
    return movie
  })
  dispatch(setSearchResult(newSearchResult))
}

export default slice.reducer