import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Code, Users, Zap, CheckCircle2 } from "lucide-react"
import { useCourses } from "@/context/CourseContext";
const Home = () => {
  const staticCourses = [
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
      category: "Development"
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
    }
  ]

  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Follow carefully curated learning paths"
    },
    {
      icon: Code,
      title: "Hands-on Projects",
      description: "Build real-world projects while learning"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals"
    },
    {
      icon: Zap,
      title: "Fast Track",
      description: "Accelerate your learning journey"
    }
  ]

  const { courses, loading, error } = useCourses();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Code. Compile.{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Succeed
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Elevate your programming skills, solve challenges, and unlock the world of coding possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-lg group">
                <Link to="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-primary hover:bg-primary/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary transition-all hover:shadow-lg animate-slide-in group">
                <CardHeader>
                  <div className="rounded-lg bg-gradient-primary p-3 w-fit mb-2 group-hover:animate-float">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-muted-foreground text-lg">Start your learning journey with our top courses</p>
          </div>

          {loading && 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticCourses.slice(0,3).map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all border-border hover:border-primary group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {course.level}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.students} students
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="ghost" className="w-full group/btn">
                    <Link to={`/courses/${course.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          }

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0,3).map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all border-border hover:border-primary group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {course.level}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.students} students
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                  {course.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="ghost" className="w-full group/btn">
                    <Link to={`/courses/${course.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline" className="border-primary hover:bg-primary/10">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students learning to code and advancing their careers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
                <Link to="/courses">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary hover:bg-primary/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
