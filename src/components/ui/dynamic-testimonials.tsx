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
    <div className="relative overflow-hidden py-12">

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
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 blur-sm"></div>
                <Card className="relative h-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base tracking-tight">{testimonial.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                            {testimonial.year}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                        <Quote className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-5 leading-relaxed text-sm font-medium">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <span className="text-sm font-semibold text-gray-700">{testimonial.subject}</span>
                        <span className="text-blue-600 font-bold text-sm">{testimonial.improvement}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-current drop-shadow-sm" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
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