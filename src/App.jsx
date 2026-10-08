import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, MapPin, CheckCircle, Mail, Menu, X, MessageCircle, ChevronLeft, ChevronRight, Phone, Building, Plus, Minus, Headphones } from 'lucide-react';
import detailImg from './assets/detail.jpg';
import aboutImg from './assets/about.jpg';

// Animated Counter
function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            let startTime = null;
            const animate = (time) => {
                if (!startTime) startTime = time;
                const progress = Math.min((time - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 4);
                setCount(Math.floor(ease * end));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}<span className="stat-suffix">{suffix}</span></span>;
}

// Scroll Reveal Text
const ScrollRevealText = ({ text }) => {
    const words = text.split(" ");
    const container = useRef(null);
    const { scrollYProgress } = useScroll({ target: container, offset: ["start 85%", "end 60%"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 25, restDelta: 0.001 });

    return (
        <div ref={container} className="reveal-text-container">
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 0.2;
                const opacity = useTransform(smoothProgress, [start, end], [0.15, 1]);
                return (
                    <motion.span key={i} style={{ opacity, display: 'inline-block', marginRight: '0.25em', marginBottom: '0.1em' }}>
                        {word}
                    </motion.span>
                );
            })}
        </div>
    );
};

// Products Data
const productsData = [
    { img: "/Industrial MS Structural Construction potrait.png", title: "Industrial MS Structural Construction", desc: "Reliable steel frameworks built from the ground up for industrial buildings and factories." },
    { img: "/ind. shead and wharehouse potrait.png", title: "Industrial Shed & Warehouse", desc: "Strong, weather-proof steel buildings designed for storage and large-scale manufacturing." },
    { img: "/MS industrial heavy fabrication potrait.png", title: "MS Industrial Heavy Fabrication", desc: "Large-scale mild steel structures custom-built for high-strength industrial use." },
    { img: "/Railings, Gates & Staircases potrait.png", title: "Railings, Gates & Staircases", desc: "Durable and safe steel access structures built for heavy daily industrial traffic." },
    { img: "/roofing and cladding potrait.png", title: "Roofing & Cladding", desc: "High-quality industrial roofing to protect your facilities from harsh weather." },
    { img: "/ms tanks potrait.png", title: "MS Industrial Tank", desc: "Heavy-duty steel tanks engineered to store high volumes of industrial liquids." },
    { img: "/ms heavy duty platforms potrait.png", title: "MS Heavy Duty Platforms", desc: "Robust and secure multi-level platforms designed for safe, heavy industrial workspaces." },
    { img: "/Heavy Structural Fabrication Work potrait.png", title: "Heavy Structural Fabrication Work", desc: "Customized heavy steel work manufactured strictly to your engineering blueprints." },
    { img: "/ms trolley potrait.png", title: "MS Trolleys", desc: "Solid steel trolleys for material transport across heavy industrial floors." },
    { img: "/ss locks potrait.png", title: "SS Lockers", desc: "Secure and durable stainless steel lockers designed perfectly for staff." }
];

// How We Work Steps Data
const stepsData = [
    { num: "01", img: "/step1.webp", title: "Initial Consultation", desc: "We sit down with you, understand your exact requirements, and provide honest professional recommendations." },
    { num: "02", img: "/step2.png", title: "Proposal & Budgeting", desc: "We create a clear, detailed proposal covering materials, timelines, and a transparent cost breakdown." },
    { num: "03", img: "/step3.webp", title: "Engineering & Design", desc: "Our engineers draft precision blueprints and structural designs tailored specifically to your project." },
    { num: "04", img: "/step4.webp", title: "Fabrication & Delivery", desc: "We fabricate every component to exact spec in our factory and deliver it safely to your site on time." }
];

