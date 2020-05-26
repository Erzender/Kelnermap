const colorTable = {
  "000": ["&0", "black"],
  "001": ["&1", "dark_blue"],
  "002": ["&9", "blue"],
  "010": ["&2", "dark_green"],
  "011": ["&3", "dark_aqua"],
  "012": ["&b", "aqua"],
  "020": ["&a", "green"],
  "021": ["&3", "dark_aqua"],
  "022": ["&b", "aqua"],
  "100": ["&4", "dark_red"],
  "101": ["&5", "dark_purple"],
  "102": ["&d", "light_purple"],
  "110": ["&6", "gold"],
  "111": ["&8", "dark_grey"],
  "112": ["&b", "aqua"],
  "120": ["&6", "gold"],
  "121": ["&a", "green"],
  "122": ["&b", "aqua"],
  "200": ["&c", "red"],
  "201": ["&d", "light_purple"],
  "202": ["&d", "light_purple"],
  "210": ["&6", "gold"],
  "211": ["&c", "red"],
  "212": ["&d", "light_purple"],
  "220": ["&e", "yellow"],
  "221": ["&e", "yellow"],
  "222": ["&f", "white"],
};

exports.convertColor = (color) => {
  if (color.length !== 7) return colorTable["000"];
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  if (isNaN(R) || isNaN(G) | isNaN(B)) return colorTable["000"];
  R = Math.round(R / 128);
  G = Math.round(G / 128);
  B = Math.round(B / 128);
  return colorTable["" + R + G + B];
};
