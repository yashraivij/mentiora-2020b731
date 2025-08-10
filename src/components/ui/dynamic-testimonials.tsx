import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sophie T.",
    year: "Year 11",
    content: "Got A* in Biology! The personalized feedback helped me understand complex topics so much better.",
    subject: "Biology",
    improvement: "C to A*"
  },
  {
    name: "Mason R.",
    year: "Year 10", 
    content: "Finally understand Chemistry concepts. Went from struggling to confident in just a few weeks.",
    subject: "Chemistry", 
    improvement: "D to B"
  },
  {
    name: "Olivia K.",
    year: "Year 11",
    content: "The AI predictions were spot on! Helped me focus on exactly what I needed to improve.",
    subject: "Mathematics",
    improvement: "Grade 5 to 9"
  },
  {
    name: "Ethan M.",
    year: "Year 10",
    content: "Love how it adapts to my learning style. Physics actually makes sense now!",
    subject: "Physics",
    improvement: "Grade 4 to 8"
  },
  {
    name: "Zara H.",
    year: "Year 11",
    content: "The essay feedback is incredible - better than any teacher comments I've received.",
    subject: "English Literature",
    improvement: "Grade 6 to 9"
  },
  {
    name: "Liam S.",
    year: "Year 10",
    content: "Boosted my confidence so much. Now I actually enjoy studying Chemistry!",
    subject: "Chemistry",
    improvement: "Grade 5 to 9"
  }
];

export const DynamicTestimonials = () => {
  // Duplicate testimonials for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h3 className="text-xl font-semibold text-foreground mb-2">
          What students are saying
        </h3>
        <p className="text-sm text-muted-foreground">
          Real results from Year 10 & 11 students
        </p>
      </motion.div>

      {/* Scrolling testimonials */}
      <div className="relative">
        <motion.div 
          className="flex gap-6"
          animate={{ 
            x: [0, -100 * testimonials.length] 
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60,
              ease: "linear",
            },
          }}
          style={{ width: `${extendedTestimonials.length * 400}px` }}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              className="flex-shrink-0 w-80"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-card border shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
                      <p className="text-primary text-xs">{testimonial.year}</p>
                    </div>
                    <Quote className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed text-xs">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{testimonial.subject}</span>
                    <span className="text-primary font-medium">{testimonial.improvement}</span>
                  </div>
                  
                  <div className="flex justify-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Gradient overlays for smooth edges */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};