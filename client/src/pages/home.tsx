import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { SportsGrid } from "@/components/sports-grid";
import { RegistrationModal } from "@/components/registration-modal";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  stats: { [key: string]: number };
  totalPlayers: number;
}

export default function Home() {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const { toast } = useToast();

  const { data: statsData, refetch: refetchStats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const handleOpenRegistration = (sport: string) => {
    setSelectedSport(sport);
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationModalOpen(false);
    refetchStats();
    toast({
      title: "¡Inscripción realizada con éxito!",
      description: "Tu registro ha sido procesado correctamente.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-header shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="text-white text-2xl w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Fiestas Urbanización SIDI 2025</h1>
                <p className="text-blue-100">Sistema de Inscripciones Deportivas</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsData?.totalPlayers || 0}
                  </div>
                  <div className="text-blue-100 text-sm">Jugadores Totales</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Stats Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {statsData?.totalPlayers || 0}
            </div>
            <div className="text-gray-500 text-sm">Jugadores Totales</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Deportes y Actividades Disponibles
          </h2>
          <SportsGrid
            stats={statsData?.stats || {}}
            onOpenRegistration={handleOpenRegistration}
          />
        </div>
      </main>

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        sport={selectedSport}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
