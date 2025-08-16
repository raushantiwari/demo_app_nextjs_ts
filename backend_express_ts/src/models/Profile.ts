import { UserAddressProp, UserProfileProp } from '../types/users.type';
import pool from '../utils/db';

class Profile {
  // Create Profile
  static async createUserProfile({
    user_id,
    email,
    first_name,
    last_name,
    avatar,
    phone,
    bio,
    social_fb,
    social_linkdin,
    social_insta,
  }: UserProfileProp) {
    const query = `
      INSERT INTO profile (user_id, email, first_name, last_name, avatar, phone, bio, social_fb, social_linkdin, social_insta)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
    `;
    try {
      const result = await pool.query(query, [
        user_id,
        email,
        first_name,
        last_name,
        avatar,
        phone,
        bio,
        social_fb,
        social_linkdin,
        social_insta,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting profile:', error);
      throw error;
    }
  }

  // Create address
  static async createUserAddress({
    user_id,
    email,
    country,
    state,
    postal,
    city,
  }: UserAddressProp) {
    const query = `
      INSERT INTO address (user_id, email, country, state, postal, city)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    try {
      const result = await pool.query(query, [user_id, email, country, state, postal, city]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting session:', error);
      throw error;
    }
  }

  /**
   * Update user profile information
   * @param address
   * @returns
   */
  static async upsertUserProfile(profile: UserProfileProp) {
    const query = `
      INSERT INTO profile (
        user_id, email, first_name, last_name, phone, bio, 
        social_fb, social_linkdin, social_insta
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      ON CONFLICT (email)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        bio = EXCLUDED.bio,
        social_fb = EXCLUDED.social_fb,
        social_linkdin = EXCLUDED.social_linkdin,
        social_insta = EXCLUDED.social_insta
      RETURNING *;
    `;

    const values = [
      profile.user_id,
      profile.email,
      profile.first_name,
      profile.last_name,
      profile.phone,
      profile.bio,
      profile.social_fb,
      profile.social_linkdin,
      profile.social_insta,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error upserting user profile:', error);
      throw error;
    }
  }
}

export default Profile;
