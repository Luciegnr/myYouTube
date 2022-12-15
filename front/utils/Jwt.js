export function jwtDecrypt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function tokenAlive(exp) {
  if (Date.now() >= exp * 1000) {
    return false;
  }
  return true;
}

// convert timestamps in elapsed time
export function elapsedTime(timestamp) {
  var d = new Date(timestamp * 1000),
    y = d.getFullYear(),
    m = d.getMonth() + 1,
    d = d.getDate(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds();
  return (
    y +
    "-" +
    (m < 10 ? "0" + m : m) +
    "-" +
    (d < 10 ? "0" + d : d) +
    " " +
    (h < 10 ? "0" + h : h) +
    ":" +
    (m < 10 ? "0" + m : m) +
    ":" +
    (s < 10 ? "0" + s : s)
  );
}
