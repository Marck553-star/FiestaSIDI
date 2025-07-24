import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface SportsGridProps {
  stats: { [key: string]: number };
  onOpenRegistration: (sport: string) => void;
}

const sportsConfig = [
  {
    category: "Padel",
    color: "from-green-500 to-emerald-600",
    hoverColor: "hover:border-green-500 hover:bg-green-50",
    badgeColor: "bg-green-100 text-green-800",
    sports: [
      { key: "padel-masculino", name: "Masculino" },
      { key: "padel-femenino", name: "Femenino" },
      { key: "padel-mixto", name: "Mixto" },
      { key: "padel-infantil", name: "Infantil" },
    ],
  },
  {
    category: "Tenis",
    color: "from-blue-500 to-blue-600",
    hoverColor: "hover:border-blue-500 hover:bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-800",
    sports: [
      { key: "tenis-masculino", name: "Masculino" },
      { key: "tenis-femenino", name: "Femenino" },
      { key: "tenis-infantil", name: "Infantil" },
    ],
  },
  {
    category: "Ping Pong",
    color: "from-orange-500 to-amber-600",
    hoverColor: "hover:border-orange-500 hover:bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-800",
    sports: [
      { key: "pingpong-masculino", name: "Masculino" },
      { key: "pingpong-femenino", name: "Femenino" },
      { key: "pingpong-infantil", name: "Infantil" },
    ],
  },
  {
    category: "Basket",
    color: "from-red-500 to-red-600",
    hoverColor: "hover:border-red-500 hover:bg-red-50",
    badgeColor: "bg-red-100 text-red-800",
    sports: [{ key: "basket-3x3", name: "3x3" }],
  },
  {
    category: "Juegos de Mesa",
    color: "from-purple-500 to-purple-600",
    hoverColor: "hover:border-purple-500 hover:bg-purple-50",
    badgeColor: "bg-purple-100 text-purple-800",
    sports: [
      { key: "mus", name: "Mus" },
      { key: "domino", name: "Dominó" },
      { key: "parchis", name: "Parchís" },
      { key: "cartas-uno", name: "Cartas UNO" },
    ],
  },
  {
    category: "Estrategia",
    color: "from-indigo-500 to-indigo-600",
    hoverColor: "hover:border-indigo-500 hover:bg-indigo-50",
    badgeColor: "bg-indigo-100 text-indigo-800",
    sports: [
      { key: "ajedrez", name: "Ajedrez" },
      { key: "poker", name: "Poker" },
    ],
  },
  {
    category: "Eventos Especiales",
    color: "from-pink-500 to-rose-600",
    hoverColor: "hover:border-pink-500 hover:bg-pink-50",
    badgeColor: "bg-pink-100 text-pink-800",
    sports: [
      { key: "rey-fiestas", name: "Rey Fiestas" },
      { key: "reina-fiestas", name: "Reina Fiestas" },
    ],
  },
];

export function SportsGrid({ stats, onOpenRegistration }: SportsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sportsConfig.map((category) => (
        <Card key={category.category} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className={`bg-gradient-to-r ${category.color} px-4 py-3`}>
            <h3 className="text-white font-semibold">{category.category}</h3>
          </div>
          <CardContent className="p-4 space-y-3">
            {category.sports.map((sport) => (
              <Button
                key={sport.key}
                variant="outline"
                className={`w-full justify-between p-3 ${category.hoverColor} transition-all group`}
                onClick={() => onOpenRegistration(sport.key)}
              >
                <span className="font-medium text-gray-900">{sport.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={category.badgeColor}>
                    {stats[sport.key] || 0}
                  </Badge>
                  <Plus className="h-4 w-4 text-gray-400 group-hover:text-current" />
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
