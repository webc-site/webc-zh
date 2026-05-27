let ID;

const HOOK = new Set();

export const LANG_LI = [],
  langGet = () => ID,
  onLang = (func) => {
    if (ID !== undefined) func(ID);
    HOOK.add(func);
    return () => {
      HOOK.delete(func);
    };
  },
  langSet = (id) => {
    if (id !== ID) {
      ID = id;
    }
    for (const f of HOOK) f(id);
  };
