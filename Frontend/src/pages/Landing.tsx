import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {ReactTyped}  from 'react-typed';
import webinterface from '../assets/interface.png';
// import axios from 'axios';

// interface Message {
//     type: 'user' | 'ai';
//     content: string;
// }



const Landing = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

    const [faqs] = useState([
        {
            id: 1,
            question: "How does the AI tutoring work?",
            answer: "Our AI analyzes your questions and provides detailed explanations using advanced natural language processing."
        },
        {
            id: 2,
            question: "Is it suitable for all chemistry levels?",
            answer: "Yes! We cover high school to university-level chemistry, adapting to your specific needs."
        },
        {
            id: 3,
            question: "Can I access it on mobile devices?",
            answer: "Absolutely! Our platform is fully responsive and works on all devices."
        }
    ]);

    const handleFAQClick = (id: number) => {
        setExpandedFaqs(prev => 
            prev.includes(id) 
                ? prev.filter(faqId => faqId !== id) 
                : [...prev, id]
        );
    };
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold" style={{color: '#C62828'}}>LearnWhitehouse</h1>
                        </div>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden cursor-pointer">
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
                            {/* <a href="#demo" className="text-gray-700 hover:text-gray-900 transition-colors">Try Demo</a> */}
                            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-gray-900 transition-colors">Testimonials</a>
                            <Link to="/login" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all">
                                Get Started
                            </Link>
                        </div>

                        {/* mobile navigation */}
                        <div className={`md:hidden fixed top-16 right-0 w-1/2 h-full bg-white shadow-lg rounded-bl-2xl 
                            transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                            <div className="flex flex-col space-y-4 p-6">
                            <a onClick={toggleMenu} href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
                                <a onClick={toggleMenu} href="#features" className="text-gray-700 hover:text-red-600 transition-colors">Features</a>
                                <a onClick={toggleMenu} href="#testimonials" className="text-gray-700 hover:text-red-600 transition-colors">Testimonials</a>
                                <Link onClick={toggleMenu} to="/login" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all text-center">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="h-24 mb-6">
                        <ReactTyped
                            strings={[
                                'Master Chemistry with AI-Powered Learning',
                                'Transform Your Chemistry Studies with AI',
                                'Learn Chemistry the Smart Way',
                                'Ace Your Chemistry Classes with AI'
                            ]}
                            typeSpeed={50}
                            backSpeed={30}
                            backDelay={1500}
                            showCursor={false}
                            loop
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-700"
                        />
                    </div>
                    <p className="text-lg sm:text-xl text-gray-600 mb-8">
                        Enhance your understanding through personalized practice questions, 
                        instant feedback, and AI-guided learning tailored to your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
                        <Link 
                            to="/register" 
                            className="bg-red-600 text-white px-8 py-3 rounded-full 
                                     hover:bg-red-700 transition-all transform hover:scale-105
                                     text-center"
                        >
                            Start Learning Now
                        </Link>
                        <Link 
                            to="/login" 
                            className="border-2 border-red-600 text-red-600 px-8 py-3 
                                     rounded-full hover:bg-red-50 transition-all
                                     text-center"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="relative max-w-6xl mx-auto">
                        <div className="absolute inset-0 bg-red-100 rounded-3xl filter blur-3xl opacity-70  "></div>
                        <img 
                            src={webinterface}
                            alt="Chemistry Learning Platform" 
                            className="relative z-10 w-[60%] h-auto rounded-2xl shadow-2xl left-[20%] hidden md:block"
                        />
                    </div>
                </div>
            </section>

                        {/* About Us Section */}
                        <section id="about" className="py-24 bg-gradient-to-br from-red-50 via-white to-red-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    
                    <div className="relative">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="inline-block">
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-full px-6 py-2">
                                        <span className="h-3 w-3 bg-red-600 rounded-full"></span>
                                        <span className="text-red-600 font-semibold">About LearnWhitehouse</span>
                                    </div>
                                </div>
                                <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                                    Revolutionizing Chemistry Education with{' '}
                                    <span className="text-red-600">Atomix AI</span>
                                </h2>
                                <p className="text-lg text-gray-600">
                                    LearnWhitehouse is more than just a learning platform. Powered by our advanced 
                                    Atomix AI model, we're transforming how students master chemistry through 
                                    personalized learning experiences, real-time assistance, and adaptive feedback.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                        <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                                        <div className="text-gray-600">AI Support Available</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                        <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
                                        <div className="text-gray-600">Student Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8">
                                    <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gradient-to-r from-red-50 to-red-100 p-8">
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center space-y-4">
                                                <div className="inline-block p-4 bg-white rounded-full shadow-lg">
                                                    <svg className="w-16 h-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-800">Meet Atomix</h3>
                                                <p className="text-gray-600">
                                                    Our advanced AI model designed specifically for chemistry education, 
                                                    providing intelligent responses and personalized learning paths.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-600">Smart Analysis</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-600">Adaptive Learning</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="inline-block py-10">
                    <div className="flex items-center space-x-3 bg-red-50 rounded-full px-6 py-2">
                                        <span className="h-3 w-3 bg-red-600 rounded-full"></span>
                                        <span className="text-red-600 font-semibold">Why Choose LearnWhitehouse</span>
                                    </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">AI-Powered Learning</h3>
                            <p className="text-gray-600">Personalized chemistry questions generated by AI based on your course material.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Feedback</h3>
                            <p className="text-gray-600">Get immediate results and detailed explanations for each question.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Course Variety</h3>
                            <p className="text-gray-600">Access questions from multiple chemistry courses and topics.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-white via-red-50 to-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-grid-gray-100 opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-transparent to-red-50 opacity-30"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-red-50 rounded-full px-4 py-2 mb-4">
                            <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                            <span className="text-red-600 font-semibold">Your Learning Journey</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Master Chemistry with Atomix AI</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Experience a revolutionary way to learn chemistry with our AI-powered platform</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="absolute top-0 right-0 bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">Step 1</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Access Chemistry Content</h3>
                            <p className="text-gray-600">Explore our comprehensive chemistry curriculum and AI-generated practice materials</p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <span className="absolute top-0 right-0 bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">Step 2</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Practice with AI</h3>
                            <p className="text-gray-600">Get personalized questions and detailed explanations from our Atomix AI</p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <span className="absolute top-0 right-0 bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">Step 3</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Interactive Learning</h3>
                            <p className="text-gray-600">Chat with our AI tutor for instant help and deeper understanding</p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <span className="absolute top-0 right-0 bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">Step 4</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Track Progress</h3>
                            <p className="text-gray-600">Monitor your improvement and master chemistry concepts</p>
                        </div>
                    </div>
                </div>
            </section>


<section className="py-20 bg-gradient-to-b from-white to-red-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Join Our Chemistry Learning Community
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Connect with fellow chemistry students, share knowledge, and learn together. 
                    Our community chat provides a supportive environment for collaborative learning.
                </p>
                <a 
                    href=""
                    className="inline-flex gap-1 items-center bg-red-600 text-white px-8 py-3 rounded-full 
                             hover:bg-red-700 transition-all transform hover:scale-105"
                >
                                        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Join Community</span>
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold ml-4 text-gray-800">Community Features</h3>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Real-time discussions with students and tutors
                        </li>
                        <li className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Share and solve chemistry problems together
                        </li>
                        <li className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Weekly study groups and discussions
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
            
<section className="py-20 ">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
    {faqs.map((faq) => (
        <div key={faq.id} className="bg-white sm:bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm sm:shadow-md hover:shadow-lg transition-all duration-300">
            <div 
                onClick={() => handleFAQClick(faq.id)}
                className="flex justify-between items-center cursor-pointer"
            >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 pr-4">
                    {faq.question}
                </h3>
                <span className="text-red-600 text-xl font-medium min-w-[24px] text-center">
                    {expandedFaqs.includes(faq.id) ? '−' : '+'}
                </span>
            </div>
            <p className={`text-gray-600 mt-3 text-base sm:text-lg transition-all duration-300 ${
                expandedFaqs.includes(faq.id) 
                    ? 'max-h-48 opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                {faq.answer}
            </p>
        </div>
    ))}
