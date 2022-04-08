export default function DarkModeBtn({ theme, onClick }){
  return (
    <button className="btn-mode" onClick={onClick}>
      { theme === "light" ? "☀️ " : "🌙" }
    </button>
  )
}
