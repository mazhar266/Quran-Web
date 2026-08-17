const SCRIPT = `
(function () {
  try {
    var raw = window.localStorage.getItem("quran-reader-settings-v1");
    var theme = raw ? JSON.parse(raw).theme : null;
    document.documentElement.dataset.theme = theme || "sepia";
  } catch (e) {
    document.documentElement.dataset.theme = "sepia";
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
