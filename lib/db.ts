import path from "path";
import Database from "better-sqlite3";
import type { Database as db } from "better-sqlite3";

export default function DB() {
  const dbPath = path.join(process.cwd(), "database.sqlite");
  const db = new Database(dbPath);
  CreateTables(db);
  return db;
}

export function CreateTables(db: db) {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS provinces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      safetyStatus TEXT NOT NULL CHECK (safetyStatus IN ('safe', 'warning', 'danger')),
      image TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      deleted BOOLEAN NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS place_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      deleted BOOLEAN NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      typeId INTEGER NOT NULL REFERENCES place_types(id),
      provinceId INTEGER NOT NULL REFERENCES provinces(id),
      image TEXT NOT NULL,
      safetyStatus TEXT NOT NULL CHECK (safetyStatus IN ('safe', 'warning', 'danger')),
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      deleted BOOLEAN NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL REFERENCES users(id),
      placeId INTEGER NOT NULL REFERENCES places(id),
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      UNIQUE(userId, placeId)
    );

    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL REFERENCES users(id),
      placeId INTEGER NOT NULL REFERENCES places(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, placeId)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      provinceId INTEGER NOT NULL REFERENCES provinces(id),
      image TEXT NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'finished', 'cancelled')) DEFAULT 'active',
      deleted BOOLEAN NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Uncomment this function to create an admin user
// UPDATE users
// SET role = 'admin'
// WHERE email = 'admin@gmail.com';

// select * from users
