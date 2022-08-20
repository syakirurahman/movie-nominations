import { BaseService, BASE_URL } from "../../common/services/base";
import { Movie } from "./Movies.slice";

export interface OMDBResponse<M> {
  Response: "True" | "False",
  Error?: string
  Search?: M[],
  totalResults?: string
}

const MovieService = {
  search: (keyword: string): Promise<OMDBResponse<Movie>> => BaseService.get(`${BASE_URL}&type=movie&s=${keyword}`) 
}

export default MovieService