import passport from "passport";
import { Strategy } from "passport-discord";
import { config } from "dotenv";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

config()

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUser.findById(id)
    
    return findUser ? done(null, findUser) :  done(null, null)
  } catch (error) {
    done(error, null);
  }
});


export default passport.use(
  new Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ['identify','email']
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        let findUser

        try {
            // Check if user already exists in DB
            findUser = await DiscordUser.findOne({ discordId: profile.id });
        } catch (error) {
            return done(error, null)
        }

        try {
            // If user does not exist in DB, create new user
            if (!findUser) {
              const newUser = new DiscordUser({
                username: profile.username,
                discordId: profile.id,
                email: profile.email,
              });

              const newSavedUser = await newUser.save();
              return done(null, newSavedUser);
            }

            return done(null, findUser)
        } catch (error) {
            console.error(error)
            return done(error, null)
        }
        

        
    }
  )
);