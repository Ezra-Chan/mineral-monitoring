// app.js
import { getToken } from "./utils/account";

App({
  onLaunch() {
    getToken();
  },
});
