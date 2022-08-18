import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../../redux/store';

export interface Movie {
  movieId: number,
  name: string,
  managerId?: number,
  subordinates?: Movie[],
  totalSubordinates?: number
}
export interface MoviesState {
  searchResult: Movie[],
  nominatedMovies: Movie[]
}

const initialState: MoviesState = {
  searchResult: [],
  nominatedMovies: []
}

const slice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchResult: (state, action: PayloadAction<Movie[]>) => {
      state.searchResult = action.payload
      localStorage.setItem('searchResult', JSON.stringify(action.payload))
    },
    setNomitatedMovies: (state, action: PayloadAction<Movie[]>) => {
      state.nominatedMovies = action.payload
    },
  }
})

export const { setSearchResult, setNomitatedMovies } = slice.actions

export const searchMovies = (keyword: string): AppThunk<Movie[]> => (dispatch, getState) => {
  const searchResult = getState().movies.searchResult
  const matchedResult = searchResult.filter(movie => movie.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1)

  return matchedResult
}


export default slice.reducer