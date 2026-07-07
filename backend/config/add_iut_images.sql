-- Ajouter les images pour les parkings IUT
UPDATE parkings SET 
  image = 'https://images.unsplash.com/photo-1571896369950-7289c3eb357f?w=600&h=400&fit=crop&q=80'
WHERE id = 6 AND nom = 'IUT de Douala AUF';

UPDATE parkings SET 
  image = 'https://images.unsplash.com/photo-1571896369950-7289c3eb357f?w=600&h=400&fit=crop&q=80'
WHERE id = 7 AND nom = 'IUT de Douala Scolarite';

UPDATE parkings SET 
  image = 'https://images.unsplash.com/photo-1571896369950-7289c3eb357f?w=600&h=400&fit=crop&q=80'
WHERE id = 8 AND nom = 'IUT de Douala Cellule Informatique';

-- Vérification
SELECT id, nom, image FROM parkings ORDER BY id;
