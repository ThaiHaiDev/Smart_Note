# Run the server

## Config file .env:
- Create new .env file
- Copy .env.example to .env.
- Create MySQL connection in the .env 
- Example: <br>
  `DB_CONNECTION=mysql` <br>
  `DB_HOST=127.0.0.1`<br>
  `DB_PORT=3770`<br>
  `DB_DATABASE=`<br>
  `DB_USERNAME=`<br>
  `DB_PASSWORD=`<br>
Fill in your connection configuration.


## Available Scripts
- `composer update`
- `php artisan key:generate`
- `php artisan serve` (init the developement server)
- `php artisan migrate` (init the MySQL tables)
- `php artisan db:seed --class=DatabaseSeeder` (init the seed data)
