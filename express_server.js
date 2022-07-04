const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "RandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "RandomID2",
  },
};

const users = {
  RandomID: {
    id: "RandomID",
    email: "u@example.com",
    password: "1",
  },
  RandomID2: {
    id: "RandomID2",
    email: "u2@example.com",
    password: "2",
  },
};

function generateRandomString(n) {
  let result = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const checkRegistration = (email) => {
  for (const user_id in users) {
    if (users[user_id].email === email) {
      return users[user_id];
    }
  }
  return undefined;
};

const urlsForUser = (user_id) => {
  const result = {};
  for (const item in urlDatabase) {
    if (urlDatabase[item].userID === user_id) {
      result[item] = urlDatabase[item];
    }
  }
  return result;
};

app.get("/", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(401).send("Please <a href='/login'>login</a> first.");
  }
  const templateVars = {
    urls: urlsForUser(req.cookies["user_id"]),
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.redirect("/login");
  }
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID !== req.cookies["user_id"]) {
    return res
      .status(403)
      .send("Invalid credentials. Please <a href='/login'>try again!</a>");
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    return res.status(404).send("Short URL Not Found");
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send(
        "Missing email and/or password. Please <a href='/register'>try again!</a>"
      );
  }
  if (checkRegistration(email)) {
    return res
      .status(400)
      .send(
        "This email already exists. Please <a href='/register'>try again!</a>"
      );
  }
  const id = generateRandomString(6);
  users[id] = { id, email, password };
  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(404).send("Please <a href='/login'>try again!</a>");
  }
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"],
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send("URL can not be found.");
  }
  if (urlDatabase[req.params.id].userID !== req.cookies["user_id"]) {
    return res
      .status(403)
      .send("No permission to update. Please <a href='/login'>try again!</a>");
  }
  urlDatabase[req.params.id].longURL = req.body.updatedLongURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("This URL can not be found");
  }
  if (urlDatabase[req.params.shortURL].userID !== req.cookies["user_id"]) {
    return res
      .status(403)
      .send("No permission to delete. Please <a href='/login'>try again!</a>");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send(
        "Require input for both email and password. Please <a href='/login'>try again!</a>"
      );
  }
  const user = checkRegistration(email);
  if (!user || user.password !== password) {
    return res
      .status(403)
      .send(
        "Incorrect email or password. Please <a href='/login'>try again!</a>"
      );
  }
  res.cookie("user_id", user.id);
  res.redirect("urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
