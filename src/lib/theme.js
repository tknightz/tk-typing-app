function getTheme(){
  return window.localStorage.getItem("theme")
}

function setTheme(value){
  window.localStorage.setItem("theme", value)
}

export {
  getTheme,
  setTheme
}
