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
}

export default Profile;
