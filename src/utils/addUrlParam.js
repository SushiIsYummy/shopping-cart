function addUrlParam(key, value) {
  // Get the current URL parameters
  const urlSearchParams = new URLSearchParams(window.location.search);

  // Modify or add a new parameter
  urlSearchParams.set(key, value);

  // Get the modified search string
  const newSearchString = urlSearchParams.toString();

  // Get the current state
  const currentState = window.history.state;

  // Replace the current state with the modified URL
  window.history.replaceState(
    currentState,
    '',
    `${window.location.pathname}?${newSearchString}`
  );
}

export default addUrlParam;
