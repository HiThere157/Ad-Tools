const fs = require("fs");

fs.readFile("C:\\Users\\kochda7\\Desktop\\test.json", (err, buff) => {
  if (err) {
    console.error(err);
    return;
  }
  const content = buff.toString();

  const excluded = content.replace(/State/g, "1")
  console.log(excluded)
});