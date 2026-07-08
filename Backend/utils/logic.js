exports.suggestCareer = (math, english, science) => {
  math = Number(math);
  english = Number(english);
  science = Number(science);

  if (math >= 70 && science >= 70) {
    return "Engineering";
  } else if (science >= 75) {
    return "Medicine";
  } else if (english >= 70) {
    return "Law or Journalism";
  } else {
    return "Business or Arts";
  }
};
