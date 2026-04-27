export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-slate-950 px-6 py-28 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 md:p-12">
        <h1 className="text-3xl font-semibold md:text-4xl">Politique de confidentialite</h1>
        <p className="mt-6 text-slate-300">
          Cette page est en cours de formalisation juridique. DarijaDoc protege les donnees des
          patients et des cabinets avec des controles d&apos;acces stricts, une journalisation des
          actions et des mesures de securite adaptees.
        </p>
        <p className="mt-4 text-slate-300">
          Pour recevoir la version complete de la politique de confidentialite et du traitement des
          donnees, contactez l&apos;equipe a l&apos;adresse suivante:
          <a className="ml-2 text-cyan-200 underline" href="mailto:hello@darijadoc.ma">
            hello@darijadoc.ma
          </a>
        </p>
      </div>
    </section>
  );
}