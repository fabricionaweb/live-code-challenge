class HttpService {
  httpCall(
    method: string,
    url: string,
    data: any,
    callback: (result: any) => any
  ) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (callback)
      xhr.onload = function () {
        try {
          callback(JSON.parse(this["responseText"]));
        } catch (e) {
          callback({});
        }
      };
    if (data != null) {
      console.log(JSON.stringify(data));
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    } else xhr.send();
  }
}

export { HttpService };
