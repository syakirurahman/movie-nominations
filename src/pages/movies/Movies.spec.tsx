
import MoviesSlice, { MoviesState } from './Movies.slice';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Movies from './Movies';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';


describe('Movies test', () => {
  it('should handle movie initial state', () => {
    expect(MoviesSlice(undefined, { type: 'unknown' })).toEqual({
      searchResult: [],
      nominatedMovies: null
    });
  })
  it('should handle search movies', async () => {
    const component = render(<Provider store={store}><Movies /></Provider>)
    expect(component.getByPlaceholderText('Search movies')).toBeInTheDocument()
    fireEvent.change(component.getByPlaceholderText('Search movies'), { target: { value: 'Bruce' }})
    expect(component.getByText('Bruce Wayne')).toBeInTheDocument()
  })
})
