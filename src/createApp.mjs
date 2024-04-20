import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
// import "./strategies/local-strategy.mjs"
import "./strategies/local-strategy-mongo.mjs";
// import "./strategies/discord-strategy.mjs"
import MongoStore from "connect-mongo";

export function createApp() {
  // Setup Express Application
  const app = express();

  // MIDDLEWARE
  app.use(express.json());
  app.use(cookieParser("myCookieSignature"));
  app.use(
    session({
      secret: "mysecretsessionkey",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Base/Home Route

  app.get("/", (request, response) => {
    request.session.visited = true;
    response
      .status(200)
      .send({ msg: "Welcome to the Express Full Course! ⚒️" });
  });

  app.use(routes);

  // Authentication Endpoints (Passport)

  app.post("/api/auth", passport.authenticate("local"), (request, response) => {
    response.sendStatus(200);
  });

  app.get("/api/auth/status", (request, response) => {
    // console.log(`Inside /auth/status endpoint`);
    console.log(request.user);

    return request.user
      ? response.send(request.user)
      : response.sendStatus(401);
  });

  app.post("/api/auth/logout", (request, response) => {
    if (!request.user) return response.sendStatus(401);

    request.logout((err) => {
      if (err) return response.sendStatus(400);
      response.sendStatus(200);
    });
  });

  // Discord Auth Endpoints
  // app.get("/api/auth/discord", passport.authenticate('discord'))
  // app.get("/api/auth/discord/redirect", passport.authenticate('discord'), (request, response) => {
  //   console.log(request.session)
  //   console.log(request.user)
  //   response.sendStatus(200)
  // })

  return app;
}

