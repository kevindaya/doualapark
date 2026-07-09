-- Ajouter les images pour les parkings IUT


UPDATE parkings SET 
  image = 'https://i.ibb.co/zjpSrMG/iut-de-douala-auf.jpg'
WHERE id = 6;

UPDATE parkings SET 
  image = 'https://i.ibb.co/BWWjqGV/iut-de-douala-scolarite.jpg'
WHERE id = 7;

UPDATE parkings SET 
  image = 'https://i.ibb.co/SwPLBWCN/iut-de-douala-cellule-info.jpg'
WHERE id = 8;


-- Vérification
SELECT id, nom, image FROM parkings ORDER BY id;
