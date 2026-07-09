-- 1. On demarre la transaction securisee
BEGIN;

-- 2. On applique les nouvelles donnees reelles de Douala
UPDATE parkings
SET 
    nom = CASE id
        WHEN 5 THEN 'Marche Mboppi'
        WHEN 3 THEN 'Aeroport International de Douala'
        WHEN 1 THEN 'Parking Communal Payant'
        WHEN 4 THEN 'Place Besseke'
        WHEN 2 THEN 'Hotel de Ville - Communaute Urbaine de Douala'
        ELSE nom
    END,
    quartier = CASE id
        WHEN 5 THEN 'Mboppi'
        WHEN 3 THEN 'Zone Aeroportuaire'
        WHEN 1 THEN 'Bonamoussadi'
        WHEN 4 THEN 'Bonanjo'
        WHEN 2 THEN 'Bonanjo'
        ELSE quartier
    END,
    adresse = CASE id
        WHEN 5 THEN 'Boulevard de l''Unite, Mboppi, Douala'
        WHEN 3 THEN 'Aeroport International, Douala'
        WHEN 1 THEN 'Bonamoussadi, Douala'
        WHEN 4 THEN 'Place Besseke, Bonanjo, Douala'
        WHEN 2 THEN '279 Rue Victoria, Bonanjo, Douala'
        ELSE adresse
    END,
    image = CASE id
        WHEN 5 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8vrfGlrEkMrzS2qx5q00821UJujoYIGrbWQQhEcmj3g&s=10'
        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVOmXphn6wNBXU2Mdvulx44UA8emxxXPAkiwrs6QtV2g&s=10'
        WHEN 1 THEN 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHkP4DjzsHwlHDmI0aoOPnETp04_XY9fRU7eTLP_aOnE62FltBG7kgFdv3ORW9OJQ0EV_NvwEANoR0V7pdtsCVZNu5VmffCi3fYLDjjUK29jlmcZJ3MZYzGbBE8xsqDr09eQOdjiQ=w408-h306-k-no'
        WHEN 4 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyMP6qCOuXc-x6iJk8hoU3H-VhYokhrdf7ezztwhVKaA&s=10'
        WHEN 2 THEN 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGvLGNJD8rWeaUQha5VAzGU1MLBIIH6G00yiE3haNqr7-Muu8y8Ckah7P3QhVMf3BCOVm9_X6zTg1TayQKgKUQPBx_khxLLnSOCzhLSroI_dDymtc257k3vmDuh8XoMUhpjQvdq=w408-h306-k-no'
        ELSE image
    END,
    lat = CASE id
        WHEN 5 THEN 4.045784065420561
        WHEN 3 THEN 4.014254856614041
        WHEN 1 THEN 4.092785487657357
        WHEN 4 THEN 4.046352065154609
        WHEN 2 THEN 4.0416834583502865
        ELSE lat
    END,
    lng = CASE id
        WHEN 5 THEN 9.714849065742374
        WHEN 3 THEN 9.71758490983087
        WHEN 1 THEN 9.739564089789468
        WHEN 4 THEN 9.691846310422322
        WHEN 2 THEN 9.685299593143238
        ELSE lng
    END,
    distance = CASE id
        WHEN 5 THEN 5.7
        WHEN 6 THEN 0.05
        WHEN 7 THEN 0.01
        WHEN 8 THEN 0.02
        WHEN 3 THEN 7.9
        WHEN 1 THEN 9.2
        WHEN 4 THEN 13.9
        WHEN 2 THEN 12.9
        ELSE distance
    END
WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8);

-- 3. On affiche le resultat dans le terminal pour verification visuelle
SELECT id, nom, quartier, distance, lat, lng FROM parkings ORDER BY id;

-- 4. SeCURITe : On annule tout pour ce premier essai !
COMMIT;
