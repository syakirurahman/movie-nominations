
import MoviesSlice, { Movie, setNominatedMovies, setSearchResult } from './Movies.slice';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Movies from './Movies';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import MovieService, { OMDBResponse } from './Movies.service';
import { act } from 'react-dom/test-utils';

jest.mock('./Movies.service')
describe('Movies test', () => {
  console.log = () => {}
  beforeEach(() => {
    jest.spyOn(MovieService, 'search').mockImplementation(async () => {
      return {
        Response: "True",
        Search: [
          {
            Title: "Movie 1",
            Poster: "N/A",
            Year: "2022",
            Type: "movie",
            imdbID: "1"
          }
        ]
      } as OMDBResponse<Movie>
    })  
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should handle movie initial state', () => {
    expect(MoviesSlice(undefined, { type: 'unknown' })).toEqual({
      searchResult: [],
      nominatedMovies: []
    });
  })
  it('should display initial title / text', async () => {
    const component = render(<Provider store={store}><Movies /></Provider>)
    expect(component.getByPlaceholderText('Search movies')).toBeInTheDocument()
    expect(component.getByText(/Search Result/)).toBeInTheDocument()
    expect(component.getByText(/Nominations/)).toBeInTheDocument()
  })
  it('should handle search movies', async () => {
    const component = render(<Provider store={store}><Movies /></Provider>)
    fireEvent.change(component.getByPlaceholderText('Search movies'), { target: { value: 'Avenger' }})

    expect(component.getByTestId("searchResultTitle").innerHTML).toBe('Search Result <span>for "Avenger"</span>')
    await waitFor(async () => {
      await MovieService.search('Avenger')
      expect(component.getByTestId("searchResult").innerHTML).toBe('<div class="movie"><div class="posterPlaceholder">No poster</div><div class="movieText"><div>(movie)</div><div class="movieTitle">Movie 1</div><div>2022</div></div><div><button class="btn btn-sm btn-primary">Nominate</button></div></div>')
    })
  })
  it('should handle nomination of a movie', async () => {
    const component = render(<Provider store={store}><Movies /></Provider>)
    fireEvent.change(component.getByPlaceholderText('Search movies'), { target: { value: 'Avenger' }})

    expect(component.getByTestId("searchResultTitle").innerHTML).toBe('Search Result <span>for "Avenger"</span>')
    await waitFor(async () => {
      await MovieService.search('Avenger')
      fireEvent.click(component.getAllByText("Nominate")[0])
    })
    expect(store.getState().movies.nominatedMovies).toEqual([{
      Title: "Movie 1",
      Poster: "N/A",
      Year: "2022",
      Type: "movie",
      imdbID: "1",
      Nominated: true
    }])
  })
  it('should handle nomination removal of a movie', async () => {
    const component = render(<Provider store={store}><Movies /></Provider>)
    await act(async () => {
      await store.dispatch(setNominatedMovies([
        { Title: "Movie 1", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "1", Nominated: true }, 
        { Title: "Movie 2", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "2", Nominated: true },
        { Title: "Movie 3", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "3", Nominated: true },
        { Title: "Movie 4", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "4", Nominated: true },
        { Title: "Movie 5", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "5", Nominated: true }
      ]))
    });
    fireEvent.click(component.getAllByText("Remove")[0])
    fireEvent.click(component.getAllByText("Remove")[2])  
    expect(store.getState().movies.nominatedMovies).toEqual([
      { Title: "Movie 2", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "2", Nominated: true },
      { Title: "Movie 3", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "3", Nominated: true },
      { Title: "Movie 5", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "5", Nominated: true }
    ])
  })
  it('should display banner of 5 nominated movies', async () => {
    const component = render(<Provider store={store}><Movies /></Provider>)
    await act(async () => {
      await store.dispatch(setNominatedMovies([
        { Title: "Movie 1", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "1", Nominated: true }, 
        { Title: "Movie 2", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "2", Nominated: true },
        { Title: "Movie 3", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "3", Nominated: true },
        { Title: "Movie 4", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "4", Nominated: true },
        { Title: "Movie 5", Poster: "N/A", Year: "2022", Type: "movie", imdbID: "5", Nominated: true }
      ]))
    })
    expect(component.getByText(/You Have Nominated 5 Movies/)).toBeInTheDocument()
  })
})
