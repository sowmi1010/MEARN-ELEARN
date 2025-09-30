// hash.js
const bcrypt = require("bcryptjs");

(async () => {
  const hash = await bcrypt.hash("mentor123", 10);
  console.log("Hashed password:", hash);
})();

