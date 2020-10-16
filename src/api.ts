import { API_URL } from "./constants";
import { HttpService } from "./httpService";

export interface SaveFavoriteBody {
  from: string;
  to: string;
}

function saveFavoriteCurrency({ from, to }: SaveFavoriteBody): Promise<any> {
  const http = new HttpService();

  return new Promise((resolve) => {
    const onResponse = (response: any) => {
      resolve(response);
    };

    http.httpCall(
      "PUT",
      `${API_URL}/Favorite?fromCode=${from}&toCode=${to}`,
      null,
      onResponse
    );
  });
}

export { saveFavoriteCurrency };
