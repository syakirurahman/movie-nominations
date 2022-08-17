import { BaseService, BASE_URL } from "../../common/services/base";

export default {
  search: (keyword: string): Promise<unknown> => BaseService.get(`${BASE_URL}?s=${keyword}`) 
}