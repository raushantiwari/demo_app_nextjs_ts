import { UserAddressProp, UserProp, UserSessionProp } from '../types/users.type';
import pool from '../utils/db';
import { formatQueryForDebug } from '../utils/helper';

class User {
  // Create users table (only run once)
  //   static async createTable() {
  //     const query = `

  //   CREATE TABLE IF NOT EXISTS users (
  //     id SERIAL PRIMARY KEY,
  //     google_id VARCHAR(255) UNIQUE NOT NULL,
  //     email VARCHAR(100) UNIQUE NOT NULL,
  //     password TEXT,
  //     name VARCHAR(255) NOT NULL,
  //     created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     status BOOLEAN DEFAULT TRUE
  //   );

  //    CREATE TABLE IF NOT EXISTS sessions (
  //     user_id VARCHAR(255) NOT NULL,
  //     token TEXT NOT NULL,
  //     hostname TEXT NOT NULL,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   );

  //   CREATE TABLE IF NOT EXISTS profile (
  //     id SERIAL PRIMARY KEY,
  //     user_id VARCHAR(255) UNIQUE NOT NULL,
  //     email VARCHAR(100) UNIQUE NOT NULL,
  //     first_name VARCHAR(50) NOT NULL,
  //     last_name VARCHAR(50),
  //     avatar TEXT,
  //     phone VARCHAR(100),
  //     bio TEXT,
  //     social_fb VARCHAR(100),
  //     social_linkdin VARCHAR(100),
  //     social_insta VARCHAR(100),
  //     created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   );

  //   CREATE TABLE IF NOT EXISTS address (
  //     user_id VARCHAR(255) UNIQUE NOT NULL,
  //     email VARCHAR(100) UNIQUE NOT NULL,
  //     country VARCHAR(50) NOT NULL,
  //     state VARCHAR(50),
  //     postal VARCHAR(50),
  //     city VARCHAR(100)
  //   );

  //   CREATE TABLE IF NOT EXISTS roles (
  //     role_id SERIAL PRIMARY KEY,
  //     role_name VARCHAR(50) NOT NULL
  //   );

  //  CREATE TABLE IF NOT EXISTS roles_users (
  //     user_id VARCHAR(255) UNIQUE NOT NULL,
  //     email VARCHAR(100) UNIQUE NOT NULL,
  //     role_id VARCHAR(50) NOT NULL,
  //     status BOOLEAN DEFAULT FALSE
  //   );

  //     `;
  //     try {
  //       await pool.query(query);
  //       console.log("Users table created successfully.");
  //     } catch (error) {
  //       console.error("Error creating table:", error);
  //     }
  //   }

  // Insert a new user
  static async createUser({ google_id, email, password, name }: UserProp) {
    const query = `
      INSERT INTO users (google_id, email, password, name)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    try {
      const result = await pool.query(query, [google_id, email, password, name]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }

  // Create session
  static async createUserSession({ user_id, token, hostname }: UserSessionProp) {
    const query = `
      INSERT INTO sessions (user_id, token, hostname)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    try {
      const result = await pool.query(query, [user_id, token, hostname]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting session:', error);
      throw error;
    }
  }
  // Update user login time
  static async updateLoginTime(mail: string) {
    const query = `
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *;
    `;
    try {
      const result = await pool.query(query, [mail]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating login time:', error);
      throw error;
    }
  }
  // Get user by ID, google_id or email
  static async checkUserExists(id: string) {
    const query = `SELECT id, email, google_id, password FROM users WHERE email = $1 OR google_id = $1;`;

    // Option 1: Debug (only in dev)
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        'debug Option1 @@@@@@@@@@@@@@@@@@@@@@ Executing SQL:\n',
        formatQueryForDebug(query, [id]),
      );
    }

    // Option 2:
    // Show PostgreSQL's execution plan
    // const plan = await pool.query('EXPLAIN ' + query, [id, true]);
    // console.log(plan.rows, 'debug Option2 @@@@@@@@@@@@@@@@@@@@@@@');

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
  // Get user by ID
  static async getUserById(id: string) {
    const query = `SELECT u.email, u.last_login, p.first_name, p.last_name, p.avatar FROM users as u LEFT JOIN profile as p on u.email = p.email WHERE u.email = $1 OR u.google_id = $1 AND status = $2;`;
    try {
      const result = await pool.query(query, [id, true]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Get user listing.
  static async getUserListing(status?: boolean) {
    let query = `SELECT u.email, u.last_login, u.created, u.status, p.first_name, p.last_name, p.avatar FROM users as u LEFT JOIN profile as p on u.email = p.email`;
    const values: unknown[] = [];
    // Apply status filter only if status is explicitly true or false
    if (typeof status === 'boolean') {
      query += ` WHERE u.status = $1`;
      values.push(status);
    }
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Get member detail based on id.
  static async getMemberProfile(id: number, status: boolean = true) {
    const query = `SELECT u.email, u.last_login, p.first_name, p.last_name, p.avatar, p.phone, p.bio, p.social_fb, p.social_linkdin, p.social_insta, ad1.country, ad1.state, ad1.postal, ad1.city  FROM users as u LEFT JOIN profile as p on u.email = p.email LEFT JOIN address as ad1 ON ad1.email = u.email WHERE u.id = $1  AND u.status = $2`;
    try {
      const result = await pool.query(query, [id, status]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Update address based on email address.
   * @param address
   * @returns
   */
  static async upsertUserAddress(address: UserAddressProp) {
    try {
      const { email, user_id, country, state, postal, city } = address;

      if (!email) {
        throw new Error('Email is required.');
      }

      // UPSERT query
      const query = `
      INSERT INTO address (user_id, email, country, state, postal, city)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        country = EXCLUDED.country,
        state = EXCLUDED.state,
        postal = EXCLUDED.postal,
        city = EXCLUDED.city
      RETURNING *;
    `;

      const values = [user_id, email, country, state, postal, city];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error upserting user address:', error);
      throw error;
    }
  }

  /**
   * Delete user session
   * @param token
   */
  static async deleteSessionToken(token: string) {
    const query = `DELETE FROM sessions WHERE token = $1;`;
    try {
      const result = await pool.query(query, [token]);
      return (result.rowCount ?? 0) > 0; // true if deleted, false otherwise
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
}

export default User;
