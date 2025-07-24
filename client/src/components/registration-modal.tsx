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
  
  if (isPadelCompetitive) {
    return z.object({
      nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      telefono: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
      nivel: z.enum(["A", "B"], {
        required_error: "Selecciona un nivel",
      }),
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
  const registrationSchema = createRegistrationSchema(sport);
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nombre: "",
      telefono: isPadelCompetitive ? "" : undefined,
      nivel: isPadelCompetitive ? undefined : "N/A",
      edad: isPadelCompetitive ? undefined : 0,
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
      telefono: data.telefono || "",
      nivel: data.nivel || "N/A",
      edad: data.edad || 0,
      deporte: sport,
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
                    Nombre Completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce tu nombre completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPadelCompetitive && (
              <>
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+34 123 456 789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </>
            )}

            <FormField
              control={form.control}
              name="comentarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {isPadelCompetitive ? "Comentarios (Opcional)" : "Pareja (Opcional)"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder={isPadelCompetitive ? "Algún comentario adicional..." : "Nombre de tu pareja si vas acompañado/a..."}
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
