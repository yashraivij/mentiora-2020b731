import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sophie T.",
    year: "Year 11",
    content: "Saved me £2,400 on private tuition! Got an A* in Biology and my parents couldn't believe how much money we saved compared to my friends with tutors.",
    savings: "£2,400",
    subject: "Biology",
    improvement: "C to A*"
  },
  {
    name: "Mason R.",
    year: "Year 10", 
    content: "My mum was paying £50/hour for Chemistry tutoring. Mentiora got me better results for less than £10/month - saved us over £1,800 this year!",
    savings: "£1,800",
    subject: "Chemistry", 
    improvement: "D to B"
  },
  {
    name: "Olivia K.",
    year: "Year 11",
    content: "Instead of expensive tutoring sessions, I used Mentiora and jumped from grade 5 to grade 9 in Maths. Saved my family £3,200 and got into my dream sixth form!",
    savings: "£3,200",
    subject: "Mathematics",
    improvement: "Grade 5 to 9"
  },
  {
    name: "Ethan M.",
    year: "Year 10",
    content: "Was struggling with Physics and my parents were considering a £60/hour tutor. Mentiora helped me achieve grade 8 for a fraction of the cost - saved £2,100!",
    savings: "£2,100", 
    subject: "Physics",
    improvement: "Grade 4 to 8"
  },
  {
    name: "Zara H.",
    year: "Year 11",
    content: "Private tutoring was going to cost us £2,800. Mentiora gave me personalized feedback that was even better than my tutor, and I saved all that money!",
    savings: "£2,800",
    subject: "English Literature",
    improvement: "Grade 6 to 9"
  },
  {
    name: "Liam S.",
    year: "Year 10",
    content: "My parents were shocked when I got grade 9 in Chemistry using just Mentiora. We saved over £1,900 compared to what my friends spent on tutors!",
    savings: "£1,900",
    subject: "Chemistry",
    improvement: "Grade 5 to 9"
  },
  {
    name: "Ava P.",
    year: "Year 11", 
    content: "Tutoring sessions were £45/hour and not helping. Mentiora's AI feedback was so much better and cost 95% less - saved £2,300 and got my target grades!",
    savings: "£2,300",
    subject: "Geography",
    improvement: "Grade 5 to 8"
  },
  {
    name: "Noah W.",
    year: "Year 10",
    content: "My parents almost hired a £55/hour tutor for History. Mentiora's personalized approach was incredible and saved us £2,640 while getting me grade 8!",
    savings: "£2,640",
    subject: "History", 
    improvement: "Grade 4 to 8"
  },
  {
    name: "Isla B.",
    year: "Year 11",
    content: "Instead of paying £50/hour for Biology tutoring, I used Mentiora and improved from grade 6 to grade 9. Saved my family £2,000 and got into medical school!",
    savings: "£2,000",
    subject: "Biology",
    improvement: "Grade 6 to 9"
  },
  {
    name: "Oscar J.",
    year: "Year 10",
    content: "Maths tutor was £60/hour and wasn't working. Mentiora's smart feedback helped me jump 3 grades and saved us £2,880 - best investment ever!",
    savings: "£2,880",
    subject: "Mathematics",
    improvement: "Grade 4 to 7"
  },
  {
    name: "Mia C.",
    year: "Year 11",
    content: "Private Computer Science tutoring was going to cost £2,200. Mentiora gave me better explanations and practice questions - saved all that money and got grade 9!",
    savings: "£2,200",
    subject: "Computer Science",
    improvement: "Grade 5 to 9"
  },
  {
    name: "Leo A.",
    year: "Year 10",
    content: "My parents were paying £48/hour for English tutoring. Mentiora's personalized essays feedback was so much better and saved us £1,920 this year!",
    savings: "£1,920",
    subject: "English Language",
    improvement: "Grade 5 to 8"
  }
];

export const DynamicTestimonials = () => {
  // Duplicate testimonials for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden py-16">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-bold mb-6"
        >
          <Star className="h-4 w-4 mr-2 text-emerald-600 animate-pulse" />
          Real Students, Real Savings
        </motion.div>
        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Students Saving <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Thousands</span> on Tutoring
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how Year 10 & 11 students achieved top grades while saving money their families would have spent on expensive private tutoring.
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
              className="flex-shrink-0 w-96"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-emerald-600 font-semibold text-sm">{testimonial.year}</p>
                    </div>
                    <Quote className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Money Saved:</span>
                      <span className="text-emerald-600 font-bold text-lg">{testimonial.savings}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Subject:</span>
                      <span className="text-blue-600 font-semibold">{testimonial.subject}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Improvement:</span>
                      <span className="text-purple-600 font-semibold">{testimonial.improvement}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
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