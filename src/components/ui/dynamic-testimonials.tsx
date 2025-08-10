import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sophie T.",
    year: "Year 11",
    content: "Got Grade 9 in Biology! The personalized feedback helped me understand complex topics so much better.",
    subject: "Biology",
    improvement: "Grade 4 to 9"
  },
  {
    name: "Mason R.",
    year: "Year 10", 
    content: "Finally understand Chemistry concepts. Went from struggling to confident in just a few weeks.",
    subject: "Chemistry", 
    improvement: "Grade 3 to 6"
  },
  {
    name: "Olivia K.",
    year: "Year 11",
    content: "The predictions were spot on! Helped me focus on exactly what I needed to improve.",
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
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur-sm border border-border/40 hover:border-border/60 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                        <span className="text-sm text-muted-foreground">{testimonial.year}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{testimonial.improvement}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.subject}</div>
                      </div>
                    </div>
                    
                    <blockquote className="text-foreground/90 leading-relaxed italic">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Gradient overlays for smooth edges */}
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};