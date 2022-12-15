## My-Youtube

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
