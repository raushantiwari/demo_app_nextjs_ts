import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../utils/db'; // Adjust the import path as necessary
import dotenv from 'dotenv';

dotenv.config();

interface User {
  id: number;
  google_id: string;
  email: string;
  name: string;
  avatar: string;
}

passport.serializeUser((user, done) => {
  const customUser = user as User;
  done(null, customUser.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const res = await pool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
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
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value ?? '';
        const first_name = profile?.name?.givenName ?? '';
        const last_name = profile?.name?.familyName ?? '';
        const name = profile.displayName;
        const avatar = profile?.photos?.[0]?.value ?? '';

        const res = await pool.query<User>('SELECT * FROM users WHERE google_id = $1', [googleId]);

        let user: User;

        if (res.rows.length > 0) {
          user = res.rows[0];
        } else {
          const insertRes = await pool.query<User>(
            'INSERT INTO users (google_id, mail, password, name, first_name, last_name, avatar, status) VALUES ($1, $2, $3, $4, $5 , $6, $7, $8) RETURNING *',
            [googleId, email, 'dummy_ttn_$$$@!@', name, first_name, last_name, avatar, true],
          );

          user = insertRes.rows[0];
        }

        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    },
  ),
);
