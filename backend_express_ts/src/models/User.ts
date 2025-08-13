import pool from '../utils/db';

class User {
  // Create users table (only run once)
  //   static async createTable() {
  //     const query = `
  // CREATE TABLE IF NOT EXISTS users (
  //   id SERIAL PRIMARY KEY,
  //   google_id VARCHAR(255) UNIQUE NOT NULL,
  //   email VARCHAR(100) UNIQUE NOT NULL,
  //   password TEXT,
  //   name VARCHAR(255) NOT NULL,
  //   first_name VARCHAR(50) NOT NULL,
  //   last_name VARCHAR(50) NOT NULL,
  //   avatar TEXT,
  //   created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //   last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //   status BOOLEAN DEFAULT TRUE
  // );

  // CREATE TABLE public.sessions (
  //   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  //   user_id INTEGER,
  //   token TEXT NOT NULL,
  //   hostname TEXT NOT NULL,
  //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // );
  //     `;
  //     try {
  //       await pool.query(query);
  //       console.log("Users table created successfully.");
  //     } catch (error) {
  //       console.error("Error creating table:", error);
  //     }
  //   }

  // Insert a new user
  static async createUser(
    google_id: string,
    mail: string,
    password: string,
    fullname: string,
    first_name: string,
    last_name: string,
    avatar: string,
    status: boolean,
  ) {
    const query = `
      INSERT INTO users (google_id, mail, password, name, first_name, last_name, avatar, status)
      VALUES ($1, $2, $3, $4, $5 , $6, $7, $8) RETURNING *;
    `;
    try {
      const result = await pool.query(query, [
        google_id,
        mail,
        password,
        fullname,
        first_name,
        last_name,
        avatar,
        status,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }

  // Create session
  static async createUserSession(
    user_id: number,
    token: string,
    hostname: string,
  ) {
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

  // Get all users
  static async getAllUsers() {
    const query = `SELECT * FROM users;`;
    console.log('query', query);
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(mail: string) {
    const query = `SELECT * FROM users WHERE mail = $1;`;
    try {
      const result = await pool.query(query, [mail]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Get user by ID
  static async checkUserExists(mail: string, username: string) {
    const query = `SELECT mail FROM users WHERE mail = $1 OR username = $2;`;
    try {
      const result = await pool.query(query, [mail, username]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Search user by username
  static async searchAllUsers(username: string | undefined) {
    let query = '';
    let params: string[] = [];

    try {
      if (username) {
        query = `SELECT * FROM users WHERE username ILIKE $1;`;
        params = [`%${username}%`];
      } else {
        query = `SELECT * FROM users;`;
      }
      console.log('Executing Query:', query, 'Params:', params);
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Update user login time
  static async updateLoginTime(id: number) {
    const query = `
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating login time:', error);
      throw error;
    }
  }

  // Delete user by ID
  static async deleteUser(id: number) {
    const query = `DELETE FROM users WHERE id = $1;`;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default User;
