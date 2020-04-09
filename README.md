# COVID-19-Widget
COVID-19 Cases map widget using data from Community

Clone repository in a new directory.

Initialize libraries: 
```npm install```

Run locally - dev: 
```npm start```

navigate to localhost:3000 to view

Run production build for deployment: 
```npm run build:prod```

This command creates a 'dist' folder. Place the contents of this folder in a directory on website (using ftp etc..)

Updating data: Using blade runner (two files required):

Overall World COVID-19 data needs to be pushed to a file labeled 'data.json' in the /data directory where production build was saved. 

Daily COVID-19 update data needs to be pushed to files labeled 'countries.json' in the same /data directory