require("dotenv").config(); // if you use .env
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Mentor = require("./models/Mentor"); // adjust if your models folder is elsewhere

async function fixMentorPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/elearn");

    const mentors = await Mentor.find();
    console.log(`Found ${mentors.length} mentors.`);

    for (const m of mentors) {
      if (!m.password.startsWith("$2b$")) {
        m.password = await bcrypt.hash(m.password, 10);
        await m.save();
        console.log(`✅ Fixed password for: ${m.email}`);
      }
    }

    console.log("🎉 All mentor passwords checked and updated!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  }
}

fixMentorPasswords();
