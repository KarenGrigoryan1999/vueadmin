import axios from "axios";
import router from "./router";

let API_INSTANCE = null;

class API {
  constructor() {
    this.token = localStorage.token;

    this.axios = axios.create({
      baseURL: 'https://badteachers.ru/api'
    });

    this.axios.interceptors.response.use(
      (r) => r,
      (error) => {
        const { status } = error.response;
        if (status === 401) {
          router.push("/login");
        }
        throw error;
      }
    );
  }

  static get instance() {
    if (API_INSTANCE === null) {
      API_INSTANCE = new API();
    }
    return API_INSTANCE;
  }

  set setTokens(token) {
    this.token = token;
    localStorage.token = token;
  }

  async checkToken() {
    return this._post("/auth/check-admin")
      .then((r) => {
        if (r.data.success) {
          return true;
        }
      })
      .catch((e) => {
        if (e.response && e.response.status) {
          this.logout();
          throw Error();
        }
      });
  }

  logout() {
    this.token = null;
    localStorage.removeItem("token");
  }

  _api(method, apiMethod, data) {
    let _headers = {
      "Content-Type": "application/json"
    };

    const token = this.token || null;

    if (token) {
      _headers["Authorization"] = "Bearer " + token;
    }

    return this.axios({
      method,
      url: apiMethod,
      headers: _headers,
      data: data && method !== "get" ? data : {},
      params: data && method === "get" ? data : {}
    });
  }

  _get(endpoint, data) {
    return this._api("get", endpoint, data);
  }

  _post(endpoint, data) {
    return this._api("post", endpoint, data);
  }

  _put(endpoint, data) {
    return this._api("put", endpoint, data);
  }

  _delete(endpoint, data) {
    return this._api("delete", endpoint, data);
  }
}

export default API;
