import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { X, Users, BarChart3, Download, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Registration } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const sportTitles: { [key: string]: string } = {
  "padel-masculino": "Padel Masculino",
  "padel-femenino": "Padel Femenino",
  "padel-mixto": "Padel Mixto",
  "padel-infantil": "Padel Infantil",
  "tenis-masculino": "Tenis Masculino",
  "tenis-femenino": "Tenis Femenino",
  "tenis-infantil": "Tenis Infantil",
  "pingpong-masculino": "Ping Pong Masculino",
  "pingpong-femenino": "Ping Pong Femenino",
  "pingpong-infantil": "Ping Pong Infantil",
  "basket-3x3": "Basket 3x3",
  mus: "Mus",
  domino: "Dominó",
  parchis: "Parchís",
  "cartas-uno": "Cartas UNO",
  ajedrez: "Ajedrez",
  poker: "Poker",
  "rey-fiestas": "Rey Fiestas",
  "reina-fiestas": "Reina Fiestas",
};

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeView, setActiveView] = useState<"participants" | "statistics" | "export">("participants");
  const { toast } = useToast();

  const { data: registrations = [], isLoading } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
    enabled: isOpen,
  });

  const deleteRegistrationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/registrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteRegistration = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      deleteRegistrationMutation.mutate(id);
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ["Nombre", "Teléfono", "Deporte", "Nivel", "Edad", "Comentarios", "Fecha"],
      ...registrations.map(reg => [
        reg.nombre,
        reg.telefono,
        sportTitles[reg.deporte] || reg.deporte,
        reg.nivel,
        reg.edad.toString(),
        reg.comentarios || "",
        new Date(reg.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscripciones_fiestas_sidi_2025_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Datos exportados",
      description: "Los datos se han descargado correctamente.",
    });
  };

  // Group registrations by sport
  const registrationsBySport = registrations.reduce((acc, reg) => {
    if (!acc[reg.deporte]) {
      acc[reg.deporte] = [];
    }
    acc[reg.deporte].push(reg);
    return acc;
  }, {} as { [key: string]: Registration[] });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Panel de Administración</DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 rounded-l-lg">
            <nav className="space-y-2">
              <Button
                variant={activeView === "participants" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveView("participants")}
              >
                <Users className="mr-2 h-4 w-4" />
                Participantes
              </Button>
              <Button
                variant={activeView === "statistics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveView("statistics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Estadísticas
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Datos
              </Button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeView === "participants" && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  Inscripciones por Deporte
                </h4>

                {isLoading ? (
                  <div className="text-center py-8">Cargando...</div>
                ) : Object.keys(registrationsBySport).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay inscripciones registradas aún.
                  </div>
                ) : (
                  Object.entries(registrationsBySport).map(([sport, participants]) => (
                    <Card key={sport} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-medium text-gray-900">
                            {sportTitles[sport] || sport}
                          </h5>
                          <Badge variant="secondary">
                            {participants.length} participantes
                          </Badge>
                        </div>

                        <ScrollArea className="max-h-40">
                          <div className="space-y-2">
                            {participants.map((participant) => (
                              <div
                                key={participant.id}
                                className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {participant.nombre}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {participant.telefono && participant.telefono !== "" && `Tel: ${participant.telefono} • `}
                                    {participant.nivel && participant.nivel !== "N/A" && `Nivel: ${participant.nivel} • `}
                                    {participant.edad && participant.edad !== 0 && `Edad: ${participant.edad}`}
                                  </div>
                                  {participant.comentarios && (
                                    <div className="text-sm text-gray-400 mt-1">
                                      {["padel-masculino", "padel-femenino", "padel-mixto"].includes(participant.deporte) 
                                        ? `Comentarios: ${participant.comentarios}`
                                        : `Pareja: ${participant.comentarios}`}
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteRegistration(participant.id)}
                                    disabled={deleteRegistrationMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeView === "statistics" && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  Estadísticas de Inscripciones
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {registrations.length}
                      </div>
                      <div className="text-sm text-gray-500">Total Inscripciones</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.keys(registrationsBySport).length}
                      </div>
                      <div className="text-sm text-gray-500">Deportes con Inscripciones</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {registrations.length > 0 
                          ? Math.round(registrations.reduce((sum, reg) => sum + reg.edad, 0) / registrations.length)
                          : 0}
                      </div>
                      <div className="text-sm text-gray-500">Edad Promedio</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-medium text-gray-900 mb-3">
                      Participantes por Deporte
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(registrationsBySport)
                        .sort(([,a], [,b]) => b.length - a.length)
                        .map(([sport, participants]) => (
                          <div key={sport} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {sportTitles[sport] || sport}
                            </span>
                            <Badge variant="outline">
                              {participants.length}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
