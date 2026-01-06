

let auteurs = [
    { id: 1, nom: "Antoine de Saint-Exupéry", nationalite: "Française" },
    { id: 2, nom: "George Orwell", nationalite: "Britannique" },
    { id: 3, nom: "Albert Camus", nationalite: "Française" }
];

let categories = [
    { id: 1, nom: "Littérature jeunesse", description: "Livres pour enfants" },
    { id: 2, nom: "Science-fiction", description: "Romans futuristes" },
    { id: 3, nom: "Roman", description: "Romans classiques" }
];

let livres = [
    { id: 1, titre: "Le Petit Prince", auteurId: 1, categorieId: 1, annee: 1943, disponible: true },
    { id: 2, titre: "1984", auteurId: 2, categorieId: 2, annee: 1949, disponible: false },
    { id: 3, titre: "L'Étranger", auteurId: 3, categorieId: 3, annee: 1942, disponible: true }
];

let adherents = [
    { id: 1, nom: "Jean Dupont", email: "jean@email.com", telephone: "0123456789", date: "2023-10-01" },
    { id: 2, nom: "Marie Martin", email: "marie@email.com", telephone: "0987654321", date: "2023-10-15" }
];

let emprunts = [
    { id: 1, livreId: 2, adherentId: 1, dateEmprunt: "2023-10-10", dateRetour: "", statut: "En cours" }
];

// Variables pour suivre ce qu'on modifie
let elementAModifier = null;
let typeAModifier = "";

// ============================================
// FONCTIONS DE NAVIGATION
// ============================================

function afficherSection(sectionId) {
    // Cacher toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Cacher le formulaire de modification
    cacherFormulaireModif();

    // Afficher la section demandée
    document.getElementById(sectionId).classList.add('active');
}

function deconnexion() {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        window.location.href = "index.html";
    }
}

// ============================================
// FORMULAIRE DE MODIFICATION
// ============================================

function afficherFormulaireModif() {
    document.getElementById('form-modif').style.display = 'block';
    document.getElementById('form-modif').scrollIntoView({ behavior: 'smooth' });
}

function cacherFormulaireModif() {
    document.getElementById('form-modif').style.display = 'none';
    document.getElementById('modif-titre').value = '';
    document.getElementById('modif-nom').value = '';
    document.getElementById('modif-email').value = '';
    document.getElementById('modif-telephone').value = '';
    document.getElementById('modif-nationalite').value = '';
    document.getElementById('modif-description').value = '';
    document.getElementById('modif-annee').value = '';
    elementAModifier = null;
    typeAModifier = "";
}

function enregistrerModification() {
    if (!elementAModifier || !typeAModifier) return;

    const id = elementAModifier;

    if (typeAModifier === "livre") {
        const livre = livres.find(l => l.id === id);
        if (livre) {
            livre.titre = document.getElementById('modif-titre').value;
            livre.annee = parseInt(document.getElementById('modif-annee').value);
            afficherLivres();
        }
    }
    else if (typeAModifier === "auteur") {
        const auteur = auteurs.find(a => a.id === id);
        if (auteur) {
            auteur.nom = document.getElementById('modif-nom').value;
            auteur.nationalite = document.getElementById('modif-nationalite').value;
            afficherAuteurs();
            chargerAuteurs();
        }
    }
    else if (typeAModifier === "categorie") {
        const categorie = categories.find(c => c.id === id);
        if (categorie) {
            categorie.nom = document.getElementById('modif-nom').value;
            categorie.description = document.getElementById('modif-description').value;
            afficherCategories();
            chargerCategories();
        }
    }
    else if (typeAModifier === "adherent") {
        const adherent = adherents.find(a => a.id === id);
        if (adherent) {
            adherent.nom = document.getElementById('modif-nom').value;
            adherent.email = document.getElementById('modif-email').value;
            adherent.telephone = document.getElementById('modif-telephone').value;
            afficherAdherents();
        }
    }

    cacherFormulaireModif();
    alert("Modification enregistrée !");
}

// ============================================
// FONCTIONS POUR LES LIVRES
// ============================================

function ajouterLivre() {
    const titre = document.getElementById('titreLivre').value;
    const auteurId = parseInt(document.getElementById('auteurLivre').value);
    const categorieId = parseInt(document.getElementById('categorieLivre').value);
    const annee = parseInt(document.getElementById('anneeLivre').value);

    if (titre && auteurId && categorieId && annee) {
        const nouveauId = livres.length + 1;
        const nouveauLivre = {
            id: nouveauId,
            titre: titre,
            auteurId: auteurId,
            categorieId: categorieId,
            annee: annee,
            disponible: true
        };

        livres.push(nouveauLivre);
        afficherLivres();
        mettreAJourListeLivresPourEmprunt();

        // Réinitialiser
        document.getElementById('titreLivre').value = '';
        document.getElementById('anneeLivre').value = '';
    } else {
        alert("Veuillez remplir tous les champs");
    }
}

