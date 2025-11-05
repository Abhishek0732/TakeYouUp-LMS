import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Award, Users, BookOpen, TrendingUp } from "lucide-react"

const About = () => {
  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Courses Offered", value: "50+", icon: BookOpen },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Certifications", value: "8,500+", icon: Award }
  ]

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make quality programming education accessible to everyone, regardless of their background or location. We believe in empowering individuals through knowledge."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To become the world's leading platform for learning programming, where students can transform their careers and achieve their dreams through technology."
    },
    {
      icon: Award,
      title: "Our Values",
      description: "Excellence in education, commitment to student success, innovation in teaching methods, and building a supportive learning community."
    }
  ]

  const team = [
    {
      name: "Abhishek Verma",
      role: "Founder & CEO",
      bio: "Software Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    }
  ]

  return (
    <div className="min-h-screen  py-12">
      <div className="container  mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TakeYouUp
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to transform lives through quality programming education. 
            Learn from industry experts and join a community of passionate learners.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:border-primary transition-all">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-xl transition-all border-border hover:border-primary group">
                <CardHeader>
                  <div className="rounded-lg bg-gradient-primary p-3 w-fit mb-3 group-hover:animate-float">
                    <value.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <Card className="mb-16 border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              TakeYouUp was founded in 2020 with a simple yet powerful vision: to make programming education 
              accessible to everyone. What started as a small online tutoring service has grown into a 
              comprehensive learning platform serving thousands of students worldwide.
            </p>
            <p>
              Our founders, experienced software engineers from top tech companies, recognized a gap in the 
              market for high-quality, practical programming education. They combined their industry expertise 
              with a passion for teaching to create courses that not only teach theory but also focus on 
              real-world application.
            </p>
            <p>
              Today, we're proud to offer a wide range of courses covering everything from programming 
              fundamentals to advanced topics in machine learning and system design. Our commitment to 
              excellence and student success drives everything we do.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg">
            Learn from experienced professionals who are passionate about education
          </p>
        </div>

        <div className="flex justify-center mb-16">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all border-border hover:border-primary group">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                  {member.role}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <Card className="bg-gradient-hero border-border">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose TakeYouUp?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                "Industry-expert instructors with years of experience",
                "Hands-on projects and real-world applications",
                "Flexible learning at your own pace",
                "Active community support and mentorship",
                "Regular content updates with latest technologies",
                "Career guidance and interview preparation"
              ].map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-gradient-primary p-1 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  </div>
                  <p className="text-muted-foreground">{reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default About
