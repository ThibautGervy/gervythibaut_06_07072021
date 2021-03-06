const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
//const cryptojs = require('crypto-js');

const User = require('../models/User');
const { request } = require('../app');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
           
            const user = new User({
               //email: cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString(), // cryptage de l'email
                email: req.body.email,
                password: hash
                
            });
            console.log("bonjour");
            user.save()

                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/*exports.login = (req, res, next) => {
    //const cryptedResearchedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
    User.findOne( { email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé!' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect!' })
                    }
                    const newToken = jsonwebtoken.sign(
                        { userId: user._id },
                        process.env.TOKEN_KEY,
                        { expiresIn: '24h' }
                    );
                    req.session.token = newToken; // Création du cookie
                    res.status(200).json({
                        userId: user._id,
                        token: newToken  // Le front attend un token en json
                    })
                })
        })
        .catch(error => res.status(500).json({ error }));
};*/

exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          console.log("utilisateur non trouvé");
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Bcrypt compare ici le hashage du mot de passe
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jsonwebtoken.sign(
                // Attribution du token d'authentification qui durera 24h
                { userId: user._id },
                process.env.TOKEN,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
  
