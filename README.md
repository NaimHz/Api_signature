
# Signature de fichier API




### Les routes

Route de création de compte :

```http
  GET http://localhost:3000/auth/register
```

- Route de connexion à votre compte (obligatoire la création de compte ne suffit pas a vous génerer un token) :
```http
  POST http://localhost:3000/auth/login
```
- Route qui va vous permettre de générer un fichier signer, qui sera sauvegarder sur le disque en version non-signée et en version signée, mais également sauvegardé en base, vous devez pour ceci inserer votre fichier dans le champ "file" de votre requête, et votre code magique dans le champ "code" !
```http
  POST http://localhost:3000/files/upload
```
- Route qui va vous permettre de décrypter votre fichier, et afficher le message cacher. Si ce fichier a déja été vérifié le compteur "décrypt" sera actualisé en base.
```http
  POST http://localhost:3000/auth/login
```
- Route qui récupères touts les files qui ont déja été signés.
```http
  GET http://localhost:3000/files
```


## Start

Pour ouvrir ce projet clonez le dépot, ensuite créer et éditez le fichier .env qui contiendra vos infos en base et devra être structuré comme ceci :

```bash
JWT_SECRET_CODE=''
TOKEN_TIME_VALIDATION=""

DB_HOST=""
DB_PORT=""
DB_NAME=""
DB_USERNAME=""
DB_PASSWORD=""
```

Et ensuite :

```bash
npm install
```

Et enfin pour le démarrer :
```bash
npm run start:dev
```

MCD :

![alt text](https://ibb.co/PvNTZ3x1)
