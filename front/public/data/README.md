# Jeux de données de l'application

## `instat-rgph2018-cultures.csv`

**Source : INSTAT Madagascar — Recensement Général de la Population et de l'Habitation (RGPH) 2018.**
Répartition des ménages agricoles selon le type de culture pratiquée, par région.

| Colonne | Contenu |
|---|---|
| `region` | Nom de la région tel qu'il figure dans le tableau INSTAT (découpage 2018, 22 régions). |
| `regions_carte` | Région(s) correspondante(s) dans `regions24.geojson` (découpage actuel, 24 régions), séparées par `;`. Vatovavy et Fitovinany partagent la valeur de l'ancienne région Vatovavy Fitovinany ; Ambatosoa celle d'Analanjirofo, dont elle faisait partie en 2018. Vide pour la ligne nationale. |
| `riziculture` … `fruits_legumes` | Pourcentage (%) des ménages de la région qui pratiquent ce type de culture. Un ménage peut pratiquer plusieurs cultures : les colonnes ne s'additionnent pas à 100. |
| `menages_total` | Effectif total des ménages de la région. |

La dernière ligne (`MADAGASCAR`) donne les valeurs nationales.

Types de culture : riziculture, autres céréales (maïs, sorgho…), tubercules (manioc, patate douce, pomme de terre…),
légumineuses (haricot, arachide, pois du Cap…), cultures industrielles, cultures de rente (vanille, café, girofle, cacao…),
autres fruits et légumes.

Ces valeurs mesurent la **part des ménages qui pratiquent** une culture, et non des volumes de production.
