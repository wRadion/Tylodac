function match(string, regexp) {
  const m = string.match(regexp);
  return m ? m.length : 0;
}

export default {
  get: function(language, word) {
    var keystrokes = 0;

    // "Default"
    keystrokes += match(word, /[a-z]/g) * 1;
    keystrokes += match(word, /[A-Z]/g) * 2;

    switch (language) {
      case 'code':
      case 'english':
        keystrokes += match(word, /[0-9-=\[\]'\\,.\/`]/g) * 1;
        keystrokes += match(word, /[~!@#$%^&*()_+{}"|?>]/g) * 2;
        break;
      case 'french':
        keystrokes += match(word, /[²&é"'\(è_çà\)=$ù*,;:!<\/+-]/g) * 1;
        keystrokes += match(word, /[0-9°¨£%µ?.§>âêûîô€]/g) * 2;
        keystrokes += match(word, /[äëÿüïöÄËÜÏÖÂÊÛÎÔìò]/g) * 3;
        keystrokes += match(word, /[ÀÈÙÌÒÇÉ]/g) * 4;
        keystrokes += match(word, /[ŒœŸ]/g) * 5;
        break;
    }

    return keystrokes;
  }
}