</div>
                </div>
            </section>


            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
                        What Students Say
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl font-bold text-red-600">S</span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                                    <p className="text-sm text-gray-500">Chemistry 101 Student</p>
                                </div>
                            </div>
                            <p className="text-gray-600">"LearnWhitehouse transformed my chemistry journey! The AI tutor breaks down complex concepts into bite-sized pieces, making even organic chemistry feel manageable. The interactive practice sessions are like having a personal tutor available 24/7!"</p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl font-bold text-red-600">P</span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-800">Praise Oluranti</h4>
                                    <p className="text-sm text-gray-500">200Lvl Student</p>
                                </div>
                            </div>
                            <p className="text-gray-600">"As a chemistry student, I was struggling with balancing equations and understanding reaction mechanisms. The Atomix AI's step-by-step explanations and visual aids have been a game-changer. My grades have improved significantly!"</p>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl font-bold text-red-600">M</span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-800">Michael Chen</h4>
                                    <p className="text-sm text-gray-500">Advanced Chemistry Student</p>
                                </div>
                            </div>
                            <p className="text-gray-600">"The personalized learning path and instant feedback have revolutionized my study routine. The AI adapts to my pace and learning style, making complex chemistry concepts crystal clear. It's like having a brilliant tutor in my pocket!"</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">LearnWhitehouse</h3>
                            <p className="text-gray-400">Empowering chemistry education through AI</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Try Demo</a></li>
                                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <p className="text-gray-400">Email: info@learnwhitehouse.com</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>© {new Date().getFullYear()} LearnWhitehouse. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;