// Product Carousel — True Infinite Loop Portrait Cards
function ProductCarousel() {
    // current continues infinitely (+1 or -1)
    const [current, setCurrent] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const total = productsData.length;
    const autoRef = useRef(null);

    const next = useCallback(() => setCurrent(c => c + 1), []);
    const prev = useCallback(() => setCurrent(c => c - 1), []);

    useEffect(() => {
        if (!selectedProduct) {
            autoRef.current = setInterval(next, 4000);
        }
        return () => clearInterval(autoRef.current);
    }, [next, selectedProduct]);

    const handleNav = (fn) => {
        clearInterval(autoRef.current);
        fn();
        autoRef.current = setInterval(next, 4000);
    };

    useEffect(() => {
        productsData.forEach(({ img }) => { const i = new Image(); i.src = img; });
    }, []);

    // Generate a centered window of 5 cards to render
    const getRenderedCards = () => {
        const cards = [];
        for (let i = -2; i <= 2; i++) {
            const visualIndex = current + i;
            // modulo math that handles negative numbers perfectly
            const dataIndex = ((visualIndex % total) + total) % total;
            cards.push({ ...productsData[dataIndex], dataIndex, visualIndex, offset: i });
        }
        return cards;
    };

    // Calculate actual active index for dots & counter
    const activeDataIndex = ((current % total) + total) % total;

    return (
        <div className="carousel-root">
            <div className="carousel-viewport">
                <AnimatePresence custom={current}>
                    {getRenderedCards().map((item) => (
                        <motion.div
                            key={item.visualIndex}
                            className="carousel-slide"
                            initial={{
                                opacity: 0,
                                scale: 0.85,
                                x: `calc(${item.offset > 0 ? 3 : -3} * (var(--slide-w) + var(--slide-gap)))`
                            }}
                            animate={{
                                opacity: Math.abs(item.offset) > 1 ? 0 : (Math.abs(item.offset) === 0 ? 1 : 0.6),
                                scale: Math.abs(item.offset) === 0 ? 1 : 0.9,
                                x: `calc(${item.offset} * (var(--slide-w) + var(--slide-gap)))`
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.85,
                                x: `calc(${item.offset < 0 ? -3 : 3} * (var(--slide-w) + var(--slide-gap)))`
                            }}
                            style={{ willChange: "transform, opacity", cursor: 'pointer' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => setSelectedProduct(productsData[item.dataIndex])}
                        >
                            {/* Background image */}
                            <img className="carousel-bg-img" src={item.img} alt={item.title} />
                            {/* Gradient overlay + text */}
                            <div className="carousel-overlay">
                                <div className="carousel-slide-num">0{item.dataIndex + 1}</div>
                                <h3 className="carousel-slide-title">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Side arrows overlaid on the viewport */}
                <button className="carousel-arrow carousel-arrow--left" onClick={() => handleNav(prev)}>
                    <ChevronLeft size={28} />
                </button>
                <button className="carousel-arrow carousel-arrow--right" onClick={() => handleNav(next)}>
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Dots + counter below */}
            <div className="carousel-controls">
                <div className="carousel-dots">
                    {productsData.map((_, i) => (
                        <button
                            key={i}
                            className={`carousel-dot ${i === activeDataIndex ? 'carousel-dot--active' : ''}`}
                            onClick={() => {
                                // Jump current so it lands on the selected index smoothly
                                const diff = i - activeDataIndex;
                                handleNav(() => setCurrent(c => c + diff));
                            }}
                        />
                    ))}
                </div>
                <div className="carousel-counter">
                    <span className="carousel-counter-current">{String(activeDataIndex + 1).padStart(2, '0')}</span>
                    <span className="carousel-counter-sep"> / </span>
                    <span className="carousel-counter-total">{String(total).padStart(2, '0')}</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '500', letterSpacing: '0.5px' }}>
                    <strong style={{ color: '#C89F51' }}>Note:</strong> Click on any product above to know more details.
                </span>
            </div>

            {/* Product Modal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div
                            className="product-modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                        >
                            <motion.div
                                className="product-modal-content"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <button className="modal-close" onClick={() => setSelectedProduct(null)}>
                                    <X size={24} />
                                </button>
                                <div className="modal-img-col">
                                    <img src={selectedProduct.img} alt={selectedProduct.title} />
                                </div>
                                <div className="modal-text-col">
                                    <div className="arch-tag" style={{ color: 'var(--text-secondary)' }}>Product Details</div>
                                    <h3 style={{ color: 'var(--text-primary)' }}>{selectedProduct.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}><strong>SS Engineering provides you the {selectedProduct.title}.</strong> {selectedProduct.desc} Engineered for heavy industrial use cases, offering robust construction and maximum reliability across all structural applications.</p>
                                    <a
                                        href={`https://wa.me/917891371290?text=${encodeURIComponent(`Hey, I want to know more about ${selectedProduct.title}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-primary"
                                        style={{ marginTop: '32px', alignSelf: 'flex-start' }}
                                    >
                                        Know More <ArrowRight size={18} />
                                    </a>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

// Bento Gallery Section (Ironclad Inspired)
function BentoSection() {
    return (
        <section className="bento-section">
            <div className="container bento-grid">

                {/* Left Column */}
                <motion.div
                    className="bento-col bento-left"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="heading-lg">Built on Integrity.<br />Engineered for<br />Durability.</h2>
                    <div className="bento-img-wrap img-bottom left-img">
                        <picture>
                            <source media="(max-width: 768px)" srcSet="/2.png" />
                            <img src="/1.png" alt="Construction Phase 1" />
                        </picture>
                    </div>
                </motion.div>

                {/* Center Column */}
                <motion.div
                    className="bento-col bento-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <div className="bento-img-wrap img-tall center-img">
                        <img src="/2.png" alt="Construction Phase 2" />
                    </div>
                </motion.div>

                {/* Right Column */}
                <motion.div
                    className="bento-col bento-right"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="bento-text-box">
                        <p>We've built a relentless reputation on quality and execution. Our structural steel fabrication and rigorous civil works are completely tailored to your industrial needs and built to last.</p>
                        <a href="#howwork" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '11px', gap: '8px' }}>Learn More <ArrowRight size={16} /></button>
                        </a>
                    </div>
                    <div className="bento-img-wrap img-bottom right-img">
                        <img src="/3.png" alt="Construction Phase 3" />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}


