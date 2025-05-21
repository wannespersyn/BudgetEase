import Navbar from "../../components/navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-orange-50 text-black">
      <Navbar active="Home" />
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">BudgetEase</h1>
        <p className="text-xl mb-6">Een cloud-native personal finance tracker gebouwd voor moderne gebruikers.</p>
        <p>BudgetEase helpt je om inkomsten, uitgaven en budgetten eenvoudig te beheren via een veilige, schaalbare Azure-gebaseerde architectuur.</p>

    
        
      </section>
    </main>
  );
}
