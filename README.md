# My-Youtube

## Consignes / Objectifs

- Pour commencer cette nouvelle plateforme, nous devons mettre en place une API REST. Dans notre cas, l'API délivre ses réponses au format JSON.
- Comprendre la différence entre une architecture monolithique et microservices.
- Faire communiquer des microservices via des APIs.
- Utilisation d'outils comme Docker pour déployer des applications et des infrastructures.
- Nous devons fournir 5 microservices : 
    1. Un Site de diffusion :
        Le développement de ce service doit se faire             avec Node.js en utilisant VueJS et Nuxt.
    2. L'encodage : 
        Lorsqu'un utilisateur met une vidéo en ligne,           elle doit être convertie dans un format et une           définition spécifique.
        Afin que l'encodage ne soit pas bloquant durant         la navigation de l'utilisateur, nous souhaitons         qu'il s'exécute en tâche de fond grâce à un             microservice.
    3. Mailer : 
        Certains événements du site nécessitent un envoi         de mail à l'utilisateur : un changement de mot           de passe, à la fin de l'encodage...
        Vous devrez donc mettre en place un microservice         sous la forme d'une API qui permettra d'envoyer         des mails.
        Le microservice prend pour seuls paramètres             l'adresse email et le type de mail à envoyer. Le         mail doit être envoyé par Postfix.
    4. Recherche : 
        Vous devez mettre en place un moteur de                 recherche avec une recherche syntaxique.
        Votre moteur de recherche doit se mettre à jour         à chaque ajout, modification ou suppression de         vidéo. Lorsque l’utilisateur fait une recherche de vidéos, la requête passe par le moteur de recherche.
        Utilisation d'Elasticsearch.
    5. L'API-REST 


### Configuration pour Traefik
Avant de lancer les containers il faut modifier le fichier /etc/hosts pour ajouter les noms de domaines que nous souhaitons:

```php
#Docker TIC-API3   
127.0.0.1 dev.api3.local
127.0.0.1 mongo.api3.local
127.0.0.1 front.api3.local
127.0.0.1 api.api3.local
127.0.0.1 my-youtube.local
127.0.0.1 dev.mailer.local
127.0.0.1 postfix.mailer.local
127.0.0.1 encoding.local
```

### Configuration des certificats 
`brew install mkcert`

Afin que les domaines soient "activés" il faut créer les certificats associés. 
Les certificats doivent être crées dans /traefik/certs/.
Il sera surement nécessaire de supprimer les certificats déjà existants dans le dossier et de les recréer.

Voici les commandes à executer afin de créer tous les certificats nécessaires: 

```php!
mkcert dev.api3.local "*.dev.api3.local" -e 365
mkcert mongo.api3.local "*.mongo.api3.local" -e 365
mkcert my-youtube.local "*.my-youtube.local" -e 365
mkcert dev.mailer.local "*.dev.mailer.local" -e 365
mkcert postfix.mailer.local "*.postfix.mailer.local" -e 365
mkcert traefik.docker.localhost "*.traefik.docker.localhost" -e 365
mkcert encoding.local "*.encoding.local" -e 365
```

(Le `-e 365` indique que le certificat est valide pendant un an)


### Lancement des containers
Une fois les configurations de base réalisées vous allez pouvoir run les containers. Pour tous les lancer en même temps vous vous placer à la racine du projet et lancez cette commande : 

```php!
cd traefik && docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../mailer/api && docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../postfix && docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../../search && docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../encoding && docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../front && docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../api docker-compose down && docker-compose -f docker-compose.yml up -d && cd ../
```
Voici ce que retrouvez dans l'app docker après cela.
![](https://i.imgur.com/XuWYOwi.png)


### Site web 

Si tous les containers sont up vous pouvez donc y accéder le premier à tester est traefik pour ça tester l'url : https://traefik.docker.localhost, vous devriez accéder à une page comme celle ci: 
![](https://i.imgur.com/zbKGb7j.png)

Et en cliquant sur l'onglet http vous pourrez consulter l'ensemble des sites gérés par traefik : 
![](https://i.imgur.com/4r5YIqg.png)

Voici donc les liens de nos containers : 
```javascript!
MyYoutube :
=> api : https://dev.api3.local/
=> front:  https://my-youtube.local/
=> mailer: https://dev.mailer.local/
=> mongodb: https://mongo.api3.local/
=> encoding : https://encoding.local/
=> search : https://search.api3.local/
```

### Problème avec les certificats 
Il est possible que pour accéder aux sites vous tombiez tout d'abord sur une page comme celle ci : 
![](https://i.imgur.com/uNaKSbQ.png)


Pour ne pas avoir à passer par les paramètres avancés à chaque rechargement de page il faut : 
1. Ouvrir le trousseau d'accès
<img src="https://i.imgur.com/luqCOxg.png" style="max-width: 60%" />

2. Se rendre dans la partie 'système'

3. Puis faire glisser (domaine par domaine pas tout en même temps) les certificats que nous avons générés dans /traefik/certs/ (ceux sans le -key). Il est possible que cela renvoie une erreur de lecture mais le certificat devrait tout de même s'ajouter.
![](https://i.imgur.com/1vmeDA5.png)

4. Une fois que le certificat apparait dans la liste on double clique dessus puis dans 'se fier' on modifie les réglages pour 'tout approuver':
![](https://i.imgur.com/iOT59xR.png)

Après cela il est sûrement nécessaire de relancer l'ensemble des containers, puis normalement si tout s'est bien passé vous devriez accéder aux sites sans rencontrer de problème.

### La base de données
La base de données est donc elle aussi créée via docker ainsi pour y accéder via mongodb atlas il faut configurer une nouvelle connexion avec les informations qui ont été passées dans le docker-compose de la db cf: '/api/docker-compose.yml'

![](https://i.imgur.com/JepGAd7.png)

Voici donc l'uri à passer pour se connecter via compass : `mongodb://myapi:myapi@localhost:27018/?authMechanism=DEFAULT`

### Résultats

### Site de diffusion

![](https://i.imgur.com/CMJHz7m.jpg)
![](https://i.imgur.com/aZ3gloR.jpg)
![](https://i.imgur.com/ldyMmOe.jpg)

### Mailer
| Envoie de mail lors de l'inscription | Envoie de mail lors de l'encodage d'une vidéo |
| -------- | -------- | 
| ![](https://i.imgur.com/JkUfjxe.png)     | ![](https://i.imgur.com/Ma9UdYJ.png)     | 

### Recherche
![](https://i.imgur.com/DsN4tNv.png)

