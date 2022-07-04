const getUserByEmail = (email, database) => {
  for (const user_id in database) {
    if (database[user_id].email === email) {
      return database[user_id];
    }
  }
  return undefined;
};

const generateRandomString = (n) => {
  let randomString = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomString;
};

const urlsForUser = (user_id, urlDatabase) => {
  const authorizedURLs = {};
  for (const item in urlDatabase) {
    if (urlDatabase[item].userID === user_id) {
      authorizedURLs[item] = urlDatabase[item];
    }
  }
  return authorizedURLs;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };
