import HeroSection       from "./sections/HeroSection"
import CategoryCards     from "./sections/CategoryCards"
import ProductsSection   from "./sections/ProductsSection"
import CandleTypesSection from "./sections/CandleTypesSection"
import ReviewsSection    from "./sections/ReviewsSection"
import NewsletterSection from "./sections/NewsletterSection"

const HomePage = () => (
    <div className="w-full">
        <HeroSection />
        <CategoryCards />
        <ProductsSection />
        <CandleTypesSection />
        <ReviewsSection />
        <NewsletterSection />
    </div>
)

export default HomePage
