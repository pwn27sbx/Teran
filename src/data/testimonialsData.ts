export interface Testimonial {
  name: string;
  text: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Dra. Jenny",
    text: "La pasión y sensibilidad de esta carrera son extraordinarias para mí, me siento muy feliz de poder aportar con mis conocimientos a la mejoría de muchos pacientes que veo diariamente con uno u otro problema de salud, es realmente satisfactorio poder ayudar a seres tan especiales.",
    image: "/testimonials/jenny.webp"
  },
  {
    name: "Dr. Jorge",
    text: "La veterinaria es una ciencia de mucho estudio y aprendizaje constantes, el poder llevar esos conocimientos a mis alumnos y guiar su camino me genera una satisfacción de saber que algún día serán ellos los que salven la vida de estos seres nobles a quienes respeto y quiero.",
    image: "/testimonials/jorge.webp"
  },
  {
    name: "Dra. Juana",
    text: "Cualquier persona puede amar a su mascota pero, ante una enfermedad, la única persona verdaderamente capacitada para curarla será el Médico Veterinario. Es por ello mi compromiso de ser mejor cada día.",
    image: "/testimonials/juana.webp"
  },
  {
    name: "Dra. Gabriela",
    text: "Ejerzo mi profesión en el día a día tratando y cuidando de estas maravillosas vidas y procurando siempre dar la mejor calidad de atención para mejorar sus vidas y condiciones.",
    image: "/testimonials/gabriela.webp"
  }
];
