import jsonwebtoken from "jsonwebtoken"; //For sign the jwt data
import passport from 'passport';
import passportHTTP from "passport-http";
import { User } from "../../Model/user.js";
import { expressjwt as jwt } from "express-jwt";

passport.use(new passportHTTP.BasicStrategy(async (username, password, done) => {
    const user = await User.findOne({ email: username });
    
    if (user && user.isPasswordCorrect(password)) {
      return done(null, user);
    }
    return done({ statusCode: 401, message: "Invalid credentials" }, false);
  }));
  
  export const basicAuthentication = passport.authenticate("basic", {
    session: false,
  });



export function login(req, res, next) {
    const { _id, isOwner, email, firstName, lastName } = req.user;
    const token = { id: _id, isOwner, email, firstName, lastName };
  
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret is not defined");
  
    const options = { expiresIn: "5h" }; // Imposta la scadenza a 5 secondi
  
    const tokenSigned = jsonwebtoken.sign(token, secret, options);
  
    return res.status(200).json({ error: false, errormessage: "", token: tokenSigned });
  }