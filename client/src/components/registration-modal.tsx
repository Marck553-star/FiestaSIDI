import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, Phone, Signal, Calendar, MessageCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { InsertRegistration } from "@shared/schema";

const createRegistrationSchema = (sport: string) => {
  const isPadelCompetitive = ["padel-masculino", "padel-femenino", "padel-mixto"].includes(sport);
  const isPadelInfantil = sport === "padel-infantil";
  const isTeamSports = ["mus", "domino", "parchis"].includes(sport);
  const isBasket = sport === "basket-3x3";
  const isRoyalty = ["rey-fiestas", "reina-fiestas"].includes(sport);
  
  if (isPadelCompetitive || isTeamSports) {
    return z.object({
      nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      telefono: z.string().optional(),
      nivel: isPadelCompetitive ? z.enum(["A", "B"], { required_error: "Selecciona un nivel" }) : z.string().optional(),
      edad: z.number().optional(),
      pareja: z.enum(["si", "no"], { required_error: "Indica si vienes con pareja" }),
      comentarios: z.string().optional(),
    });
  } else if (isPadelInfantil) {
    return z.object({
      nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      telefono: z.string().optional(),
      nivel: z.string().optional(),
      edad: z.number().optional(),
      pareja: z.enum(["si", "no"], { required_error: "Indica si vienes con pareja" }),
      comentarios: z.string().optional(),
    });
  } else if (isBasket) {
    return z.object({
      nombre: z.string().min(2, "El nombre del equipo debe tener al menos 2 caracteres"),
      telefono: z.string().optional(),
      nivel: z.string().optional(),
      edad: z.number().optional(),
      comentarios: z.string().optional(),
    });
  } else if (isRoyalty) {
    return z.object({
      nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      telefono: z.string().optional(),
      nivel: z.string().optional(),
      edad: z.number().min(5, "La edad mínima es 5 años").max(99, "La edad máxima es 99 años"),
      comentarios: z.string().optional(),
    });
  } else {
    return z.object({
      nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      telefono: z.string().optional(),
      nivel: z.string().optional(),
      edad: z.number().optional(),
      comentarios: z.string().optional(),
    });
  }
};

type RegistrationFormValues = {
  nombre: string;
  telefono?: string;
  nivel?: string;
  edad?: number;
  pareja?: string;
  comentarios?: string;
};

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sport: string;
  onSuccess: () => void;
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

export function RegistrationModal({
  isOpen,
  onClose,
  sport,
  onSuccess,
}: RegistrationModalProps) {
  const isPadelCompetitive = ["padel-masculino", "padel-femenino", "padel-mixto"].includes(sport);
  const isPadelInfantil = sport === "padel-infantil";
  const isTeamSports = ["mus", "domino", "parchis"].includes(sport);
  const isBasket = sport === "basket-3x3";
  const isRoyalty = ["rey-fiestas", "reina-fiestas"].includes(sport);
  const registrationSchema = createRegistrationSchema(sport);
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
      nivel: undefined,
      edad: undefined,
      pareja: undefined,
      comentarios: "",
    },
  });

  const createRegistrationMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("POST", "/api/registrations", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
  });

  const onSubmit = (data: RegistrationFormValues) => {
    const registrationData: InsertRegistration = {
      nombre: data.nombre,
      telefono: data.telefono || null,
      nivel: data.nivel || null,
      edad: data.edad || null,
      deporte: sport,
      pareja: data.pareja || null,
      comentarios: data.comentarios,
    };
    createRegistrationMutation.mutate(registrationData);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Inscripción - {sportTitles[sport] || sport}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {isBasket ? "Nombre Equipo" : "Nombre Completo"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isBasket ? "Introduce el nombre del equipo" : "Introduce tu nombre completo"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isPadelCompetitive || isPadelInfantil || isTeamSports) && (
              <FormField
                control={form.control}
                name="pareja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      ¿Vienes con pareja?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(isPadelCompetitive && !sport.includes("infantil")) && (
              <FormField
                control={form.control}
                name="nivel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Signal className="mr-2 h-4 w-4" />
                      Nivel de Experiencia
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A (Alto-Medio)</SelectItem>
                        <SelectItem value="B">B (Medio-Bajo)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isRoyalty && (
              <FormField
                control={form.control}
                name="edad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Edad
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5"
                        max="99"
                        placeholder="Edad"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="comentarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {isPadelCompetitive || isTeamSports ? "Nombre pareja" : "Comentarios"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder={
                        isPadelCompetitive || isTeamSports 
                          ? "Nombre de tu pareja..." 
                          : "Comentarios adicionales..."
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-festive-primary hover:bg-blue-600"
                disabled={createRegistrationMutation.isPending}
              >
                {createRegistrationMutation.isPending ? (
                  "Inscribiendo..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Inscribirse
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
