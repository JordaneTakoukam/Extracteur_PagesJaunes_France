const express = require('express');
const cors = require('cors');
const { scraperPageJaune } = require('./scraper');


// const app = express();
const port = 3001;

// Pour parser les données JSON des requêtes
// app.use(express.json());

// Pour gérer les requêtes CORS
// app.use(cors());

scraperPageJaune(
    [{ besoin: "boulangerie", destination: "paris", quantite: "10" }
        // { besoin: "restaurant", destination: "marseille", quantite: 10 }
    ]
)
// utilisations de l'api
// app.use("/", dataRoutes);


// app.listen(port, () => {
//     console.log(`API listening at http://localhost:${port}`);
// });a