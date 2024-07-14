CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE "Medication" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    count INTEGER DEFAULT 0,
    destination_count INTEGER DEFAULT 0,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "User" (id)
);

CREATE INDEX idx_user_email ON "User" (email);
CREATE INDEX idx_medication_user_id ON "Medication" (user_id);