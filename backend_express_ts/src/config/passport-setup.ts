import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../utils/db'; // Adjust the import path as necessary
import dotenv from 'dotenv';

import User from '../models/User';
import Profile from '../models/Profile';
import { UserProp } from '../types/users.type';

dotenv.config();

passport.serializeUser((user, done) => {
  const customUser = user as UserProp;
  done(null, customUser.email);
});

passport.deserializeUser(async (mail: string, done) => {
  try {
    const res = await pool.query<UserProp>('SELECT * FROM users WHERE email = $1', [mail]);
    if (res.rows.length === 0) {
      return done(new Error('User not found'), null);
    }
    done(null, res.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id as string;
        const mail = profile.emails?.[0]?.value ?? '';
        const first_name = profile?.name?.givenName ?? '';
        const last_name = profile?.name?.familyName ?? '';
        const name = profile.displayName;
        const avatar = profile?.photos?.[0]?.value ?? '';

        // check user exist or not.
        let user: UserProp = await User.checkUserExists(googleId);

        if (user && user?.email) {
          // Update last login.
          User.updateLoginTime(user?.email);
        } else {
          // Create user.
          user = await User.createUser({
            google_id: googleId,
            email: mail,
            password: 'dummy_ttn_$$$@!@',
            name: name,
          });
          // Create Profile.
          await Profile.createUserProfile({
            user_id: user.id,
            email: user.email,
            first_name: first_name,
            last_name: last_name,
            avatar: avatar,
            phone: '',
            bio: '',
            social_fb: '',
            social_linkdin: '',
            social_insta: '',
          });
        }

        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    },
  ),
);
