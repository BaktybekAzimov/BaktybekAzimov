import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Layout and Effects
import WaterDrops from '../components/effects/WaterDrops';

// Hero
import PremiumHero from '../components/hero/PremiumHero';

// New Sections (from spec)
import CompanyIntro from '../components/sections/CompanyIntro';
import HealthBenefits from '../components/sections/HealthBenefits';
import OriginStory from '../components/sections/OriginStory';
import ExportMap from '../components/sections/ExportMap';
import B2BSection from '../components/sections/B2BSection';
import Certificates from '../components/sections/Certificates';
import ContactCTA from '../components/sections/ContactCTA';

// Existing Sections
import HorizontalProducts from '../components/sections/HorizontalProducts';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ProductGallery from '../components/products/ProductGallery';

// Animations
import RevealMask from '../components/animations/RevealMask';
import SplitText from '../components/animations/SplitText';

// UI Components
import BrandCard from '../components/brands/BrandCard';
import NumberCounter from '../components/common/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Brands section with 3D card flip animation
    const brandCards = gsap.utils.toArray('.brand-card');
    brandCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 200,
        rotationY: -90,
        rotationX: -30,
        scale: 0.7,
        duration: 1.2,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
          scrub: false
        },
        delay: index * 0.2
      });

      // Hover parallax effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 10;
        const y = (e.clientY - rect.top - rect.height / 2) / 10;

        gsap.to(card, {
          rotationY: x,
          rotationX: -y,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });

    // Sections reveal with stagger
    gsap.utils.toArray('section').forEach((section, index) => {
      if (section.classList.contains('brands-section')) return;

      const elements = section.querySelectorAll('h2, h3, p, .feature-item, img');

      gsap.from(elements, {
        opacity: 0,
        y: 80,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 25%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Parallax backgrounds
    gsap.utils.toArray('.parallax-bg').forEach(bg => {
      gsap.to(bg, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: bg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // Number counters animation
    gsap.utils.toArray('.number-counter').forEach(counter => {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: () => {
          const target = parseInt(counter.getAttribute('data-target'));
          gsap.to(counter, {
            innerText: target,
            duration: 2,
            ease: 'power1.out',
            snap: { innerText: 1 },
            onUpdate: function() {
              counter.innerText = Math.ceil(counter.innerText);
            }
          });
        }
      });
    });

    // Pin and fade sections
    gsap.utils.toArray('.pin-section').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=500',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Water drops effect */}
      <WaterDrops count={30} />

      {/* 1. HERO SECTION */}
      <PremiumHero />

      {/* 2. COMPANY INTRO SECTION (NEW - from spec) */}
      <CompanyIntro />

      {/* 3. PRODUCTS SHOWCASE */}
      <section className="brands-section py-24 bg-gradient-to-b from-white to-off-white relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="section-badge">Наша продукция</span>
            </div>
            <h2 className="font-primary text-h1 text-dark-navy mb-6">
              Семья брендов Келечек
            </h2>
            <p className="text-body-large text-text-secondary max-w-3xl mx-auto">
              От премиальной лечебно-столовой воды до освежающих лимонадов -
              мы создаем продукты мирового класса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="brand-card">
              <BrandCard
                title="KELECHEK №27"
                subtitle="Premium Mineral Water"
                to="/brands/kelechek"
                bgClass="bg-gradient-primary"
              />
            </div>

            <div className="brand-card">
              <BrandCard
                title="ADYGENE"
                subtitle="Glacier Water 4,216m"
                to="/brands/adygene"
                bgClass="bg-gradient-ice"
              />
            </div>

            <div className="brand-card">
              <BrandCard
                title="GIMALAI"
                subtitle="Living Water"
                to="/brands/gimalai"
                bgClass="bg-gradient-hero"
              />
            </div>

            <div className="brand-card">
              <BrandCard
                title="ЛИМОНАДЫ"
                subtitle="Яркие вкусы"
                to="/brands/lemonads"
                bgClass="bg-gradient-to-br from-yellow-300 via-green-400 to-orange-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Gallery & Horizontal Products */}
      <ProductGallery />
      <HorizontalProducts />

      {/* 4. HEALTH BENEFITS SECTION (NEW - from spec) */}
      <HealthBenefits />

      {/* 5. ORIGIN STORY SECTION (NEW - from spec) */}
      <OriginStory />

      {/* 6. EXPORT MAP SECTION (NEW - from spec) */}
      <ExportMap />

      {/* 7. B2B SECTION (NEW - from spec) */}
      <B2BSection />

      {/* 8. TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* 9. CERTIFICATES SECTION (NEW - from spec) */}
      <Certificates />

      {/* 10. CONTACT CTA SECTION (NEW - from spec) */}
      <ContactCTA />
    </div>
  );
};

export default Home;
