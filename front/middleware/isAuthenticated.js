export default function ({ store, redirect, $auth }) {
  if (!store.state.auth.loggedIn) {
    return redirect("/login");
  }
  if (!$auth.strategy.token.status().valid()) {
    return redirect("/login");
  }
}
