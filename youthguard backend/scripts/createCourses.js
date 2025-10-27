/**
 * Bulk Course Creation Script
 * Creates 20 diverse courses with unique content, images, and data
 */

require('dotenv').config();
const mongoose = require('mongoose');
require('../src/models/Course');
const Course = mongoose.model('Course');

// Sample course data with real images and diverse content
const coursesData = [
    {
        title: "Web Development Fundamentals",
        description: "Master HTML, CSS, and JavaScript to build modern websites. Learn responsive design, DOM manipulation, and best practices for front-end development.",
        category: "Programming",
        instructor: "Sarah Johnson",
        duration: 45,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
        rating: 4.8,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Introduction to Cybersecurity",
        description: "Learn the fundamentals of cybersecurity, ethical hacking, and how to protect systems from cyber threats in today's digital world.",
        category: "Security",
        instructor: "Dr. Michael Smith",
        duration: 35,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
        rating: 4.7,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Digital Marketing Mastery",
        description: "Comprehensive guide to digital marketing including SEO, social media marketing, content creation, and analytics to grow your online presence.",
        category: "Marketing",
        instructor: "Emma Wilson",
        duration: 40,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        rating: 4.6,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Python Programming for Beginners",
        description: "Start your programming journey with Python. Learn variables, functions, loops, and object-oriented programming concepts.",
        category: "Programming",
        instructor: "James Rodriguez",
        duration: 50,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
        rating: 4.9,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Graphic Design with Adobe Creative Suite",
        description: "Master Photoshop, Illustrator, and InDesign to create stunning visual designs for print and digital media.",
        category: "Design",
        instructor: "Lisa Chen",
        duration: 60,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
        rating: 4.5,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Data Science with R",
        description: "Analyze data, create visualizations, and build predictive models using R programming language and statistical methods.",
        category: "Data Science",
        instructor: "Dr. Robert Kim",
        duration: 55,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        rating: 4.4,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Mobile App Development with React Native",
        description: "Build cross-platform mobile applications for iOS and Android using React Native framework and JavaScript.",
        category: "Mobile Development",
        instructor: "Alex Thompson",
        duration: 65,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        rating: 4.7,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Financial Literacy for Young Adults",
        description: "Learn budgeting, saving, investing, and financial planning to secure your financial future and make informed money decisions.",
        category: "Finance",
        instructor: "Maria Garcia",
        duration: 30,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
        rating: 4.8,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Cloud Computing with AWS",
        description: "Master Amazon Web Services including EC2, S3, Lambda, and other cloud services to build scalable applications.",
        category: "Cloud Computing",
        instructor: "David Park",
        duration: 70,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
        rating: 4.6,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "UI/UX Design Principles",
        description: "Create user-friendly interfaces and exceptional user experiences through design thinking, prototyping, and usability testing.",
        category: "Design",
        instructor: "Sophie Anderson",
        duration: 45,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop",
        rating: 4.9,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Blockchain and Cryptocurrency Basics",
        description: "Understand blockchain technology, cryptocurrencies, smart contracts, and the future of decentralized finance.",
        category: "Technology",
        instructor: "Kevin Lee",
        duration: 40,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
        rating: 4.3,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Content Creation for Social Media",
        description: "Learn to create engaging content for Instagram, TikTok, YouTube, and other platforms to build your personal brand.",
        category: "Content Creation",
        instructor: "Zoe Williams",
        duration: 35,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
        rating: 4.7,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Machine Learning with Python",
        description: "Build intelligent systems using machine learning algorithms, scikit-learn, and TensorFlow for real-world applications.",
        category: "Artificial Intelligence",
        instructor: "Dr. Priya Patel",
        duration: 80,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
        rating: 4.8,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "E-commerce Business Setup",
        description: "Start your online business with Shopify, learn product sourcing, marketing strategies, and customer service excellence.",
        category: "Business",
        instructor: "Mark Johnson",
        duration: 50,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
        rating: 4.5,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Video Editing with Adobe Premiere Pro",
        description: "Create professional videos with advanced editing techniques, color grading, audio mixing, and motion graphics.",
        category: "Video Production",
        instructor: "Carlos Martinez",
        duration: 55,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop",
        rating: 4.6,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Network Security and Ethical Hacking",
        description: "Learn penetration testing, vulnerability assessment, and ethical hacking techniques to secure networks and systems.",
        category: "Security",
        instructor: "Dr. Ahmed Hassan",
        duration: 75,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=250&fit=crop",
        rating: 4.9,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Photography and Photo Editing",
        description: "Master camera techniques, composition, lighting, and post-processing with Lightroom and Photoshop for stunning photos.",
        category: "Photography",
        instructor: "Isabella Rodriguez",
        duration: 45,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop",
        rating: 4.7,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Project Management Professional (PMP)",
        description: "Prepare for PMP certification with project planning, risk management, team leadership, and agile methodologies.",
        category: "Management",
        instructor: "Thomas Brown",
        duration: 60,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
        rating: 4.4,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "WordPress Website Development",
        description: "Build professional websites using WordPress, custom themes, plugins, and SEO optimization for business success.",
        category: "Web Development",
        instructor: "Rachel Green",
        duration: 40,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop",
        rating: 4.6,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "Game Development with Unity",
        description: "Create 2D and 3D games using Unity engine, C# programming, game physics, and monetization strategies.",
        category: "Game Development",
        instructor: "Ryan Cooper",
        duration: 90,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=250&fit=crop",
        rating: 4.8,
        createdBy: new mongoose.Types.ObjectId()
    }
];

async function createCourses() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youthguard_dev');
        console.log('Connected to MongoDB');

        // Clear existing courses (optional)
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Create courses
        const createdCourses = await Course.insertMany(coursesData);
        console.log(`✅ Successfully created ${createdCourses.length} courses`);

        // Display created courses
        createdCourses.forEach((course, index) => {
            console.log(`${index + 1}. ${course.title} - ${course.category} - Rating: ${course.rating}`);
        });

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error creating courses:', error);
        process.exit(1);
    }
}

// Run the script
createCourses();