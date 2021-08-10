const express = require('express');
const router = express.Router();

// Controleurs des routes sauces
const saucesCtrl = require('../controllers/sauces');

// Middlewares avec auth pour sécuriser les connexions et Multher pour la gestion des images
const auth = require('../middleware/auth'); //vérifier que l'utilisateur est authentifié, avant d'authoriser l'envoie
const multer = require('../middleware/multer');

//les routes
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer,  saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.updateSauce); 
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;
