# Adnois Jumpstart

My opinionated boilerplate for AdonisJs

## Installation

### 1. Install cli tools

```sh
yarn global add @adonisjs/cli
```

### 2. Create databases

A feature is coming soon to adonis to make this automatic

```sql
CREATE DATABASE databasename;
CREATE DATABASE databasename_test;
```

### 3. Run setup utility

```sh
./setup.sh
```

*See code at `app/Commands/Setup.js`*

### 4. Run migrations

```sh
adonis migration:run
```

### 5. Run server

```sh
adonis serve --dev
```

*--dev adds code reloading*
