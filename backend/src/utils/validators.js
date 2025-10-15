// utils/validators.js

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password (min 6 chars)
function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// Validate course data
function validateCourseData({ title, slug, category, price }) {
  if (!title || !slug) return { valid: false, message: 'Title and slug are required' };
  if (price < 0) return { valid: false, message: 'Price must be >= 0' };
  const validCategories = ['1-6', '7-10', '11-12', 'FullStack', 'AWS', 'AI-ML'];
  if (category && !validCategories.includes(category)) {
    return { valid: false, message: 'Invalid category' };
  }
  return { valid: true };
}

module.exports = { isValidEmail, isValidPassword, validateCourseData };