// How We Work — Sticky Scroll + CSS Crossfade (original design)
function HowWeWork() {
    const sectionRef = useRef(null);
    const stepRefs = useRef([]);
    const [activeStep, setActiveStep] = useState(0);

    // Scroll-progress line — pure MotionValue, zero re-renders
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end center"]
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // IntersectionObserver activates step when it enters the middle band
    useEffect(() => {
        const observers = stepRefs.current.map((el, i) => {
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
                { threshold: 0, rootMargin: "-30% 0px -60% 0px" }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach(o => o?.disconnect());
    }, []);

    // Preload images
    useEffect(() => {
        stepsData.forEach(({ img }) => { const i = new Image(); i.src = img; });
    }, []);

    return (
        <section className="howwork-section" id="howwork" ref={sectionRef}>
            <div className="container">
                <div className="howwork-layout">

                    {/* LEFT — sticky */}
                    <div className="howwork-left">
                        <div className="arch-tag">Our Process</div>
                        <h2 className="heading-lg">How We Work</h2>
                        <p className="subtext" style={{ marginTop: '20px' }}>
                            From the first conversation to the final delivery — we handle everything professionally and on time.
                        </p>
                        <div className="howwork-sticky-img-wrap">
                            {stepsData.map((step, i) => (
                                <img
                                    key={i}
                                    src={step.img}
                                    alt={step.title}
                                    className={`howwork-img ${activeStep === i ? 'howwork-img--active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — steps + scroll line */}
                    <div className="howwork-right">
                        <div className="howwork-timeline">
                            <div className="howwork-timeline-track" />
                            <motion.div className="howwork-timeline-fill" style={{ height: lineHeight }} />
                        </div>
                        {stepsData.map((step, i) => (
                            <div
                                key={i}
                                ref={el => stepRefs.current[i] = el}
                                className={`howwork-step ${activeStep === i ? 'howwork-step--active' : ''}`}
                            >
                                <div className="howwork-step-num">{step.num}</div>
                                <div className="howwork-step-content">
                                    <h3>{step.title}</h3>
                                    <div className="howwork-step-body">
                                        <p>{step.desc}</p>
                                        <img src={step.img} alt={step.title} className="howwork-mobile-img" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

// FAQ Section
const faqs = [
    { q: "Can I request a custom quote?", a: "Yes, absolutely. We provide tailored cost estimates based on your exact blueprints, structural requirements, and material preferences." },
    { q: "How long does a typical steel project take?", a: "Project timelines vary based on scale and complexity. A standard industrial shed might take a few weeks, while heavy structural setups could require months. We establish clear timelines during our proposal phase." },
    { q: "What types of buildings do you work on?", a: "We specialize in industrial facilities, warehouses, commercial factories, standard sheds, and heavy MS/SS structural constructions." },
    { q: "Do you offer design and engineering support?", a: "Yes, we have dedicated structural engineers who ensure every blueprint meets rigorous safety and quality standards before any fabrication begins." },
    { q: "Can you help with both fabrication and installation?", a: "We provide comprehensive end-to-end services. From precision in-house fabrication at our facility to safe, on-site installation by our experienced team." }
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="faq-section" id="faq">
            <div className="container">
                <div className="faq-layout">
                    {/* Left Column */}
                    <motion.div className="faq-left"
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }} transition={{ duration: 0.6 }}
                    >
                        <h2 className="heading-lg" style={{ marginBottom: '40px' }}>Frequently Asked<br />Questions</h2>

                        <div className="faq-contact-card">
                            <div className="faq-card-content">
                                <h3>Still have questions?</h3>
                                <p>We're here to provide the insights and technical details you need.</p>
                                <a href="#contact" className="faq-contact-link">
                                    Contact Us <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column / Accordion */}
                    <div className="faq-accordion">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, margin: "-20px" }} transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                >
                                    <div className="faq-header">
                                        <h4 className="faq-question">{faq.q}</h4>
                                        <div className="faq-icon">
                                            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="faq-answer-wrap"
                                            >
                                                <div className="faq-answer">{faq.a}</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Contact Section
function ContactSection() {
    const [formData, setFormData] = useState({ name: '', phone: '', service: productsData[0].title, message: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `Hello, I have an inquiry.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.service}${formData.message ? `\nMessage: ${formData.message}` : ''}`;
        window.open(`https://wa.me/917891371290?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <section className="contact-section" id="contact">
            <div className="container">
                <div className="contact-layout">
                    {/* Left Info */}
                    <div className="contact-info">
                        <div className="arch-tag" style={{ color: 'rgba(255,255,255,0.6)' }}>Get in Touch</div>
                        <h2 className="heading-lg" style={{ color: '#FFFFFF' }}>Contact Us</h2>
                        <p className="subtext" style={{ marginTop: '20px', marginBottom: '40px', color: 'rgba(255,255,255,0.7)' }}>
                            Ready to start your next industrial project? Reach out to us for detailed estimates and technical consultations.
                        </p>

                        <div className="info-row">
                            <MapPin size={28} color="#FFFFFF" style={{ flexShrink: 0 }} />
                            <div className="info-text">
                                <h4 style={{ color: '#FFFFFF', fontSize: '15px' }}>Location</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>Unit No. TB 331, Capital Highstreet,<br />Phoolbag, RIICO Industrial Area,<br />Bhiwadi, Alwar, Raj. 301019</p>
                            </div>
                        </div>

                        <div className="info-row">
                            <Building size={28} color="#FFFFFF" style={{ flexShrink: 0 }} />
                            <div className="info-text">
                                <h4 style={{ color: '#FFFFFF', fontSize: '15px' }}>GST Number</h4>
                                <p style={{ fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>08BCZPS3233D1Z8</p>
                            </div>
                        </div>

                        <div className="info-row">
                            <Phone size={28} color="#FFFFFF" style={{ flexShrink: 0 }} />
                            <div className="info-text">
                                <h4 style={{ color: '#FFFFFF', fontSize: '15px', marginBottom: '16px' }}>Phone Numbers</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    <a href="tel:+918058025335" className="phone-pill">+91 805 802 5335</a>
                                    <a href="tel:+917891371290" className="phone-pill">+91 789 137 1290</a>
                                    <a href="tel:+917425001700" className="phone-pill">+91 742 500 1700</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <motion.div className="contact-form-wrap"
                        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-50px" }} transition={{ duration: 0.6 }}
                    >
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <h3 className="form-title">Send an Inquiry</h3>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Interested Service</label>
                                <select name="service" required value={formData.service} onChange={handleChange}>
                                    {productsData.map((p, i) => (
                                        <option key={i} value={p.title}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message (Optional)</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Any specific requirements..." rows="3"></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '24px', background: '#FFFFFF', color: '#111111', fontSize: '15px', fontWeight: '700' }}>
                                Continue to WhatsApp <ArrowRight size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const heroImages = ["/bg_image1.png", "/big image 2.png", "/big image 3.png"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroIndex(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const textReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
    };
    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
    };

    return (
        <>
            <header className={`header ${isScrolled ? 'solid' : 'transparent'}`}>
                <div className="logo-box">SS<span>.</span>Engineering</div>
                <nav className="nav-links">
                    <a href="#about">About</a>
                    <a href="#products">Products</a>
                    <a href="#howwork">Process</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div className="header-actions">
                    <a href="#contact" className="header-btn desktop-btn">Get Quote</a>
                    <a href="tel:7891371290" className="header-btn mobile-btn">Get Quote</a>
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div className="mobile-dropdown"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
                            <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
                            <a href="#howwork" onClick={() => setMenuOpen(false)}>Process</a>
                            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* HERO */}
            <section className="hero">
                <div className="video-wrap">
                    {heroImages.map((img, i) => (
                        <img
                            key={img}
                            src={img}
                            alt={`Background ${i + 1}`}
                            style={{
                                opacity: currentHeroIndex === i ? 1 : 0,
                                transition: 'opacity 1s ease-in-out',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0
                            }}
                        />
                    ))}
                    <div className="video-overlay" style={{ zIndex: 1 }}></div>
                </div>
                <div className="container hero-ui">
                    <motion.div className="hero-text-side" variants={stagger} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 2 }}>
                        <motion.div variants={textReveal} className="arch-tag" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>BUILDING BETTER TOMORROW</motion.div>
                        <motion.h1 variants={textReveal} className="heading-xl">Quality Construction<br />for a Stronger<br /><span style={{ color: '#C89F51' }}>Future</span></motion.h1>
                        <motion.p variants={textReveal} className="subtext hero-subtext">
                            From residential to commercial projects, we deliver reliable, innovative and cost-effective construction solutions tailored to your needs.
                        </motion.p>
                        <motion.div variants={textReveal} className="hero-actions">
                            <a href="#products">
                                <button className="btn-primary">Get a Free Quote <ArrowRight size={18} /></button>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Floating Premium Card on the right */}
                    <motion.div className="hero-floating-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <div className="card-top">
                            <div className="pulse-dot"></div>
                            <span>Active Project</span>
                        </div>
                        <h4>Heavy MS Fabrication</h4>
                        <p>Bhiwadi Industrial Zone</p>
                    </motion.div>
                </div>
            </section>

            {/* STATS */}
            <div className="stats-bar-wrapper">
                <motion.div className="stats-floating-card"
                    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }} transition={{ duration: 0.8 }}
                >
                    <div className="stats-inner-grid">
                        {[{ end: 25, s: '+', label: 'Years of Experience' }, { end: 250, s: '+', label: 'Completed Projects' }, { end: 40, s: '+', label: 'Team Members' }, { end: 98, s: '%', label: 'Satisfaction Rate' }].map(({ end, s, label }, i) => (
                            <div className="stat-block" key={i}>
                                <div className="stat-num"><AnimatedCounter end={end} suffix={s} /></div>
                                <div className="stat-text">{label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ABOUT */}
            <section className="about-section" id="about">
                <div className="container">
                    <div className="about-grid">
                        <motion.div className="about-img-col"
                            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-100px" }} transition={{ duration: 0.8 }}
                        >
                            <div className="about-img-wrap">
                                <img src="/ms heavy duty platforms potrait.png" alt="SS Engineering Production" />
                            </div>
                        </motion.div>
                        <div className="about-text-col">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6 }}>
                                <div className="arch-tag">Company Overview</div>
                                <h2 className="heading-lg" style={{ marginBottom: '24px' }}>Building the future of industry.</h2>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>About SS Engineering</h3>
                                <p className="subtext" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.7' }}>
                                    For over 25 years, SS Engineering has proudly provided top-tier industrial solutions. We specialize in precision steel fabrication, heavy structural layouts, and rigorous civil works designed specifically for industrial-scale applications.
                                </p>
                                <p className="subtext" style={{ fontSize: '16px', marginBottom: '40px' }}>
                                    We don't just supply metal; we deliver the foundational strength your business relies on. From customized warehouse sheds to complex multi-story platforms, our commitment to quality, durability, and on-time execution never wavers.
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.3 }}>
                                <a href="https://wa.me/917891371290" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-block', margin: '20px 0 0 0' }}>
                                    <button className="btn-secondary"><MessageCircle size={18} /> Contact Us</button>
                                </a>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mission & Values Section Below */}
                    {/* Mission & Values Section Below */}
                    <div className="mission-values-grid">
                        <motion.div className="mv-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.2, duration: 0.5 }}>
                            <div className="mv-icon-wrapper">
                                <CheckCircle size={28} color="#C89F51" strokeWidth={1.5} />
                            </div>
                            <h4 className="mv-title">Our Mission</h4>
                            <p className="mv-desc">To construct uncompromisingly secure and high-performance structures explicitly tailored to each client's operational demands, backed by precision engineering and robust materials.</p>
                        </motion.div>

                        <motion.div className="mv-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.4, duration: 0.5 }}>
                            <div className="mv-icon-wrapper">
                                <CheckCircle size={28} color="#C89F51" strokeWidth={1.5} />
                            </div>
                            <h4 className="mv-title">Our Values</h4>
                            <p className="mv-desc">We operate on the absolute core principles of integrity, accuracy, and unwavering reliability in every single blueprint and build, ensuring maximum safety standard adherence.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PRODUCTS CAROUSEL */}
            <section className="products-section" id="products">
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible"
                        viewport={{ once: false, margin: "-100px" }} variants={stagger}
                    >
                        <div className="section-header-left">
                            <motion.div variants={textReveal} className="arch-tag">Product Catalog</motion.div>
                            <motion.h2 variants={textReveal} className="heading-lg">Our Products</motion.h2>
                        </div>
                        <motion.div variants={textReveal}>
                            <p className="subtext" style={{ maxWidth: '440px' }}>
                                High-quality steel products built to be strong, safe, and reliable for all your heavy industrial needs.
                            </p>
                        </motion.div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }} transition={{ duration: 0.8 }}>
                        <ProductCarousel />
                    </motion.div>
                </div>
            </section>

            {/* BENTO GALLERY */}
            <BentoSection />

            {/* HOW WE WORK */}
            <HowWeWork />

            {/* FAQ */}
            <FAQSection />

            {/* CTA SECTION */}
            <section style={{ background: '#F8F9FA', padding: '60px 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
                    <div style={{ maxWidth: '700px' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 4vw, 42px)', color: '#111111', marginBottom: '20px', lineHeight: '1.2' }}>
                            Ready to Build Your Project with Quality Steel Structures?
                        </h2>
                        <p style={{ fontSize: '18px', color: '#555555', lineHeight: '1.6' }}>
                            Our expert team is ready to assist you from precise planning to rigorous on-site installation. Free consultation, no commitment!
                        </p>
                    </div>
                    <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#111111', color: '#FFFFFF', padding: '20px 40px', borderRadius: '99px', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        Get a Free Quote <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            {/* CONTACT */}
            <ContactSection />

            <footer className="footer" id="footer">
                <div className="container footer-grid">
                    <div className="footer-col">
                        <h4 className="footer-brand">SS Engineering</h4>
                        <ul className="footer-links" style={{ gap: '6px', color: 'var(--text-secondary)' }}>
                            <li>Phone: +91 78913 71290</li>
                            <li>Bhiwadi Industrial Zone, Rajasthan</li>
                            <li>GST: 08AABCS1429B1Z</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h5 className="footer-heading">Quick Links</h5>
                        <ul className="footer-links">
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#products">Products</a></li>
                            <li><a href="#howwork">Process</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container footer-bottom">
                    &copy; {new Date().getFullYear()} SS Engineering. All rights reserved.
                </div>
            </footer>
        </>
    );
}

export default App;
