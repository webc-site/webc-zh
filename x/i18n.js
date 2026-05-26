let LANG;

const HOOK = new Set();

export const langGet = () => LANG,
  onLang = (func) => {
    if (LANG !== undefined) func(LANG);
    HOOK.add(func);
    return () => {
      HOOK.delete(func);
    };
  },
  langSet = (lang) => {
    if (lang !== LANG) {
      LANG = lang;
    }
    for (const f of HOOK) f(lang);
  };
