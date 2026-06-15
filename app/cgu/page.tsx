import Link from 'next/link';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300 p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <Link href="/auth" className="text-red-500 hover:text-red-400 mb-4 inline-block">
            ← Retour à la connexion
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-gray-500">Dernière mise à jour : 15 Juin 2026</p>
        </div>

        {/* Content */}
        <article className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Présentation</h2>
            <p>
              Bienvenue sur <strong>CineMatch</strong>. En accédant à notre plateforme, vous acceptez les présentes Conditions Générales d'Utilisation (CGU). 
              CineMatch est un service de recommandation cinématographique utilisant l'intelligence artificielle pour personnaliser votre expérience de visionnage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Accès et Comptes Utilisateurs</h2>
            <p>
              L'accès à CineMatch nécessite la création d'un compte. Vous êtes responsable de la confidentialité de vos identifiants. 
              En créant un compte, vous confirmez avoir plus de 13 ans (ou l'âge requis dans votre juridiction). 
              En cochant la case "J'accepte les CGU" lors de votre inscription, vous validez officiellement votre consentement à ces termes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Protection des Données (RGPD)</h2>
            <p>
              Conformément à notre politique de confidentialité, CineMatch collecte certaines données (nom d'utilisateur, préférences de films) 
              nécessaires au bon fonctionnement de notre algorithme d'IA. 
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Le consentement est stocké sous forme de booléen (true) au moment de votre inscription.</li>
              <li>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</li>
              <li>Nous ne revendons aucune donnée personnelle à des tiers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Propriété Intellectuelle</h2>
            <p>
              La structure, le design, le logo et les algorithmes de CineMatch sont la propriété exclusive de CineMatch. 
              Les affiches de films et les métadonnées cinématographiques sont fournies à des fins d'illustration et restent la propriété de leurs détenteurs respectifs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation de Responsabilité</h2>
            <p>
              CineMatch utilise des algorithmes d'intelligence artificielle pour générer des recommandations. Bien que nous nous efforcions d'offrir la meilleure pertinence :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Nous ne garantissons pas que les recommandations plairont systématiquement à l'utilisateur.</li>
              <li>Nous ne pouvons être tenus responsables des erreurs techniques ou des interruptions de service.</li>
              <li>Le service est fourni "en l'état" (as is).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Modification des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces CGU à tout moment. Toute modification sera notifiée aux utilisateurs via la plateforme. 
              Votre utilisation continue du service après modification vaut acceptation des nouveaux termes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Droit Applicable</h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tout litige relatif à l'interprétation ou à l'exécution de ces conditions relèvera de la compétence exclusive des tribunaux français.
            </p>
          </section>
        </article>

        {/* Footer */}
        <div className="pt-10 border-t border-white/10 text-sm text-gray-600">
          <p>Pour toute question concernant ces CGU, veuillez nous contacter à l'adresse support@cinematch.com</p>
        </div>
      </div>
    </div>
  );
}