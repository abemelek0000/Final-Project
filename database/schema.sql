CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(30) NOT NULL UNIQUE,

    email VARCHAR(100) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    bio TEXT,

    profile_image VARCHAR(255),

    role VARCHAR(10) NOT NULL DEFAULT 'USER'
        CHECK (role IN ('USER', 'ADMIN')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE poems (

    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    content TEXT NOT NULL,

    author_id INTEGER NOT NULL,

    source_type VARCHAR(10) NOT NULL
        CHECK (source_type IN ('USER', 'ADMIN')),

    views INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE comments (

    id SERIAL PRIMARY KEY,

    poem_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_poem
        FOREIGN KEY (poem_id)
        REFERENCES poems(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE likes (

    id SERIAL PRIMARY KEY,

    poem_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_like_poem
        FOREIGN KEY (poem_id)
        REFERENCES poems(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_like_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_like
        UNIQUE (poem_id, user_id)
);

CREATE TABLE followers (

    id SERIAL PRIMARY KEY,

    follower_id INTEGER NOT NULL,

    following_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_follower
        FOREIGN KEY (follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_following
        FOREIGN KEY (following_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_follow
        UNIQUE (follower_id, following_id),

    CONSTRAINT no_self_follow
        CHECK (follower_id <> following_id)
);

ALTER TABLE users
ALTER COLUMN profile_image
SET DEFAULT 'default-avatar.png';
CREATE TABLE book_recommendations (

    id SERIAL PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    author VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    cover_image VARCHAR(255),

    created_by INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_book_admin
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);