function afficherLivres() {
    const tbody = document.getElementById('liste-livres');
    tbody.innerHTML = '';

    livres.forEach(livre => {
        const auteur = auteurs.find(a => a.id === livre.auteurId);
        const categorie = categories.find(c => c.id === livre.categorieId);

        tbody.innerHTML += `
            <tr>
                <td>${livre.id}</td>
                <td>${livre.titre}</td>
                <td>${auteur ? auteur.nom : 'Inconnu'}</td>
                <td>${categorie ? categorie.nom : 'Non catégorisé'}</td>
                <td>${livre.annee}</td>
                <td>${livre.disponible ? 'Oui' : 'Non'}</td>
                <td>
                    <button onclick="preparerModificationLivre(${livre.id})">Modifier</button>
                    <button onclick="supprimerLivre(${livre.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

function preparerModificationLivre(id) {
    const livre = livres.find(l => l.id === id);
    if (!livre) return;

    elementAModifier = id;
    typeAModifier = "livre";

    document.getElementById('titre-form-modif').textContent = "Modifier un Livre";
    document.getElementById('modif-titre').value = livre.titre;
    document.getElementById('modif-annee').value = livre.annee;

    // Cacher les champs inutiles
    document.getElementById('champ-nom').style.display = 'none';
    document.getElementById('champ-email').style.display = 'none';
    document.getElementById('champ-telephone').style.display = 'none';
    document.getElementById('champ-nationalite').style.display = 'none';
    document.getElementById('champ-description').style.display = 'none';

    // Afficher les champs utiles
    document.getElementById('champ-titre').style.display = 'block';
    document.getElementById('champ-annee').style.display = 'block';

    afficherFormulaireModif();
}

function supprimerLivre(id) {
    if (confirm("Supprimer ce livre ?")) {
        livres = livres.filter(livre => livre.id !== id);
        afficherLivres();
        mettreAJourListeLivresPourEmprunt();
    }
}

// ============================================
// FONCTIONS POUR LES AUTEURS
// ============================================

function ajouterAuteur() {
    const nom = document.getElementById('nomAuteur').value;
    const nationalite = document.getElementById('nationaliteAuteur').value;

    if (nom) {
        const nouveauId = auteurs.length + 1;
        const nouvelAuteur = {
            id: nouveauId,
            nom: nom,
            nationalite: nationalite
        };

        auteurs.push(nouvelAuteur);
        afficherAuteurs();
        chargerAuteurs();

        document.getElementById('nomAuteur').value = '';
        document.getElementById('nationaliteAuteur').value = '';
    }
}

function afficherAuteurs() {
    const tbody = document.getElementById('liste-auteurs');
    tbody.innerHTML = '';

    auteurs.forEach(auteur => {
        const nbLivres = livres.filter(l => l.auteurId === auteur.id).length;

        tbody.innerHTML += `
            <tr>
                <td>${auteur.id}</td>
                <td>${auteur.nom}</td>
                <td>${auteur.nationalite || 'Non spécifiée'}</td>
                <td>${nbLivres}</td>
                <td>
                    <button onclick="preparerModificationAuteur(${auteur.id})">Modifier</button>
                    <button onclick="supprimerAuteur(${auteur.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

function preparerModificationAuteur(id) {
    const auteur = auteurs.find(a => a.id === id);
    if (!auteur) return;

    elementAModifier = id;
    typeAModifier = "auteur";

    document.getElementById('titre-form-modif').textContent = "Modifier un Auteur";
    document.getElementById('modif-nom').value = auteur.nom;
    document.getElementById('modif-nationalite').value = auteur.nationalite;

    // Cacher/afficher les champs
    document.getElementById('champ-titre').style.display = 'none';
    document.getElementById('champ-annee').style.display = 'none';
    document.getElementById('champ-email').style.display = 'none';
    document.getElementById('champ-telephone').style.display = 'none';
    document.getElementById('champ-description').style.display = 'none';

    document.getElementById('champ-nom').style.display = 'block';
    document.getElementById('champ-nationalite').style.display = 'block';

    afficherFormulaireModif();
}

function supprimerAuteur(id) {
    if (confirm("Supprimer cet auteur ?")) {
        auteurs = auteurs.filter(auteur => auteur.id !== id);
        afficherAuteurs();
        chargerAuteurs();
    }
}

// ============================================
// FONCTIONS POUR LES CATÉGORIES
// ============================================

function ajouterCategorie() {
    const nom = document.getElementById('nomCategorie').value;
    const description = document.getElementById('descriptionCategorie').value;

    if (nom) {
        const nouveauId = categories.length + 1;
        const nouvelleCategorie = {
            id: nouveauId,
            nom: nom,
            description: description
        };

        categories.push(nouvelleCategorie);
        afficherCategories();
        chargerCategories();

        document.getElementById('nomCategorie').value = '';
        document.getElementById('descriptionCategorie').value = '';
    }
}

function afficherCategories() {
    const tbody = document.getElementById('liste-categories');
    tbody.innerHTML = '';

    categories.forEach(categorie => {
        const nbLivres = livres.filter(l => l.categorieId === categorie.id).length;

        tbody.innerHTML += `
            <tr>
                <td>${categorie.id}</td>
                <td>${categorie.nom}</td>
                <td>${categorie.description || 'Aucune'}</td>
                <td>${nbLivres}</td>
                <td>
                    <button onclick="preparerModificationCategorie(${categorie.id})">Modifier</button>
                    <button onclick="supprimerCategorie(${categorie.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

function preparerModificationCategorie(id) {
    const categorie = categories.find(c => c.id === id);
    if (!categorie) return;

    elementAModifier = id;
    typeAModifier = "categorie";

    document.getElementById('titre-form-modif').textContent = "Modifier une Catégorie";
    document.getElementById('modif-nom').value = categorie.nom;
    document.getElementById('modif-description').value = categorie.description;

    // Cacher/afficher les champs
    document.getElementById('champ-titre').style.display = 'none';
    document.getElementById('champ-annee').style.display = 'none';
    document.getElementById('champ-email').style.display = 'none';
    document.getElementById('champ-telephone').style.display = 'none';
    document.getElementById('champ-nationalite').style.display = 'none';

    document.getElementById('champ-nom').style.display = 'block';
    document.getElementById('champ-description').style.display = 'block';

    afficherFormulaireModif();
}

function supprimerCategorie(id) {
    if (confirm("Supprimer cette catégorie ?")) {
        categories = categories.filter(categorie => categorie.id !== id);
        afficherCategories();
        chargerCategories();
    }
}

// ============================================
// FONCTIONS POUR LES ADHÉRENTS
// ============================================

function ajouterAdherent() {
    const nom = document.getElementById('nomAdherent').value;
    const email = document.getElementById('emailAdherent').value;
    const telephone = document.getElementById('telAdherent').value;

    if (nom && email) {
        const nouveauId = adherents.length + 1;
        const nouvelAdherent = {
            id: nouveauId,
            nom: nom,
            email: email,
            telephone: telephone,
            date: new Date().toLocaleDateString('fr-FR')
        };

        adherents.push(nouvelAdherent);
        afficherAdherents();
        chargerAdherents();

        document.getElementById('nomAdherent').value = '';
        document.getElementById('emailAdherent').value = '';
        document.getElementById('telAdherent').value = '';
    }
}

function afficherAdherents() {
    const tbody = document.getElementById('liste-adherents');
    tbody.innerHTML = '';

    adherents.forEach(adherent => {
        tbody.innerHTML += `
            <tr>
                <td>${adherent.id}</td>
                <td>${adherent.nom}</td>
                <td>${adherent.email}</td>
                <td>${adherent.telephone || 'Non renseigné'}</td>
                <td>${adherent.date}</td>
                <td>
                    <button onclick="preparerModificationAdherent(${adherent.id})">Modifier</button>
                    <button onclick="supprimerAdherent(${adherent.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

function preparerModificationAdherent(id) {
    const adherent = adherents.find(a => a.id === id);
    if (!adherent) return;

    elementAModifier = id;
    typeAModifier = "adherent";

    document.getElementById('titre-form-modif').textContent = "Modifier un Adhérent";
    document.getElementById('modif-nom').value = adherent.nom;
    document.getElementById('modif-email').value = adherent.email;
    document.getElementById('modif-telephone').value = adherent.telephone;

    // Cacher/afficher les champs
    document.getElementById('champ-titre').style.display = 'none';
    document.getElementById('champ-annee').style.display = 'none';
    document.getElementById('champ-nationalite').style.display = 'none';
    document.getElementById('champ-description').style.display = 'none';

    document.getElementById('champ-nom').style.display = 'block';
    document.getElementById('champ-email').style.display = 'block';
    document.getElementById('champ-telephone').style.display = 'block';

    afficherFormulaireModif();
}

function supprimerAdherent(id) {
    if (confirm("Supprimer cet adhérent ?")) {
        adherents = adherents.filter(adherent => adherent.id !== id);
        afficherAdherents();
        chargerAdherents();
    }
}

// ============================================
// FONCTIONS POUR LES EMPRUNTS
// ============================================

function ajouterEmprunt() {
    const livreId = parseInt(document.getElementById('livreEmprunt').value);
    const adherentId = parseInt(document.getElementById('adherentEmprunt').value);

    if (livreId && adherentId) {
        const livre = livres.find(l => l.id === livreId);

        if (livre && livre.disponible) {
            const nouveauId = emprunts.length + 1;
            const nouvelEmprunt = {
                id: nouveauId,
                livreId: livreId,
                adherentId: adherentId,
                dateEmprunt: new Date().toLocaleDateString('fr-FR'),
                dateRetour: "",
                statut: "En cours"
            };

            emprunts.push(nouvelEmprunt);

            // Livre indisponible
            livre.disponible = false;

            afficherEmprunts();
            afficherLivres();
            mettreAJourListeLivresPourEmprunt();

            document.getElementById('livreEmprunt').value = '';
            document.getElementById('adherentEmprunt').value = '';
        } else {
            alert("Livre non disponible");
        }
    }
}

function afficherEmprunts() {
    const tbody = document.getElementById('liste-emprunts');
    tbody.innerHTML = '';

    emprunts.forEach(emprunt => {
        const livre = livres.find(l => l.id === emprunt.livreId);
        const adherent = adherents.find(a => a.id === emprunt.adherentId);

        tbody.innerHTML += `
            <tr>
                <td>${emprunt.id}</td>
                <td>${livre ? livre.titre : 'Inconnu'}</td>
                <td>${adherent ? adherent.nom : 'Inconnu'}</td>
                <td>${emprunt.dateEmprunt}</td>
                <td>${emprunt.dateRetour || 'Non retourné'}</td>
                <td>${emprunt.statut}</td>
                <td>
                    ${emprunt.statut === "En cours" ?
                `<button onclick="retournerEmprunt(${emprunt.id})">Retourner</button>` :
                ''}
                </td>
            </tr>
        `;
    });
}

function retournerEmprunt(id) {
    if (confirm("Marquer comme retourné ?")) {
        const emprunt = emprunts.find(e => e.id === id);

        emprunt.statut = "Retourné";
        emprunt.dateRetour = new Date().toLocaleDateString('fr-FR');

        // Livre disponible
        const livre = livres.find(l => l.id === emprunt.livreId);
        if (livre) {
            livre.disponible = true;
        }

        afficherEmprunts();
        afficherLivres();
        mettreAJourListeLivresPourEmprunt();
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function chargerAuteurs() {
    const select = document.getElementById('auteurLivre');
    select.innerHTML = '<option value="">Choisir un auteur</option>';

    auteurs.forEach(auteur => {
        select.innerHTML += `<option value="${auteur.id}">${auteur.nom}</option>`;
    });
}

function chargerCategories() {
    const select = document.getElementById('categorieLivre');
    select.innerHTML = '<option value="">Choisir une catégorie</option>';

    categories.forEach(categorie => {
        select.innerHTML += `<option value="${categorie.id}">${categorie.nom}</option>`;
    });
}

function mettreAJourListeLivresPourEmprunt() {
    const select = document.getElementById('livreEmprunt');
    select.innerHTML = '<option value="">Choisir un livre</option>';

    livres.filter(livre => livre.disponible).forEach(livre => {
        select.innerHTML += `<option value="${livre.id}">${livre.titre}</option>`;
    });
}

function chargerAdherents() {
    const select = document.getElementById('adherentEmprunt');
    select.innerHTML = '<option value="">Choisir un adhérent</option>';

    adherents.forEach(adherent => {
        select.innerHTML += `<option value="${adherent.id}">${adherent.nom}</option>`;
    });
}

// ============================================
// INITIALISATION
// ============================================

function initialiser() {
    afficherLivres();
    afficherAuteurs();
    afficherCategories();
    afficherAdherents();
    afficherEmprunts();

    chargerAuteurs();
    chargerCategories();
    mettreAJourListeLivresPourEmprunt();
    chargerAdherents();

    afficherSection('livres');
}
window.onload = initialiser;