import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Users, Star } from "lucide-react"
import { useCourses } from "@/context/CourseContext";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const { courses, loading, error} = useCourses();

  const coursess = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      description: "Master DSA with hands-on practice and real-world problems. Learn sorting, searching, trees, graphs, and dynamic programming.",
      level: "Intermediate",
      duration: "12 weeks",
      students: 1200,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
      category: "Programming"
    },
    {
      id: 2,
      title: "Python Programming Masterclass",
      description: "Learn Python from basics to advanced topics. Perfect for beginners starting their coding journey.",
      level: "Beginner",
      duration: "8 weeks",
      students: 1500,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop",
      category: "Programming"
    },
    {
      id: 3,
      title: "Java Programming Masterclass",
      description: "Ace your JAVA interviews with real-world case studies and scalable architecture patterns.",
      level: "Advanced",
      duration: "6 weeks",
      students: 450,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      category: "Programming"
    },
    {
      id: 4,
      title: "Web Developement Masterclass",
      description: "Ace your Web Developement interviews with real-world case studies and scalable architecture patterns.",
      level: "Advanced",
      duration: "6 weeks",
      students: 450,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
      category: "Development"
    },
    {
      id: 5,
      title: "Machine Learning Masterclass",
      description: "Ace your Machine Learning interviews with real-world case studies and scalable architecture patterns.",
      level: "Advanced",
      duration: "6 weeks",
      students: 450,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      category: "AI/ML"
    },
    {
      id: 6,
      title: "System Design Masterclass",
      description: "Ace your System Design interviews with real-world case studies and scalable architecture patterns.",
      level: "Advanced",
      duration: "6 weeks",
      students: 450,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=600&h=400&fit=crop",
      category: "Development"
    }
  ]

  // Extract unique categories from courses
  const categories = ["All", ...new Set(courses.map(course => course.category))]

  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.filter(course => course.category === selectedCategory)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Intermediate":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "Advanced":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive courses designed to take you from beginner to expert. Learn at your own pace with hands-on projects.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex justify-center space-x-4">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-muted-foreground border-muted-foreground hover:bg-primary/10"
              } transition`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <Card 
              key={course.id} 
              className="overflow-hidden hover:shadow-xl transition-all border-border hover:border-primary group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
                
              </CardHeader>

              <CardFooter className="flex justify-between items-center">
                <Badge variant="outline" className="border-primary/50">
                  {course.category}
                </Badge>
                <Button asChild variant="ghost" className="group/btn">
                  <Link to={`/${course.slug}`}>
                    Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-hero border border-border">
          <h2 className="text-2xl md:text-3xl font-bold">Can't Find What You're Looking For?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Contact us for custom learning paths or suggest a course you'd like to see
          </p>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Courses
