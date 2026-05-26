let NAME_ID;

const HOOK = new Set();

export const langGet = () => NAME_ID,
  onLang = (func) => {
    if (NAME_ID !== undefined) func(NAME_ID);
    HOOK.add(func);
    return () => {
      HOOK.delete(func);
    };
  },
  langSet = (
    // [lang_name, lang_id]
    name_id,
  ) => {
    if (name_id[1] !== NAME_ID?.[1]) {
      NAME_ID = name_id;
    }
    for (const f of HOOK) f(name_id);
  };
